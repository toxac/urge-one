import { createSignal, For } from 'solid-js';
import { Icon } from "@iconify-icon/solid";

interface StarRatingProps {
    onStarClick: (rating: number) => void;
    maxStars: number;
    selectedStars: number;
}

// Star Rating Component
const StarRating = (props: StarRatingProps) => {
    const [hoverRating, setHoverRating] = createSignal(0);

    const handleStarClick = (starIndex: number) => {
        const rating = starIndex + 1;
        props.onStarClick(rating);
    };

    const handleStarHover = (starIndex: number) => {
        setHoverRating(starIndex + 1);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const isStarActive = (starIndex: number) => {
        const currentRating = hoverRating() || props.selectedStars || 0;
        return starIndex < currentRating;
    };

    const getStarColor = (starIndex: number) => {
        return isStarActive(starIndex) ? 'text-yellow-400' : 'text-gray-300';
    };

    return (
        <div
            class="flex space-x-1"
            onMouseLeave={handleMouseLeave}
        >
            <For each={Array.from({ length: props.maxStars || 5 })}>
                {(_, index) => (
                    <button
                        class={`transition-all duration-200 transform hover:scale-110 cursor-pointer ${getStarColor(index())}`}
                        onClick={() => handleStarClick(index())}
                        onMouseEnter={() => handleStarHover(index())}
                    >
                        <Icon
                            icon={isStarActive(index()) ? "mdi:star" : "mdi:star-outline"}
                            width={32}
                            height={32}
                            class="transition-all duration-200"
                        />
                    </button>
                )}
            </For>
        </div>
    );
};

export default StarRating;