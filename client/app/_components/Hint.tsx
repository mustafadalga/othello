import { motion } from "framer-motion";
import { EGamer } from "@/_enums";

const scaleInVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
};

export default function Hint({ activeGamer, isHintClicked }: { activeGamer: EGamer, isHintClicked: boolean }) {
    const clickedBaseClassName: string = "backface-hidden before:block before:absolute before:rounded-full before:inset-[10%] after:block after:absolute after:rounded-full after:inset-0 after:m-[25%]";
    const clickedClassName: string = (activeGamer == EGamer.BLACK ? "before:stone-front after:stone-front-inner" : "before:stone-back after:stone-back-inner") + " " + clickedBaseClassName;
    const defaultClassName: string = (activeGamer == EGamer.BLACK ? "before:from-[#333] before:to-[#888] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]" : "before:from-white before:to-[#e1e1e1] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]") + " before:bg-gradient-to-b before:p-0.5 before:content-[''] before:[mask-composite:exclude]";
    const className = `${isHintClicked ? clickedClassName : defaultClassName}`

    return (
        <motion.div
            key={isHintClicked.toString()}
            className={`${className} absolute w-full h-full backface-hidden before:block before:absolute before:rounded-full before:inset-[10%] before:safari-hint-inset after:block after:absolute after:rounded-full after:inset-0 after:m-[25%] `}
            variants={scaleInVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}/>
    )
}