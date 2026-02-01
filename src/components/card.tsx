import type { ComponentChildren } from 'preact'

interface CardProps {
    title:string
    description?:string
    children?:ComponentChildren
}

export function Card ({ title, description, children }:CardProps) {
    return (
        <section class="card">
            <h2>{title}</h2>
            {description && <p>{description}</p>}
            {children}
        </section>
    )
}
