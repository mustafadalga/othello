import { Stone, Stones } from "@/_types";
import { Gamer } from "@/_enums";
import { DIMENSION } from "@/_constants";

export default function createHints(board: Stones, opponentStones: Stones, activeGamer: Gamer) {
    return [
        ...topLeft(board, opponentStones, activeGamer),
        ...top(board, opponentStones, activeGamer),
        ...topRight(board, opponentStones, activeGamer),
        ...right(board, opponentStones, activeGamer),
        ...bottomRight(board, opponentStones, activeGamer),
        ...bottom(board, opponentStones, activeGamer),
        ...bottomLeft(board, opponentStones, activeGamer),
        ...left(board, opponentStones, activeGamer),
    ]
}

function topLeft(board: Stones, opponentStones: Stones, activeGamer: Gamer): number[] {
    const hints: number[] = [];
    for (const stone of opponentStones) {
        if (stone.row == 0) continue;

        const rowIndex: number = stone.row;
        const colIndex: number = stone.col;
        const index: number = rowIndex * DIMENSION + colIndex;
        const toTopLeftIndex: number = (index - DIMENSION - 1);
        const isFirstCol: boolean = colIndex === 0;

        if (isFirstCol || board[toTopLeftIndex]?.gamer) continue;

        let isActiveGamerLinked: boolean = false;
        let toBottomRight: Stone | undefined = stone;

        while (!isActiveGamerLinked) {
            toBottomRight = board.find(item => item.row == (toBottomRight?.row || 0) + 1 && item.col == (toBottomRight?.col || 0) + 1);

            if (!toBottomRight?.gamer) {
                break;
            }

            if (toBottomRight?.gamer == activeGamer) {
                isActiveGamerLinked = true;
            }
        }

        if (isActiveGamerLinked) {
            hints.push(toTopLeftIndex)
        }
    }

    return hints;
}

function top(board: Stones, opponentStones: Stones, activeGamer: Gamer): number[] {
    const hints: number[] = [];

    for (const stone of opponentStones) {
        if (stone.row == 0) continue;

        const index: number = (stone.row) * DIMENSION + (stone.col);
        const toTopIndex: number = index - DIMENSION;

        if (board[toTopIndex].gamer) continue;

        let isActiveGamerLinked: boolean = false;
        let toBottomRow: number = stone.row;

        while (!isActiveGamerLinked) {
            toBottomRow += 1;
            if (toBottomRow > DIMENSION - 1) {
                break;
            }
            const toBottomRowItem = board.find(item => item.row == toBottomRow && item.col == stone.col);

            if (!toBottomRowItem?.gamer) {
                break;
            }

            if (toBottomRowItem.gamer == activeGamer) {
                isActiveGamerLinked = true;
            }
        }

        if (isActiveGamerLinked) {
            hints.push(toTopIndex)
        }
    }

    return hints;
}

function topRight(board: Stones, opponentStones: Stones, activeGamer: Gamer): number[] {
    const hints: number[] = [];

    for (const stone of opponentStones) {
        if (stone.row == 0) continue;

        const rowIndex: number = stone.row;
        const colIndex: number = stone.col;
        const index: number = rowIndex * DIMENSION + colIndex;

        const toTopRightIndex: number = (index - DIMENSION + 1)
        const isFirstRowOrLastCol: boolean = rowIndex === 0 || colIndex === DIMENSION - 1;

        if (isFirstRowOrLastCol || board[toTopRightIndex]?.gamer) continue;

        let isActiveGamerLinked: boolean = false;
        let toTop: Stone | undefined = stone;

        while (!isActiveGamerLinked) {
            toTop = board.find(item => item.row == (toTop?.row || 0) + 1 && item.col == (toTop?.col || 0) - 1);

            if (!toTop?.gamer) {
                break;
            }

            if (toTop?.gamer == activeGamer) {
                isActiveGamerLinked = true;
            }
        }

        if (isActiveGamerLinked) {
            hints.push(toTopRightIndex)
        }
    }

    return hints;
}

function right(board: Stones, opponentStones: Stones, activeGamer: Gamer): number[] {
    const hints: number[] = [];

    for (const stone of opponentStones) {
        if (stone.col == DIMENSION - 1) continue;
        const index: number = (stone.row) * DIMENSION + (stone.col);
        const toRightIndex: number = index + 1;

        if (board[toRightIndex].gamer) continue;

        let isActiveGamerLinked: boolean = false;
        let toLeft: Stone | undefined = stone;

        while (!isActiveGamerLinked) {
            toLeft = board.find(item => item.row == (stone?.row || 0) && item.col == (toLeft?.col || 0) - 1);
            if (!toLeft?.gamer) break;

            if (toLeft?.gamer == activeGamer) {
                isActiveGamerLinked = true
            }
        }

        if (isActiveGamerLinked) {
            hints.push(toRightIndex)
        }
    }

    return hints;
}

function bottomRight(board: Stones, opponentStones: Stones, activeGamer: Gamer): number[] {
    const hints: number[] = [];

    for (const stone of opponentStones) {
        if (stone.row >= DIMENSION - 1 || stone.col == DIMENSION - 1) continue;

        const rowIndex: number = stone.row;
        const colIndex: number = stone.col;
        const index: number = rowIndex * DIMENSION + colIndex;
        const toBottomRightIndex: number = index + DIMENSION + 1;

        if (board[toBottomRightIndex]?.gamer) continue;

        let isActiveGamerLinked: boolean = false;
        let toBottomRight: Stone | undefined = stone;

        while (!isActiveGamerLinked) {
            toBottomRight = board.find(item => item.row == (toBottomRight?.row || 0) - 1 && item.col == (toBottomRight?.col || 0) - 1);

            if (!toBottomRight?.gamer) {
                break;
            }
            if (toBottomRight?.gamer == activeGamer) {
                isActiveGamerLinked = true
            }
        }

        if (isActiveGamerLinked) {
            hints.push(toBottomRightIndex)
        }
    }

    return hints;
}

function bottom(board: Stones, opponentStones: Stones, activeGamer: Gamer): number[] {
    const hints: number[] = [];

    for (const stone of opponentStones) {
        if (stone.row >= DIMENSION - 1) continue;

        const index: number = (stone.row) * DIMENSION + (stone.col);
        const toBottomIndex: number = index + DIMENSION;

        if (board[toBottomIndex].gamer) continue;

        let isActiveGamerLinked: boolean = false;
        let toTopRow: number = stone.row;

        while (!isActiveGamerLinked) {
            toTopRow -= 1;
            if (toTopRow < 0) {
                break
            }
            const toTopRowItem = board.find(item => item.row == toTopRow && item.col == stone.col);
            if (!toTopRowItem?.gamer) {
                break
            }
            if (toTopRowItem?.gamer == activeGamer) {
                isActiveGamerLinked = true;
            }
        }

        if (isActiveGamerLinked) {
            hints.push(toBottomIndex)
        }
    }

    return hints;
}

function bottomLeft(board: Stones, opponentStones: Stones, activeGamer: Gamer): number[] {
    const hints: number[] = [];

    for (const stone of opponentStones) {
        if (stone.row >= DIMENSION - 1 || stone.col == 0) continue;

        const index: number = stone.row * DIMENSION + stone.col;
        const toBottomLeftIndex: number = index + DIMENSION - 1;

        if (board[toBottomLeftIndex]?.gamer) continue;

        let isActiveGamerLinked: boolean = false;

        let toBottomLeft: Stone | undefined = stone;

        while (!isActiveGamerLinked) {
            toBottomLeft = board.find(item => item.row == (toBottomLeft?.row || 0) - 1 && item.col == (toBottomLeft?.col || 0) + 1);
            if (!toBottomLeft?.gamer) break;

            if (toBottomLeft?.gamer == activeGamer) {
                isActiveGamerLinked = true;
            }
        }

        if (isActiveGamerLinked) {
            hints.push(toBottomLeftIndex)
        }
    }

    return hints;
}

function left(board: Stones, opponentStones: Stones, activeGamer: Gamer): number[] {
    const hints: number[] = [];

    for (const stone of opponentStones) {
        if (stone.col == 0) continue;
        const index = (stone.row) * DIMENSION + (stone.col);

        const toLeftIndex: number = index - 1;

        if (board[toLeftIndex].gamer) continue;

        let isActiveGamerLinked: boolean = false;
        let toRight: Stone | undefined = stone;

        while (!isActiveGamerLinked) {
            toRight = board.find(item => item.row == (stone?.row || 0) && item.col == (toRight?.col || 0) + 1);
            if (!toRight?.gamer) break;

            if (toRight?.gamer == activeGamer) {
                isActiveGamerLinked = true
            }
        }

        if (isActiveGamerLinked) {
            hints.push(toLeftIndex)
        }
    }

    return hints;
}
