import { hydrate } from 'preact'
import { App, type AppProps } from '../app.js'

declare global {
    interface Window {
        __INITIAL_STATE__:AppProps
    }
}

const root = document.getElementById('root')
const state = window.__INITIAL_STATE__

if (root && state) {
    hydrate(<App {...state} />, root)
}
