import { createSignal, onCleanup, onMount, createEffect } from "solid-js";

// Import images directly (they should be in src/assets/ for optimization)
import ladyWebp from '../../assets/hero/lady.webp';
import careerChanger from "../../assets/hero/careerchanger.webp";
import innovate from "../../assets/hero/innovate.webp"

const slides = [
    {
        imageSrc: ladyWebp,
        title: "Learn to Code",
        description: "Start your journey with our interactive courses.",
        ctaText: "Get Started",
    },
    {
        imageSrc: careerChanger,
        title: "Master Data Science",
        description: "Advanced courses for career growth.",
        ctaText: "Explore Courses",
    },
    {
        imageSrc: innovate,
        title: "Build Something Exciting",
        description: "Advanced courses for career growth.",
        ctaText: "Explore Courses",
    }
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = createSignal(0);
    const [typedTitle, setTypedTitle] = createSignal("");
    let intervalId: ReturnType<typeof setInterval>;
    let typewriterIntervalId: ReturnType<typeof setInterval>;

    // Auto-rotate slides every 5 seconds
    const startCarousel = () => {
        intervalId = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
    };

    // Typewriter effect for title
    const startTypewriter = (text: string) => {
        let i = 0;
        setTypedTitle("");
        clearInterval(typewriterIntervalId);

        typewriterIntervalId = setInterval(() => {
            if (i < text.length) {
                setTypedTitle((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typewriterIntervalId);
            }
        }, 50);
    };

    // Reset typewriter when slide changes
    createEffect(() => {
        const slide = slides[currentSlide()];
        startTypewriter(slide.title);
    });

    onMount(() => {
        startCarousel();
        onCleanup(() => {
            clearInterval(intervalId);
            clearInterval(typewriterIntervalId);
        });
    });

    return (
        <>
            <div class="relative container mx-auto aspect-[16/9] overflow-hidden rounded-xl">
                {slides.map((slide, index) => (
                    <div
                        class="absolute inset-0 transition-opacity duration-1000"
                        classList={{
                            "opacity-100 z-10": currentSlide() === index,
                            "opacity-0 z-0": currentSlide() !== index,
                        }}
                    >
                        <div class="card image-full h-full w-full shadow-xl rounded-lg">
                            <figure>
                                <img
                                    src={slide.imageSrc.src}
                                    alt={slide.title}
                                    class="w-full h-full object-cover"
                                />
                            </figure>
                            <div class="card-body justify-center items-center text-center">
                                <div class="max-w-2xl px-4">
                                    <h2 class="card-title text-4xl font-bold text-white mb-4 min-h-[2.5rem]">
                                        {currentSlide() === index ? typedTitle() : slide.title}
                                    </h2>
                                    <p class="text-xl text-white mb-6">{slide.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div class=" w-1/3 mx-auto bg-base-100 h-32 -mt-12 z-100">helooo</div>
        </>
    );
}