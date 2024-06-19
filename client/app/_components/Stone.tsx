import { AnimatePresence, motion } from "framer-motion";
import { EGamer } from "@/_enums";

const variants = {
    frontVisible: { rotateY: 0 },
    backVisible: { rotateY: 180 }
};


export default function Stone({ gamer, isActive }: {
    gamer: EGamer,
    isActive?: boolean
}) {
    return (
        <div className="bg-transparent w-4 h-4 [@media(min-width:360px)]:w-5 [@media(min-width:360px)]:h-5 [@media(min-width:480px)]:w-6 [@media(min-width:480px)]:h-6 lg:!w-8 lg:!h-8 xl:!w-10 xl:!h-10">
            <AnimatePresence mode="wait">
                {gamer == EGamer.BLACK && (
                    <motion.div
                        className="perspective relative grid place-items-center w-full h-full transform-style-3d rounded-full bg-black-gradient"
                        animate="backVisible"
                        initial="frontVisible"
                        exit="frontVisible"
                        variants={variants}
                        transition={{ duration: 0.5, transformStyle: "preserve-3d" }}>
                        <div className={`p-0.5 sm:p-1 rounded-full ${isActive ? 'bg-green-600' : ''}`}></div>
                    </motion.div>
                )}
                {gamer == EGamer.WHITE && (
                    <motion.div
                        className="perspective relative grid place-items-center w-full h-full transform-style-3d rounded-full bg-white-gradient"
                        animate="frontVisible"
                        initial="backVisible"
                        exit="backVisible"
                        variants={variants}
                        transition={{ duration: 0.5, transformStyle: "preserve-3d" }}>
                        <div className={`p-0.5 sm:p-1 rounded-full ${isActive ? 'bg-green-600' : ''}`}></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
