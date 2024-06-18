"use client"
import useLoader from "@/_store/useLoader";

// resource: https://cssloaders.github.io
export default function Loader() {
    const { isOpen } = useLoader();

    if (!isOpen) return;

    return (
        <section className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/75">
            <span
                className="loader after::content-[''] h-12 w-12 animate-rotation rounded-full border-r-4 border-t-4 border-solid border-r-transparent border-t-white after:absolute after:left-0 after:top-0 after:h-12 after:w-12 after:rounded-full after:border-b-4 after:border-l-4 after:border-solid after:border-b-green-500 after:border-l-transparent"></span>
        </section>
    );
};