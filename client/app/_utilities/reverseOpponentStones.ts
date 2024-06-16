import { IStone, IStones } from "@/_types";
import { EGamer } from "@/_enums";

export default function reverseOpponentStones(board: IStones, move: IStone, activeGamer: EGamer): IStones {
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

function reverseTopLeft(board: IStones, move: IStone, activeGamer: EGamer): IStones {
    let opponentStones: IStones = [];
    let toBottomRight: IStone | undefined = board.find(item => item.row == move.row + 1 && item.col == move.col + 1);
    if (!toBottomRight?.gamer || toBottomRight?.gamer == activeGamer) return opponentStones;

    opponentStones.push(toBottomRight);
    let hasActiveColorInChain = false;

    while (toBottomRight) {
        toBottomRight = board.find(item => item.row == (toBottomRight as IStone).row + 1 && item.col == (toBottomRight as IStone).col + 1);
        if (!toBottomRight?.gamer) {
            break;
        }
        if (toBottomRight?.gamer == activeGamer) {
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

function reverseTop(board: IStones, move: IStone, activeGamer: EGamer): IStones {
    let opponentStones: IStones = [];
    let toTop: IStone | undefined = board.find(item => item.row == move.row - 1 && item.col == move.col);
    if (!toTop?.gamer || toTop?.gamer == activeGamer) return opponentStones;

    opponentStones.push(toTop);
    let hasActiveColorInChain = false;

    while (toTop) {
        toTop = board.find(item => item.row == (toTop as IStone).row - 1 && item.col == (toTop as IStone).col);
        if (!toTop?.gamer) {
            break;
        }
        if (toTop?.gamer == activeGamer) {
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

function reverseTopRight(board: IStones, move: IStone, activeGamer: EGamer): IStones {
    let opponentStones: IStones = [];
    let toBottomLeft: IStone | undefined = board.find(item => item.row == move.row + 1 && item.col == move.col - 1);
    if (!toBottomLeft?.gamer || toBottomLeft?.gamer == activeGamer) return opponentStones;

    opponentStones.push(toBottomLeft);
    let hasActiveColorInChain = false;

    while (toBottomLeft) {
        toBottomLeft = board.find(item => item.row == (toBottomLeft as IStone).row + 1 && item.col == (toBottomLeft as IStone).col - 1);
        if (!toBottomLeft?.gamer) {
            break;
        }
        if (toBottomLeft?.gamer == activeGamer) {
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

function reverseRight(board: IStones, move: IStone, activeGamer: EGamer): IStones {
    let opponentStones: IStones = [];
    let nextRight: IStone | undefined = board.find(item => item.row == move.row && item.col == move.col + 1);

    if (!nextRight?.gamer || nextRight?.gamer == activeGamer) return opponentStones;

    opponentStones.push(nextRight);
    let hasActiveColorInChain = false;

    while (nextRight) {
        nextRight = board.find(item => item.row == (nextRight as IStone).row && item.col == (nextRight as IStone).col + 1);
        if (!nextRight?.gamer) {
            break;
        }
        if (nextRight?.gamer == activeGamer) {
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

function reverseBottomRight(board: IStones, move: IStone, activeGamer: EGamer): IStones {
    let opponentStones: IStones = [];
    let toTopLeft: IStone | undefined = board.find(item => item.row == move.row - 1 && item.col == move.col - 1);
    if (!toTopLeft?.gamer || toTopLeft?.gamer == activeGamer) return opponentStones;

    opponentStones.push(toTopLeft);
    let hasActiveColorInChain = false;

    while (toTopLeft) {
        toTopLeft = board.find(item => item.row == (toTopLeft as IStone).row - 1 && item.col == (toTopLeft as IStone).col - 1);
        if (!toTopLeft?.gamer) {
            break;
        }
        if (toTopLeft?.gamer == activeGamer) {
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

function reverseBottom(board: IStones, move: IStone, activeGamer: EGamer): IStones {
    let opponentStones: IStones = [];
    let toBottom: IStone | undefined = board.find(item => item.row == move.row + 1 && item.col == move.col);
    if (!toBottom?.gamer || toBottom?.gamer == activeGamer) return opponentStones;

    opponentStones.push(toBottom);
    let hasActiveColorInChain = false;

    while (toBottom) {
        toBottom = board.find(item => item.row == (toBottom as IStone).row + 1 && item.col == (toBottom as IStone).col);
        if (!toBottom?.gamer) {
            break;
        }
        if (toBottom?.gamer == activeGamer) {
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

function reverseBottomLeft(board: IStones, move: IStone, activeGamer: EGamer): IStones {
    let opponentStones: IStones = [];
    let toTopRight: IStone | undefined = board.find(item => item.row == move.row - 1 && item.col == move.col + 1);
    if (!toTopRight?.gamer || toTopRight?.gamer == activeGamer) return opponentStones

    opponentStones.push(toTopRight);
    let hasActiveColorInChain = false;

    // left
    while (toTopRight) {
        toTopRight = board.find(item => item.row == (toTopRight as IStone).row - 1 && item.col == (toTopRight as IStone).col + 1);
        if (!toTopRight?.gamer) {
            break;
        }
        if (toTopRight?.gamer == activeGamer) {
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

function reverseLeft(board: IStones, move: IStone, activeGamer: EGamer): IStones {
    let opponentStones: IStones = [];
    let toLeft: IStone | undefined = board.find(item => item.row == move.row && item.col == move.col - 1);
    if (!toLeft?.gamer || toLeft?.gamer == activeGamer) return opponentStones;

    opponentStones.push(toLeft);
    let hasActiveColorInChain = false;

    while (toLeft) {
        toLeft = board.find(item => item.row == (toLeft as IStone).row && item.col == (toLeft as IStone).col - 1);
        if (!toLeft?.gamer) {
            break;
        }
        if (toLeft?.gamer == activeGamer) {
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










