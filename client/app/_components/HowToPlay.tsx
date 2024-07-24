import Image from "next/image";

export default function HowToPlay() {
    return (
        <section
            className="w-full max-w-5xl gap-5 mx-auto p-5 lg:p-8 rounded-xl bg-white shadow-xl">
            <h1 className="text-gray-600 text-xl lg:text-2xl text-center">
                How to Play Othello
            </h1>


            <div className="grid gap-4 my-10">
                <h3 className="text-gray-900 text-base lg:text-lg">Game Introduction</h3>
                <p className="text-gray-600 text-sm lg:text-base">
                    Othello is a strategic board game played between two players. The goal is to have the most pieces of
                    your color on the board at the end of the game.
                </p>
                <Image src="/how-to-play/screenshot-1.png"
                       alt="Othello game board"
                       width={396}
                       height={396}
                       className="aspect-square	 mx-auto"  />

            </div>

            <div className="grid gap-4 my-10">
                <h3 className="text-gray-900 text-base lg:text-lg">Starting Position</h3>
                <p className="text-gray-600 text-sm lg:text-base">
                    The game begins on an 8x8 board. In the center, four pieces are placed diagonally: two white and two
                    black.
                </p>
                <Image src="/how-to-play/screenshot-2.png"
                       alt="Othello game board"
                       width={396}
                       height={396}
                       className="aspect-square	 mx-auto" />
            </div>

            <div className="grid gap-4 my-10">
                <h3 className="text-gray-900 text-base lg:text-lg">Making Moves and Flipping Pieces</h3>
                <ul className="list-disc text-gray-600 text-sm lg:text-base">
                    <li>
                        Players take turns placing their pieces on empty squares. When placing a piece, it must trap
                        opponent’s pieces between two of your pieces, either horizontally, vertically, or
                        diagonally.
                    </li>
                    <li>
                        Trapped opponent pieces are flipped to your color.
                    </li>
                </ul>
                <div className="grid place-items-center">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Image src="/how-to-play/screenshot-3.png"
                               alt="Making Moves and Flipping Pieces"
                               width={396}
                               height={396}
                               className="aspect-square" />
                        <Image src="/how-to-play/screenshot-4.png"
                               alt="Making Moves and Flipping Pieces"
                               width={396}
                               height={396}
                               className="aspect-square" />
                    </div>
                    <p className="mt-1 text-gray-600 text-xs lg:text-sm">
                        An example showing a piece being placed and how opponent pieces are flipped. (With black’s turn,
                        I placed a piece in the 6th row, 5th column, turning the opponent’s white piece in the 5th row,
                        5th column to black.)
                    </p>
                </div>
            </div>


            <div className="grid gap-4 my-10">
                <h3 className="text-gray-900 text-base lg:text-lg">Strategic Moves</h3>
                <p className="text-gray-600 text-sm lg:text-base">
                    Players can gain a strategic advantage by placing pieces on edge and corner squares, as these cannot
                    be flipped easily.
                </p>
            </div>

            <div className="grid gap-4 my-10">
                <h3 className="text-gray-900 text-base lg:text-lg">End of Game and Winner</h3>
                <p className="text-gray-600 text-sm lg:text-base">
                    The game continues until the board is full or no valid moves are possible. The player with the most pieces wins.
                </p>
                <Image src="/how-to-play/screenshot-5.png"
                       alt="Othello game board"
                       width={396}
                       height={396}
                       className="aspect-square	 mx-auto" />
            </div>

        </section>
    )
}