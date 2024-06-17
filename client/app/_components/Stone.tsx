import { AnimatePresence, motion } from "framer-motion";
import { EGamer } from "@/_enums";

const variants = {
    frontVisible: { rotateY: 0 },
    backVisible: { rotateY: 180 }
};


export default function Stone({ gamer }: {
    gamer: EGamer,
}) {
    return (
        <div className="bg-transparent w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10">
            <AnimatePresence mode="wait">
                {gamer == EGamer.BLACK && (
                    <motion.div
                        className="perspective relative w-full h-full transform-style-3d rounded-full bg-black-gradient"
                        animate="backVisible"
                        initial="frontVisible"
                        exit="frontVisible"
                        variants={variants}
                        transition={{ duration: 0.5, transformStyle: "preserve-3d" }}>
                    </motion.div>
                )}
                {gamer == EGamer.WHITE && (
                    <motion.div
                        className="perspective relative w-full h-full transform-style-3d rounded-full bg-white-gradient"
                        animate="frontVisible"
                        initial="backVisible"
                        exit="backVisible"
                        variants={variants}
                        transition={{ duration: 0.5, transformStyle: "preserve-3d" }}>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
