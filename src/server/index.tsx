import { Hono } from 'hono'
import { cors } from 'hono/cors'
import render from 'preact-render-to-string'
import { App, type AppProps } from '../app.js'
import { Page } from '../components/page.js'
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
 * Main page -- SSR with Preact, hydrated on the client
 */
app.get('/', (c) => {
    const isDev = import.meta.env.DEV
    const assets = isDev ? undefined : getAssetPaths()
    const appProps:AppProps = { initialCount: 5 }

    const html = '<!DOCTYPE html>' + render(
        <Page
            title="Hono + Preact"
            appProps={appProps}
            isDev={isDev}
            assets={assets}
        >
            <App {...appProps} />
        </Page>
    )

    return c.html(html)
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
            css: entry.css?.[0] ? `/${entry.css[0]}` : ''
        }
        return cachedAssets
    }

    return {
        css: '/assets/index.css',
        js: '/assets/index.js',
    }
}
