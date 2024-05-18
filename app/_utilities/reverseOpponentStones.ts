import { Stone, Stones } from "@/_types";
import { Gamer } from "@/_enums";

export default function reverseOpponentStones(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    return [
        ...reverseTopLeft(board, move, activeGamer),
        ...reverseTop(board, move, activeGamer),
        ...reverseTopRight(board, move, activeGamer),
        ...reverseRight(board, move, activeGamer),
        ...reverseBottomRight(board, move, activeGamer),
        ...reverseBottom(board, move, activeGamer),
        ...reverseBottomLeft(board, move, activeGamer),
        ...reverseLeft(board, move, activeGamer),
    ]
}

function reverseTopLeft(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    let opponentStones: Stones = [];
    let toBottomRight: Stone | undefined = board.find(item => item.row == move.row + 1 && item.col == move.col + 1);
    if (!toBottomRight?.value || toBottomRight?.value == activeGamer) return opponentStones;

    opponentStones.push(toBottomRight);
    let hasActiveColorInChain = false;

    while (toBottomRight) {
        toBottomRight = board.find(item => item.row == (toBottomRight as Stone).row + 1 && item.col == (toBottomRight as Stone).col + 1);
        if (!toBottomRight?.value) {
            break;
        }
        if (toBottomRight?.value == activeGamer) {
            hasActiveColorInChain = true;
            break;
        }
        if (toBottomRight) {
            opponentStones.push(toBottomRight);
        }
    }

    if (!hasActiveColorInChain) {
        opponentStones = [];
    }
    return opponentStones;
}

function reverseTop(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    let opponentStones: Stones = [];
    let toTop: Stone | undefined = board.find(item => item.row == move.row - 1 && item.col == move.col);
    if (!toTop?.value || toTop?.value == activeGamer) return opponentStones;

    opponentStones.push(toTop);
    let hasActiveColorInChain = false;

    while (toTop) {
        toTop = board.find(item => item.row == (toTop as Stone).row - 1 && item.col == (toTop as Stone).col);
        if (!toTop?.value) {
            break;
        }
        if (toTop?.value == activeGamer) {
            hasActiveColorInChain = true;
            break;
        }
        if (toTop) {
            opponentStones.push(toTop);
        }
    }

    if (!hasActiveColorInChain) {
        opponentStones = [];
    }

    return opponentStones;
}

function reverseTopRight(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    let opponentStones: Stones = [];
    let toBottomLeft: Stone | undefined = board.find(item => item.row == move.row + 1 && item.col == move.col - 1);
    if (!toBottomLeft?.value || toBottomLeft?.value == activeGamer) return opponentStones;

    opponentStones.push(toBottomLeft);
    let hasActiveColorInChain = false;

    while (toBottomLeft) {
        toBottomLeft = board.find(item => item.row == (toBottomLeft as Stone).row + 1 && item.col == (toBottomLeft as Stone).col - 1);
        if (!toBottomLeft?.value) {
            break;
        }
        if (toBottomLeft?.value == activeGamer) {
            hasActiveColorInChain = true;
            break;
        }
        if (toBottomLeft) {
            opponentStones.push(toBottomLeft);
        }
    }

    if (!hasActiveColorInChain) {
        opponentStones = [];
    }

    return opponentStones;
}

function reverseRight(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    let opponentStones: Stones = [];
    let nextRight: Stone | undefined = board.find(item => item.row == move.row && item.col == move.col + 1);

    if (!nextRight?.value || nextRight?.value == activeGamer) return opponentStones;

    opponentStones.push(nextRight);
    let hasActiveColorInChain = false;

    while (nextRight) {
        nextRight = board.find(item => item.row == (nextRight as Stone).row && item.col == (nextRight as Stone).col + 1);
        if (!nextRight?.value) {
            break;
        }
        if (nextRight?.value == activeGamer) {
            hasActiveColorInChain = true;
            break;
        }
        if (nextRight) {
            opponentStones.push(nextRight);
        }
    }

    if (!hasActiveColorInChain) {
        opponentStones = [];
    }

    return opponentStones;
}

function reverseBottomRight(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    let opponentStones: Stones = [];
    let toTopLeft: Stone | undefined = board.find(item => item.row == move.row - 1 && item.col == move.col - 1);
    if (!toTopLeft?.value || toTopLeft?.value == activeGamer) return opponentStones;

    opponentStones.push(toTopLeft);
    let hasActiveColorInChain = false;

    while (toTopLeft) {
        toTopLeft = board.find(item => item.row == (toTopLeft as Stone).row - 1 && item.col == (toTopLeft as Stone).col - 1);
        if (!toTopLeft?.value) {
            break;
        }
        if (toTopLeft?.value == activeGamer) {
            hasActiveColorInChain = true;
            break;
        }
        if (toTopLeft) {
            opponentStones.push(toTopLeft);
        }
    }

    if (!hasActiveColorInChain) {
        opponentStones = [];
    }

    return opponentStones;
}

function reverseBottom(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    let opponentStones: Stones = [];
    let toBottom: Stone | undefined = board.find(item => item.row == move.row + 1 && item.col == move.col);
    if (!toBottom?.value || toBottom?.value == activeGamer) return opponentStones;

    opponentStones.push(toBottom);
    let hasActiveColorInChain = false;

    while (toBottom) {
        toBottom = board.find(item => item.row == (toBottom as Stone).row + 1 && item.col == (toBottom as Stone).col);
        if (!toBottom?.value) {
            break;
        }
        if (toBottom?.value == activeGamer) {
            hasActiveColorInChain = true;
            break;
        }
        if (toBottom) {
            opponentStones.push(toBottom);
        }
    }

    if (!hasActiveColorInChain) {
        opponentStones = [];
    }
    return opponentStones;
}

function reverseBottomLeft(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    let opponentStones: Stones = [];
    let toTopRight: Stone | undefined = board.find(item => item.row == move.row - 1 && item.col == move.col + 1);
    if (!toTopRight?.value || toTopRight?.value == activeGamer) return opponentStones

    opponentStones.push(toTopRight);
    let hasActiveColorInChain = false;

    // left
    while (toTopRight) {
        toTopRight = board.find(item => item.row == (toTopRight as Stone).row - 1 && item.col == (toTopRight as Stone).col + 1);
        if (!toTopRight?.value) {
            break;
        }
        if (toTopRight?.value == activeGamer) {
            hasActiveColorInChain = true;
            break;
        }
        if (toTopRight) {
            opponentStones.push(toTopRight);
        }
    }

    if (!hasActiveColorInChain) {
        opponentStones = [];
    }

    return opponentStones;
}

function reverseLeft(board: Stones, move: Stone, activeGamer: Gamer): Stones {
    let opponentStones: Stones = [];
    let toLeft: Stone | undefined = board.find(item => item.row == move.row && item.col == move.col - 1);
    if (!toLeft?.value || toLeft?.value == activeGamer) return opponentStones;

    opponentStones.push(toLeft);
    let hasActiveColorInChain = false;

    while (toLeft) {
        toLeft = board.find(item => item.row == (toLeft as Stone).row && item.col == (toLeft as Stone).col - 1);
        if (!toLeft?.value) {
            break;
        }
        if (toLeft?.value == activeGamer) {
            hasActiveColorInChain = true;
            break;
        }
        if (toLeft) {
            opponentStones.push(toLeft);
        }
    }

    if (!hasActiveColorInChain) {
        opponentStones = [];
    }

    return opponentStones;
}










