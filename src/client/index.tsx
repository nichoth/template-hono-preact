import { hydrate, render } from 'preact'
import { App, type AppProps } from '../app.js'  // <-- imported by server also

declare global {
    interface Window {
        __INITIAL_STATE__?:AppProps
    }
}

const root = document.getElementById('root')
const state = window.__INITIAL_STATE__

if (root) {
    const props:AppProps = state ?? { initialCount: 0 }
    if (state) {
        hydrate(<App {...props} />, root)
    } else {
        render(<App {...props} />, root)
    }
}
