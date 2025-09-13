// src/components/TextToSpeech.tsx
import { createSignal, onCleanup, onMount } from 'solid-js';

export default function TextToSpeech() {
    const [isPlaying, setIsPlaying] = createSignal(false);
    const [utterance, setUtterance] = createSignal<SpeechSynthesisUtterance | null>(null);

    onMount(() => {
        // 1. Get the main content of the page
        // Use a more specific selector that targets your MDX content.
        // Example: '[data-astro-cid-xxxx]' or a class you add to the article.
        const contentElement = document.querySelector('main-content');
        const contentText = contentElement ? contentElement.textContent : '';

        // 2. Create the speech synthesis utterance
        const speech = new SpeechSynthesisUtterance(contentText);
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        speech.lang = 'en-US'; // Consider making this dynamic based on content

        // 3. Set up event handlers
        speech.onend = () => setIsPlaying(false);
        speech.onerror = () => setIsPlaying(false);

        setUtterance(speech);

        // Cleanup: Cancel any ongoing speech when the component is removed
        onCleanup(() => {
            window.speechSynthesis.cancel();
        });
    });

    const handlePlay = () => {
        const synth = window.speechSynthesis;
        const currentUtterance = utterance();

        if (!currentUtterance) return;

        if (isPlaying()) {
            synth.pause();
        } else {
            // Check if it was already started and just paused
            if (synth.paused) {
                synth.resume();
            } else {
                // Otherwise, start from the beginning
                synth.speak(currentUtterance);
            }
        }
        setIsPlaying(!isPlaying());
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    return (
        <div class="tts-container">
            <button onClick={handlePlay} class="px-4 py-2 bg-blue-600 text-white rounded">
                {isPlaying() ? 'Pause' : 'Play'} Article
            </button>
            <button onClick={handleStop} class="px-4 py-2 bg-gray-600 text-white rounded ml-2">
                Stop
            </button>
        </div>
    );
}