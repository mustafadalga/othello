import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Othello",
        short_name: "Othello",
        description: "Play Othello online, the classic board game also known as Reversi. Challenge your friends or play against the computer in this real-time multiplayer game.",
        icons: [
            {
                "src": "/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            },
            {
                type: "image/png",
                sizes: "32x32",
                src: "/favicon-32x32.png"
            },
            {
                type: "image/png",
                sizes: "180x180",
                src: "/apple-touch-icon.png"
            },
            {
                type: "image/png",
                sizes: "16x16",
                src: "/favicon-16x16.png"
            }
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "fullscreen",
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        categories: [ 'games', 'board games', 'strategy' ],
        lang: 'en'
    }
}