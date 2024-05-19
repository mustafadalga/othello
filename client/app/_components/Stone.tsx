import { Gamer } from "@/_enums";

export default function Stone({ gamer }: { gamer: Gamer }) {
    const bgColor = gamer == Gamer.BLACK ? "bg-[radial-gradient(circle_at_30%_30%,rgba(105,105,105),rgba(0,0,0)_70%)]" : "bg-[radial-gradient(circle_at_30%_30%,rgb(255,255,255),rgb(230,230,230)_70%)]"

    return (
        <div
            className={`${bgColor} grid place-items-center w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full border border-solid border-gray-300 shadow-[5px_5px_15px_rgba(0,0,0,0.3),inset_2px_2px_5px_rgba(255,255,255,0.1),inset_-2px_-2px_5px_rgba(0,0,0,0.4)]`}>
            <div className="bg-green-600 p-1 rounded-full"></div>
        </div>
    )
}