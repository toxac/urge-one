import { createSignal, createEffect, onMount, onCleanup, Show } from "solid-js";
// images
import careerChanger from "../../assets/hero/hero_career_changer.jpg";
import defaultImage from "../../assets/hero/hero_default.jpg";
import youngPro from "../../assets/hero/hero_young_pro.jpg";
import encore from "../../assets/hero/hero_encore.jpg";
import flexSeeker from "../../assets/hero/hero_flex_seeker.jpg";
import sideHustle from "../../assets/hero/hero_side_hustle.jpg";

interface UserArchetype {
    id: string;
    heading: string;
    subheading: string;
    body: string;
    image: any;
}

const slides: UserArchetype[] = [
    {
        id: "young-pro",
        heading: "Build The Job You Love.",
        subheading: "Stop searching for the perfect job and build your own.",
        body: "Urge cuts through the noise with practical actions and mindset challenges. Build a sellable product, find your path, and get accountability—no ‘perfect credentials’ required.",
        image: youngPro
    },
    {
        id: "career-changer",
        heading: "Your Expertise. Your Rules.",
        subheading: "Leverage your expertise to launch your next chapter on your own terms.",
        body: "Pivoting feels daunting. Urge combines your expertise with a startup roadmap and mindset shifts to help you build a sellable product (MSP), validate it with real customers early, and get accountability—minus the corporate playbook.",
        image: careerChanger
    },
    {
        id: "flex-seeker",
        heading: "Break Free. Build Free.",
        subheading: "Your business, your terms. Build your dream business on your own schedule.",
        body: "Life is busy. Urge cuts the fluff with lean strategies, time-saving kits, and mindset challenges. Get accountability from your Cheer Squad, build a sellable product, and launch your business without the overwhelm.",
        image: flexSeeker
    },
    {
        id: "encore",
        heading: "Wisdom is Your Edge.",
        subheading: "Your experience is your superpower. Unleash it now.",
        body: "Don't think starting up now requires navigating confusing tech. Urge simplifies it, providing practical actions and easy-to-use tools. Launch lean, find real customers who value your unique experience, and get friendly accountability.",
        image: encore
    },
    {
        id: "side-hustle",
        heading: "Got a Side Hustle?",
        subheading: "Make it your main thing. Urge helps you find a path that fits your life.",
        body: "Don’t think you have the time? That's a myth. Urge gives you bite-sized action steps, quick kits, and fun mindset challenges to build confidence on the go. Get a clear roadmap to a sellable product that fits your life and turns that side hustle into something real.",
        image: sideHustle
    },
    {
        id: "default",
        heading: "Stop Overthinking.",
        subheading: "Start doing. Urge cuts through the confusion and helps you conquer the real hurdles.",
        body: "Think you need a fancy degree or tons of cash? That's where most ventures stall. Urge provides the boost with practical actions, fun mindset challenges to conquer fear, and accountability. We help you move fast, launch lean, and build something real.",
        image: defaultImage
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = createSignal(0);
    const [displayText, setDisplayText] = createSignal("");
    const [isTyping, setIsTyping] = createSignal(false);
    let carouselIntervalId: ReturnType<typeof setInterval>;
    let typewriterIntervalId: ReturnType<typeof setInterval>;

    // Typewriter effect function
    const startTypewriter = () => {
        setIsTyping(true);
        setDisplayText("");
        const text = slides[currentSlide()].heading;
        let i = 0;

        clearInterval(typewriterIntervalId);
        typewriterIntervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typewriterIntervalId);
                setIsTyping(false);
            }
        }, 50);
    };

    // Auto-rotate slides
    const startCarousel = () => {
        clearInterval(carouselIntervalId);
        carouselIntervalId = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
    };

    // Effect that triggers when currentSlide changes
    createEffect(() => {
        startTypewriter();
    });

    onMount(() => {
        startTypewriter();
        setTimeout(() => {
            startCarousel();
        }, 500);

        onCleanup(() => {
            clearInterval(carouselIntervalId);
            clearInterval(typewriterIntervalId);
        });
    });

    return (
        <div class="container mx-auto">
            <div class="relative">
                {/* Slide Container with Transition */}
                <div class="rounded-none lg:rounded-2xl p-8 md:p-12 flex flex-col relative overflow-hidden h-[65vh] lg:h-[70vh]">
                    {/* Image with Crossfade Transition */}
                    <div class="absolute inset-0 z-0">
                        {slides.map((slide, index) => (
                            <img
                                src={slide.image.src}
                                alt={slide.heading}
                                class={`absolute inset-0 w-full h-full object-cover grayscale-90 transition-opacity duration-1000 ease-in-out ${index === currentSlide() ? 'opacity-100' : 'opacity-0'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Overlays */}
                    <div class="absolute inset-0 bg-black opacity-40 z-0"></div>
                    <div class="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-600 opacity-20 z-0"></div>

                    {/* Content with Typewriter Effect */}
                    <div class="relative z-10">
                        <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md min-h-[1.2em]">
                            {displayText()}
                            {isTyping() && (
                                <span class="ml-1 inline-block w-1 h-6 bg-white animate-pulse align-middle"></span>
                            )}
                        </h1>
                        <p class="text-lg text-amber-100 max-w-xl drop-shadow-md">
                            {slides[currentSlide()].subheading}
                        </p>
                    </div>
                </div>
            </div>

            {/** DYNAMIC CTA CARD */}
            <div class="w-5/6 md:w-2/3 mx-auto bg-white h-auto rounded-xl -mt-16 z-50 relative shadow-lg border-1 border-gray-200 p-6">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    {/* Column 1: Title and Body Text */}
                    <div class="flex-1">
                        <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                            {slides[currentSlide()].heading}
                        </h3>
                        <p class="text-gray-700 text-base md:text-lg leading-relaxed">
                            {slides[currentSlide()].body}
                        </p>
                    </div>

                    {/* Column 2: CTA Buttons */}
                    <div class="flex flex-col sm:flex-row lg:flex-col gap-3 lg:gap-4 lg:items-end lg:justify-center">
                        <a
                            href="/auth/register?intent=enroll&details=b594dc90-3af0-4d62-9f5e-4b5dccba3fe9"
                            class="bg-gray-900 text-amber-50 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition shadow-md text-center min-w-[180px]"
                        >
                            <i class="fas fa-calendar-check mr-2"></i>Enroll Now
                        </a>
                        <a
                            href="/auth/register?intent=challenge"
                            class="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border border-amber-300 hover:bg-amber-50 transition shadow-md text-center min-w-[180px]"
                        >
                            <i class="fas fa-info-circle mr-2"></i>Try Free Challenge
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}