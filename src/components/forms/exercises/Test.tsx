// src/components/TestComponent.tsx
import { createSignal } from 'solid-js';

export default function TestComponent() {
    const [count, setCount] = createSignal(0);

    return (
        <div>
            <p>Count: {count()}</p>
            <button onClick={() => setCount(count() + 1)}>
                Increment
            </button>
        </div>
    );
}