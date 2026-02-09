import { useState } from 'preact/hooks'
import { Card } from './card.js'

export function Counter ({ initial = 0 }:{ initial?:number }) {
    const [count, setCount] = useState(initial)

    return (
        <Card title="Counter" description="An interactive counter with Preact hydration:">
            <div class="counter-display">{count}</div>
            <div class="counter-buttons">
                <button
                    class="btn"
                    onClick={() => setCount(c => c - 1)}
                >
                    &ndash;
                </button>
                <button
                    class="btn"
                    onClick={() => setCount(0)}
                >
                    Reset
                </button>
                <button
                    class="btn"
                    onClick={() => setCount(c => c + 1)}
                >
                    +
                </button>
            </div>
        </Card>
    )
}
