import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const classes = plugin(function ({ addUtilities }) {
    addUtilities({
        ".perspective": {
            perspective: "100px",
        },
        ".transform-style-3d": {
            "transform-style": "preserve-3d"
        },
        ".stone-front": {
            "background": "linear-gradient(225deg, #333, #888)"
        },
        ".stone-front-inner": {
            "background": "linear-gradient(45deg, rgba(0, 0, 0, .4), hsla(0, 0%, 100%, .15))"
        },
        ".stone-back": {
            "background": "linear-gradient(225deg, #fff, #e1e1e1)"
        },
        ".stone-back-inner": {
            "background": "linear-gradient(45deg, #fff, rgba(0, 0, 0, .3))"
        },
        '.backface-hidden': {
            'backface-visibility': 'hidden',
        }
    })
})


const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    plugins: [ classes ],
    theme: {
        extend: {
            animation: {
                rotation: 'rotation 1s linear infinite',
            },
            keyframes: {
                rotation: {
                    '0%': {
                        transform: 'rotate(0deg)',
                    },
                    '100%': {
                        transform: 'rotate(360deg)',
                    },
                },
            }
        }
    }
};
export default config;
