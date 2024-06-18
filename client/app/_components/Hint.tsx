import { motion } from "framer-motion";
import { EGamer } from "@/_enums";

const scaleInVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
};

export default function Hint({ activeGamer, isHintClicked }: { activeGamer: EGamer, isHintClicked: boolean }) {
    const clickedClassName: string = activeGamer == EGamer.BLACK ? "bg-black-gradient" : "bg-white-gradient";
    const defaultClassName: string = (activeGamer == EGamer.BLACK ? "group-hover:bg-black/20 border-black" : "group-hover:bg-white/20 border-white") + " border border-solid ";
    const className = `${isHintClicked ? clickedClassName : defaultClassName}`

    return (
        <motion.div
            key={isHintClicked.toString()}
            className={`${className} hint w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full`}
            variants={scaleInVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}/>

    )
}