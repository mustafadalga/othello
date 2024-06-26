import { EGamer } from "@/_enums";

export default function Stone({ gamer, isActive }: {
    gamer: EGamer,
    isActive?: boolean
}) {
    return (
        <div
            className={`${gamer == EGamer.BLACK ? "" : "[transform:rotateY(180deg)]"} perspective relative w-full h-full bg-transparent transition-transform duration-500 transform-style-3d`}>
            <div
                className="absolute w-full h-full backface-hidden before:block before:absolute before:rounded-full before:inset-[10%] before:stone-front after:stone-front-inner after:block after:absolute after:rounded-full after:inset-0 after:m-[25%]">
                <div
                    className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-0.5 sm:p-1 rounded-full ${isActive ? 'bg-green-600' : ''}`}></div>
            </div>
            <div
                className="absolute w-full h-full [transform:rotateY(180deg)] backface-hidden before:block before:absolute before:rounded-full before:inset-[10%] before:stone-back after:stone-back-inner after:block after:absolute after:rounded-full after:inset-0 after:m-[25%]">
                <div
                    className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-0.5 sm:p-1 rounded-full ${isActive ? 'bg-green-600' : ''}`}></div>
            </div>
        </div>
    )
}
