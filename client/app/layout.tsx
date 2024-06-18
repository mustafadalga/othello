import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import "./globals.css";
import RootProvider from "@/_providers/RootProvider";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "@/_components/Loader";


export const metadata: Metadata = {
    title: "Othello",
    description: "Othello",
};

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
