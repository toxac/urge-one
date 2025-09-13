// src/components/ProgressFeedback.tsx

import { createSignal, Show } from 'solid-js';
import UserRating from '../../user/actions/UserRating.tsx'; // Import the standalone StarRating component
import { submitContentFeedback } from '../../../stores/progress.ts'; // Your feedback submission function

interface ProgressFeedbackProps {
    contentMetaId: string; // The ID of the content this feedback is for
}

/**
 * ProgressFeedback Component
 * Provides a standalone modal for users to submit feedback and a rating for content.
 * It does not trigger navigation or interact with other progress feature components directly.
 */
export default function ProgressFeedback(props: ProgressFeedbackProps) {
    const [showFeedbackModal, setShowFeedbackModal] = createSignal(false);
    const [feedbackText, setFeedbackText] = createSignal('');
    const [feedbackRating, setFeedbackRating] = createSignal<number>(0);
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [submissionStatus, setSubmissionStatus] = createSignal<'idle' | 'success' | 'error'>('idle');

    // Resets the form state when the modal is opened
    const handleOpenModal = () => {
        setFeedbackText('');
        setFeedbackRating(0);
        setSubmissionStatus('idle');
        setShowFeedbackModal(true);
    };

    const handleCloseModal = () => {
        setShowFeedbackModal(false);
    };

    const handleSubmitFeedback = async () => {
        setIsSubmitting(true);
        setSubmissionStatus('idle'); // Reset status before new submission

        try {
            if (!props.contentMetaId) {
                throw new Error("Content Meta ID is missing for feedback submission.");
            }

            console.log('Submitting feedback for contentMetaId:', props.contentMetaId);
            console.log('Rating:', feedbackRating());
            console.log('Feedback text:', feedbackText());

            const { data, error } = await submitContentFeedback(props.contentMetaId, feedbackRating(), feedbackText());

            if (error) {
                throw new Error(error.message || "Failed to submit feedback.");
            }

            setSubmissionStatus('success');
            console.log('Feedback submitted successfully:', data);
            // Optionally clear form after success if desired, or let user see "Thank You"
            // setFeedbackText('');
            // setFeedbackRating(0);

        } catch (err) {
            console.error('Error submitting feedback:', err);
            setSubmissionStatus('error');
            // TODO: Display a more user-friendly error message within the modal
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div class="progress-feedback-container text-center my-8">
            <button
                onClick={handleOpenModal}
                class="px-6 py-3 rounded-lg cursor-pointer text-lg font-bold transition-all duration-300 ease-in-out
                       bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Give Feedback
            </button>

            {/* Feedback Modal */}
            <Show when={showFeedbackModal()}>
                <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full relative">
                        <button
                            onClick={handleCloseModal}
                            class="absolute top-4 right-4 bg-transparent border-none text-gray-600 text-3xl cursor-pointer hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full z-10"
                            aria-label="Close feedback modal"
                        >
                            &times;
                        </button>

                        <h2 class="text-3xl font-bold text-blue-700 mb-6">We'd love your feedback!</h2>

                        <Show when={submissionStatus() === 'success'}>
                            <div class="text-green-600 text-xl font-semibold mb-4">
                                Thank you for your feedback! 🎉
                            </div>
                        </Show>
                        <Show when={submissionStatus() === 'error'}>
                            <div class="text-red-600 text-xl font-semibold mb-4">
                                Failed to submit feedback. Please try again.
                            </div>
                        </Show>

                        <Show when={submissionStatus() === 'idle'}>
                            {/* Star Rating */}
                            <div class="mb-4">
                                <span class="text-lg mr-2">Rate your experience:</span>
                                <UserRating
                                    onStarClick={setFeedbackRating}
                                    selectedStars={feedbackRating()}
                                    maxStars={5}
                                />
                            </div>

                            <textarea
                                class="w-11/12 p-4 mb-6 border border-gray-300 rounded-lg text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                                placeholder="Share your thoughts on this content..."
                                value={feedbackText()}
                                onInput={(e) => setFeedbackText(e.currentTarget.value)}
                                rows="4"
                            ></textarea>

                            <button
                                onClick={handleSubmitFeedback}
                                disabled={isSubmitting()}
                                class="px-8 py-4 rounded-lg cursor-pointer text-lg font-bold transition-all duration-300 ease-in-out
                                       bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                       disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isSubmitting() ? 'Submitting...' : 'Save Feedback'}
                            </button>
                        </Show>
                    </div>
                </div>
            </Show>
        </div>
    );
}
