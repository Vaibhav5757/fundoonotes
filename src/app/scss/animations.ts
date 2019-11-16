import { animate, style, animation, query, stagger, keyframes } from '@angular/animations';

export const shakeAlongXAxis = animation([
    animate('0.2s', style({
        transform: 'translateX(-{{ percentage }}%)'
    })),
    animate('0.2s', style({
        transform: 'translateX(+{{ percentage }}%)'
    })),
    animate('0.2s', style({
        transform: 'translateX(-{{ percentage }}%)'
    })),
    animate('0.2s', style({
        transform: 'translateX(+{{ percentage }}%)'
    })),
    animate('0.2s', style({
        transform: 'translateX(-{{ percentage }}%)'
    })),
    animate('0.2s', style({
        transform: 'translateX(+{{ percentage }}%)'
    })),
])

export const fade = animation([
    animate('{{ time }}')
])

export const cardAnimation = animation([
    query('mat-card-title, mat-card-subtitle, mat-card-content, mat-chip-list, div', [
        style({
            opacity: 0
        }),
        stagger(500, [
            animate('1000ms cubic-bezier(0.35, 0, 0.25, 1)', style({
                opacity: 1, transform: 'none'
            }))
        ])
    ])
])

export const cardFallEffect = animation([
    query(':enter', style({ opacity: 0 }), { optional: true }),


    // Each card will appear sequentially with the delay of 300ms
    query(':enter', stagger('300ms', [
        animate('.5s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))]), { optional: true })
])