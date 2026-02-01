import { Hono } from 'hono'
import { cors } from 'hono/cors'
import render from 'preact-render-to-string'
import { App, type AppProps } from '../app.js'
import manifestJson from '../../public/client/vite-manifest.json'

type Bindings = {
    ASSETS:Fetcher
    NODE_ENV?:string
}

interface ViteManifest {
    'index.html'?:{
        file:string
        css?:string[]
    }
}

const manifest:ViteManifest = manifestJson

let cachedAssets:{ css:string, js:string }|null = null

const app = new Hono<{ Bindings:Bindings }>()

app.use('/api/*', cors())

/**
 * Main page — SSR with Preact, hydrated on the client
 */
app.get('/', (c) => {
    const isDev = c.env.NODE_ENV !== 'production'
    const assets = isDev ? null : getAssetPaths()
    const cssPath = assets?.css || (isDev ? '/src/style.css' : '/client/assets/index.css')
    const jsPath = assets?.js || (isDev ? '/src/client/index.tsx' : '/client/assets/index.js')

    // Props shared between SSR and hydration
    const appProps:AppProps = { initialCount: 5 }

    // Render the App component to an HTML string
    const ssrHtml = render(<App {...appProps} />)

    return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hono + Preact</title>
    <link rel="stylesheet" href="${cssPath}" />
</head>
<body>
    <div id="root">${ssrHtml}</div>

    <script>window.__INITIAL_STATE__ = ${JSON.stringify(appProps)}</script>
    <script type="module" src="${jsPath}"></script>
</body>
</html>`)
})

/**
 * Health check
 */
app.get('/api/health', (c) => {
    return c.json({ status: 'ok', service: 'template-hono-preact' })
})

app.get('/health', c => {
    return c.json({ status: 'ok' })
})

/**
 * Serve static assets (frontend)
 */
app.all('*', (c) => {
    if (!(c.env?.ASSETS)) {
        return c.notFound()
    }

    return c.env.ASSETS.fetch(c.req.raw)
})

export default app

function getAssetPaths ():{ css:string, js:string } {
    if (cachedAssets) return cachedAssets

    const entry = manifest['index.html']
    if (entry) {
        cachedAssets = {
            js: `/${entry.file}`,
            css: entry.css?.[0] ? `/${entry.css?.[0]}` : ''
        }
        return cachedAssets
    }

    return { css: '/client/assets/index.css', js: '/client/assets/index.js' }
}
