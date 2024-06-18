import { AnimatePresence, motion } from "framer-motion";
import useGameResultModal from "@/_store/useGameResultModal";
import { EGamer } from "@/_enums";
import IconTrophy from "@/_components/icons/IconTrophy";
import IconXMark from "@/_components/icons/IconXMark";

const modalVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
};

export default function GameResultModal({ winnerGamer, gamerColor }: {
    winnerGamer: EGamer | null,
    gamerColor: EGamer
}) {
    const title = winnerGamer ? winnerGamer == gamerColor ? "You Win" : "You Lose" : "It’s a Tie!";
    const { isOpen, onClose } = useGameResultModal();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.section
                    className="absolute bg-transparent inset-0 grid place-items-center"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalVariants}
                    transition={{ duration: 0.5 }}>
                    <div
                        className="relative grid place-items-center gap-3 w-11/12 p-6 bg-white shadow-[0px_0px_15px_-3px_rgba(0,0,0,0.1)] rounded-xl">
                        <h1 className="font-semibold text-xl lg:text-2xl">{title}</h1>
                        {winnerGamer == gamerColor &&
                            <IconTrophy className="fill-[#FFD700] w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10"/>}

                        <button className="absolute top-3 right-3" onClick={onClose}>
                            <IconXMark className="fill-neutral-500 w-5 h-5"/>
                        </button>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>

    )
}