import type { Metadata, Viewport } from "next";
import { ToastContainer } from 'react-toastify';
import "./globals.css";
import RootProvider from "@/_providers/RootProvider";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "@/_components/Loader";

export const metadata: Metadata = {
        title: "Othello Game - Play Classic Reversi Online",
        description: "Play Othello online, the classic board game also known as Reversi. Challenge your friends or play against the computer in this real-time multiplayer game.",
        keywords: [ "Othello", "Reversi", "online board game", "strategy game", "multiplayer game" ],
        authors: [ { name: "Mustafa Dalga", url: "https://github.com/mustafadalga/othello" } ],
        openGraph: {
            type: "website",
            url: "https://github.com/mustafadalga/othello",
            title: "Othello Game - Play Classic Reversi Online",
            description: "Play Othello online, the classic board game also known as Reversi. Challenge your friends or play against the computer in this real-time multiplayer game.",
            images: [
                {
                    url: "https://github.com/mustafadalga/othello/blob/main/screenshots/screenshot-1.png",
                    width: 800,
                    height: 600,
                    alt: "Othello game board",
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: "Othello Game - Play Classic Reversi Online",
            description: "Play Othello online, the classic board game also known as Reversi. Challenge your friends or play against the computer in this real-time multiplayer game.",
            images: [
                {
                    url: "https://github.com/mustafadalga/othello/blob/main/screenshots/screenshot-1.png",
                    alt: "Othello game board",
                }
            ]
        },
        robots: "index, follow",
        alternates: {
            canonical: "https://github.com/mustafadalga/othello",
        }
    }

export const viewport: Viewport = {
    themeColor: '#038947',
    width: "device-width",
    initialScale: 1
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body
            className="w-full h-full min-h-screen max-w-screen-2xl mx-auto py-10 px-4 font-sans bg-gray-100 text-gray-800">
        <RootProvider>
            {children}
        </RootProvider>
        <Loader/>
        <ToastContainer className="text-sm md:text-base"/>
        </body>
        </html>
    );
}
