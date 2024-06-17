import { AnimatePresence, motion } from "framer-motion";
import { EGamer } from "@/_enums";

const scaleInVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
};

export default function Hint({ activeGamer, isHintClicked }: { activeGamer: EGamer, isHintClicked: boolean }) {
    const bgColor: string = activeGamer == EGamer.BLACK ? "bg-black-gradient" : "bg-white-gradient";
    const hoverBgColor: string = activeGamer == EGamer.BLACK ? "group-hover:bg-black/20" : "group-hover:bg-white/20";

    return (
        <AnimatePresence mode="wait">
            {isHintClicked && (
                <motion.div
                    className={`${bgColor} w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full`}
                    animate="visible"
                    initial="hidden"
                    exit="hidden"
                    variants={scaleInVariants}
                    transition={{ duration: 0.5 }}>
                </motion.div>
            )}
            {!isHintClicked && (
                <div
                    className={`${hoverBgColor} w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full border border-gray-900`}>
                </div>
            )}
        </AnimatePresence>
    )
}