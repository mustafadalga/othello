import { useState } from "react";
import IconClipBoard from "@/_components/icons/IconClipBoard";

export default function ClipBoardURL({ roomURL }: { roomURL: string }) {
    const [ copied, setCopied ] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(roomURL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    return (
            <div className="relative flex items-center py-5 px-5 text-xs lg:text-sm gap-3 truncate">
                <IconClipBoard
                    onClick={handleCopy}
                    className={`min-w-4 min-h-4 w-4 h-4 lg:w-6 lg:h-6 cursor-pointer ${copied ? 'text-blue-500' : 'text-gray-500'}`}
                />
                {copied && (
                    <span className="absolute right-0 top-0 ml-4 text-purple-500 text-xs">Copied!</span>
                )}
            </div>
    );
};