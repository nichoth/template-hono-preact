import { Counter } from './components/counter.js'

export interface AppProps {
    initialCount:number
}

export function App ({ initialCount }:AppProps) {
    return (
        <>
            <header class="hero">
                <h1>Hono + Preact</h1>
                <p class="subtitle">
                    Server-rendered HTML with Preact hydration
                </p>
            </header>

            <p>
                This page is rendered on the server with Hono, then hydrated on
                the client with Preact. The components are shared between server
                and client.
            </p>

            <main class="cards">
                <Counter initial={initialCount} />
            </main>
        </>
    )
}
