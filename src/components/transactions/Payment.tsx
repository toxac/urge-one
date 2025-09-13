// src/components/Payment.tsx
import { createSignal, onMount, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { authStore } from '../../stores/auth';
import { supabaseBrowserClient } from '../../lib/supabase/client';
import type { Database } from '../../../database.types';
import {
    processEnrollment,
    processSubscription,
    processEventRegistration
} from '../../lib/payments/postPaymentFlows';
import {
    paymentStore,
    setPaymentIntent,
    setOffering,
    setDiscount,
    setPaymentState,
    setPaymentError,
    setTransactionId,
    resetPayment,
    isProcessing,
    currentState
} from '../../stores/payment';

interface PaymentProps {
    details: string;
    intent: 'enroll' | 'subscribe' | 'event';
}

type UserTransactionInsert = Database['public']['Tables']['user_transactions']['Insert'];

export default function Payment(props: PaymentProps) {
    const auth = useStore(authStore);
    const payment = useStore(paymentStore);
    const processing = useStore(isProcessing);
    const state = useStore(currentState);

    const [discountCode, setDiscountCode] = createSignal('');
    const [showSuccessModal, setShowSuccessModal] = createSignal(false);
    const [retryCount, setRetryCount] = createSignal(0);

    const supabase = supabaseBrowserClient;

    const fetchOffering = async () => {
        try {
            setPaymentState('fetching_offering');
            const { data, error } = await supabase
                .from('offerings')
                .select('*')
                .eq('related_entity_id', props.details)
                .eq('is_active', true)
                .single();

            if (error) throw error;
            setOffering(data);
            setPaymentState('idle');
        } catch (err) {
            setPaymentError('Failed to fetch offering');
            console.error(err);
        }
    };

    const applyDiscount = async () => {
        if (!discountCode() || !payment().offering) return;

        try {
            setPaymentState('applying_discount');
            const { data, error } = await supabase
                .from('discounts')
                .select('*')
                .eq('code', discountCode().toUpperCase())
                .eq('entity_id', props.details)
                .lte('valid_from', new Date().toISOString())
                .gte('valid_until', new Date().toISOString())
                .single();

            if (error) {
                setPaymentError('Invalid discount code');
                return;
            }

            setDiscount(data);
            setPaymentError(null);
            setPaymentState('idle');
        } catch (err) {
            setPaymentError('Invalid discount code');
        }
    };

    const calculateFinalPrice = () => {
        const basePrice = payment().offering?.base_price_amount || 0;
        const discount = payment().discount;

        if (!discount) return basePrice;

        if (discount.value_type === 'percentage') {
            return basePrice * (1 - discount.value / 100);
        } else {
            return Math.max(0, basePrice - discount.value);
        }
    };

    const processPaymentFlow = async (transactionId: string) => {
        const currentDate = new Date().toISOString();
        let flowResult;

        switch (props.intent) {
            case "enroll":
                flowResult = await processEnrollment(
                    auth().user!.id,
                    payment().offering!,
                    transactionId,
                    currentDate
                );
                break;
            case "subscribe":
                flowResult = await processSubscription(
                    auth().user!.id,
                    payment().offering!,
                    transactionId,
                    currentDate
                );
                break;
            case "event":
                flowResult = await processEventRegistration(
                    auth().user!.id,
                    payment().offering!,
                    transactionId,
                    currentDate
                );
                break;
            default:
                throw new Error("Unknown payment intent");
        }

        return flowResult;
    };

    const processPayment = async () => {
        if (!auth().user || !payment().offering) return;

        setPaymentState('processing_payment');
        setPaymentError(null);

        try {
            const finalAmount = calculateFinalPrice();
            const currentDate = new Date().toISOString();

            // Insert transaction record
            const transactionPayload: UserTransactionInsert = {
                user_id: auth().user!.id,
                offering_id: payment().offering!.id,
                offering_name: payment().offering!.name,
                offering_type: payment().offering!.entity_type,
                base_amount: payment().offering!.base_price_amount,
                discount_amount: payment().discount ?
                    (payment().offering!.base_price_amount || 0) - finalAmount : 0,
                discount_id: payment().discount?.id,
                currency: payment().offering!.currency,
                total_amount_paid: finalAmount,
                status: 'completed',
                payment_method: 'dummy',
                payment_provider: 'dummy_provider',
                provider_transaction_id: `dummy_${Date.now()}_${retryCount()}`,
                provider_data: { dummy: true, retry_count: retryCount() }
            };

            const { data: transactionData, error: transactionError } = await supabase
                .from('user_transactions')
                .insert(transactionPayload)
                .select()
                .single();

            if (transactionError) throw transactionError;

            setTransactionId(transactionData.id);
            setPaymentState('processing_flow');

            // Process the specific flow
            const flowResult = await processPaymentFlow(transactionData.id);

            if (!flowResult.success) {
                throw new Error(flowResult.error);
            }

            setPaymentState('success');
            setShowSuccessModal(true);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
            setPaymentError(errorMessage);
            console.error('Payment error:', err);

            // Increment retry count for next attempt
            setRetryCount(retryCount() + 1);
        }
    };

    const retryPayment = () => {
        setPaymentError(null);
        setPaymentState('idle');
        processPayment();
    };

    const resetAndRetry = () => {
        setDiscount(null);
        setDiscountCode('');
        setPaymentError(null);
        setPaymentState('idle');
        setRetryCount(0);
    };

    onMount(() => {
        setPaymentIntent(props.intent);
        fetchOffering();

        return () => resetPayment();
    });

    return (
        <div class="w-full md:w-3xl mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
            <h1 class="text-3xl font-bold text-center mb-8">Complete Your Payment</h1>

            <Show when={state() === 'fetching_offering'}>
                <div class="text-center">
                    <span class="loading loading-spinner loading-lg"></span>
                    <p class="mt-4">Loading offering details...</p>
                </div>
            </Show>

            <Show when={state() !== 'fetching_offering' && payment().offering}>
                <div class="space-y-6">
                    {/* Offering Details */}
                    <div class="card bg-base-200 p-6">
                        <h2 class="text-2xl font-semibold mb-4">{payment().offering?.name}</h2>
                        <p class="text-gray-600 mb-4">{payment().offering?.description}</p>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="font-semibold">Base Price:</span>
                                <p class="text-lg">
                                    {payment().offering?.currency} {payment().offering?.base_price_amount}
                                </p>
                            </div>
                            <div>
                                <span class="font-semibold">Duration:</span>
                                <p class="text-lg">{payment().offering?.duration_months} months</p>
                            </div>
                        </div>
                    </div>

                    {/* Discount Code */}
                    <div class="card bg-base-200 p-6">
                        <h3 class="text-xl font-semibold mb-4">Apply Discount</h3>
                        <div class="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter discount code"
                                value={discountCode()}
                                onInput={(e) => setDiscountCode(e.currentTarget.value)}
                                class="input input-bordered flex-1"
                                disabled={!!payment().discount || state() === 'processing_payment'}
                            />
                            <button
                                onClick={applyDiscount}
                                class="btn btn-primary"
                                disabled={!!payment().discount || !discountCode() || state() === 'applying_discount'}
                            >
                                {state() === 'applying_discount' ? (
                                    <span class="loading loading-spinner"></span>
                                ) : (
                                    'Apply'
                                )}
                            </button>
                        </div>

                        <Show when={payment().discount}>
                            <div class="mt-4 p-3 bg-success text-success-content rounded">
                                <p class="font-semibold">Discount Applied!</p>
                                <p>
                                    {payment().discount?.value_type === 'percentage'
                                        ? `${payment().discount?.value}% off`
                                        : `${payment().offering?.currency} ${payment().discount?.value} off`
                                    }
                                </p>
                            </div>
                        </Show>
                    </div>

                    {/* Price Summary */}
                    <div class="card bg-base-200 p-6">
                        <h3 class="text-xl font-semibold mb-4">Order Summary</h3>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span>Base Price:</span>
                                <span>{payment().offering?.currency} {payment().offering?.base_price_amount}</span>
                            </div>

                            <Show when={payment().discount}>
                                <div class="flex justify-between text-success">
                                    <span>Discount:</span>
                                    <span>
                                        -{payment().offering?.currency} {((payment().offering?.base_price_amount || 0) - calculateFinalPrice()).toFixed(2)}
                                    </span>
                                </div>
                            </Show>

                            <div class="border-t pt-2 mt-2">
                                <div class="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span>{payment().offering?.currency} {calculateFinalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message with Retry Options */}
                    <Show when={payment().error}>
                        <div class="alert alert-error">
                            <div class="flex-1">
                                <span>{payment().error}</span>
                                <div class="flex gap-2 mt-2">
                                    <button
                                        class="btn btn-sm btn-secondary"
                                        onClick={retryPayment}
                                        disabled={processing()}
                                    >
                                        {processing() ? (
                                            <span class="loading loading-spinner"></span>
                                        ) : (
                                            'Retry Payment'
                                        )}
                                    </button>
                                    <button
                                        class="btn btn-sm btn-outline"
                                        onClick={resetAndRetry}
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Show>

                    {/* Pay Button */}
                    <Show when={!payment().error}>
                        <button
                            onClick={processPayment}
                            disabled={processing() || !auth().user}
                            class="btn btn-primary btn-lg w-full"
                        >
                            {processing() ? (
                                <span class="loading loading-spinner"></span>
                            ) : (
                                'Pay Now'
                            )}
                        </button>
                    </Show>

                    <Show when={!auth().user}>
                        <div class="alert alert-warning">
                            <span>Please sign in to complete your payment</span>
                        </div>
                    </Show>
                </div>
            </Show>

            <Show when={state() !== 'fetching_offering' && !payment().offering}>
                <div class="alert alert-error">
                    <span>Offering not found or inactive</span>
                </div>
            </Show>

            {/* Success Modal */}
            <Show when={showSuccessModal()}>
                <div class="modal modal-open">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Success!</h3>
                        <p class="py-4">
                            Your {props.intent} was completed successfully.
                            You can now access your dashboard.
                        </p>
                        <div class="modal-action">
                            <button
                                class="btn btn-primary"
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
}