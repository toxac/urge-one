import { atom, computed } from 'nanostores';
import type { Database } from '../../database.types';

export type PaymentState = 
  | 'idle'
  | 'fetching_offering'
  | 'applying_discount'
  | 'processing_payment'
  | 'processing_flow'
  | 'success'
  | 'error';

export type PaymentIntent = 'enroll' | 'subscribe' | 'event';

export interface PaymentData {
  state: PaymentState;
  intent: PaymentIntent | null;
  offering: Database['public']['Tables']['offerings']['Row'] | null;
  discount: Database['public']['Tables']['discounts']['Row'] | null;
  error: string | null;
  transactionId: string | null;
}

export const paymentStore = atom<PaymentData>({
  state: 'idle',
  intent: null,
  offering: null,
  discount: null,
  error: null,
  transactionId: null,
});

// Actions
export const setPaymentIntent = (intent: PaymentIntent) => {
  paymentStore.set({ ...paymentStore.get(), intent, state: 'idle' });
};

export const setOffering = (offering: PaymentData['offering']) => {
  paymentStore.set({ ...paymentStore.get(), offering });
};

export const setDiscount = (discount: PaymentData['discount']) => {
  paymentStore.set({ ...paymentStore.get(), discount });
};

export const setPaymentState = (state: PaymentState) => {
  paymentStore.set({ ...paymentStore.get(), state });
};

export const setPaymentError = (error: string | null) => {
  paymentStore.set({ ...paymentStore.get(), error, state: error ? 'error' : 'idle' });
};

export const setTransactionId = (transactionId: string | null) => {
  paymentStore.set({ ...paymentStore.get(), transactionId });
};

export const resetPayment = () => {
  paymentStore.set({
    state: 'idle',
    intent: null,
    offering: null,
    discount: null,
    error: null,
    transactionId: null,
  });
};

// Computed values
export const isProcessing = computed(paymentStore, (state) => 
  state.state === 'processing_payment' || state.state === 'processing_flow'
);

export const currentState = computed(paymentStore, (state) => state.state);