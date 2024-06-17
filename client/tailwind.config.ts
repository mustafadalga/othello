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
        ".bg-black-gradient": {
            "background-image": "radial-gradient(circle at 30% 30%,rgba(105,105,105),rgba(0,0,0) 70%)"
        },
        ".bg-white-gradient": {
            "background-image": "radial-gradient(circle at 30% 30%,rgb(255,255,255),rgb(230,230,230) 70%)"
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
};
export default config;
