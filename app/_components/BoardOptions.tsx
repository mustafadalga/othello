"use client";
import { useRouter } from "next/navigation";

export default function BoardOptions() {
    const router = useRouter()
    const handleExit = () => {
        router.push("/");
    }
    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                className="px-4 py-2 text-xs lg:text-sm text-white whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg transition-colors">
                New Game
            </button>
            <button
                onClick={handleExit}
                className="px-4 py-2 text-xs lg:text-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg transition-colors">
                Exit
            </button>
        </div>
    )
}