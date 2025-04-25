import { state } from "./gameLogic.js";
import { boardConfig } from "./boardconfig.js";
import { hexes } from "./grid.js";


// Point of this file is to store utility functions outside the main files to declutter.

// Get the actual DOM element from {q,r}
export function getDOMPieceFromKey(key) {
    return document.querySelector(`.piece[data-key="${key.q},${key.r}"]`);
}

// Get the DOM element of a hex from {q,r}
export function getDOMHexFromKey(key) {
    return document.querySelector(`.hex[data-q="${key.q}"][data-r="${key.r}"]`);
}

export function shipRange(type) {
    return boardConfig.shipTypes[type].moves
}

export function distance(dq, dr) {
    return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(-dq - dr));
}

export function isStraightLine(dq, dr) {
    return dq === 0 || dr === 0 || dq + dr === 0;
}

export function clearLine(from, to) {
    const dq = to.q - from.q;
    const dr = to.r - from.r;
    const dist = distance(dq, dr);
    const stepQ = dq / dist;
    const stepR = dr / dist;
    for (let i = 1; i < dist; i++) {
        const key = `${from.q + i * stepQ},${from.r + i * stepR}`;
        if (state.pieces[key] || isIsland(key)) return false;
    }
    return true;
}

// Takes either type of qr and returns "q,r" as string
export function getKeyAsString(q, r=null) {
    if (typeof q == "string") { // Handling the edge case of being passed "q,r" from state.pieces
        return q;
    }
    const qrDict = getKeyAsDict(q,r); // Pushes the overloading into that function
    return `${qrDict.q},${qrDict.r}`;
}

// Takes any type of key and returns {q,r}
// Which is a dict...which is a (simple) object
// Hacky overloading but it works
export function getKeyAsDict(q,r=null) {
    if (r) { // There were two vars passed
        return {q,r};
    }
    else { // Only one arg passed
        if (typeof q == "string") {
            const coords = q.split(","); // Array of two
            return {q: parseInt(coords[0]), r: parseInt(coords[1])};
        }
        else {
            return q;
        }
    }
}

// Gets piece object in state from key object if it exists, else null
export function getPiece(keyObj) {
    const keyStr = getKeyAsString(keyObj);
    const piece = state.pieces[keyStr];
    return piece;
}


export function isIsland(key) {
    return boardConfig.islands.some(pos => getKeyAsString(pos) === key);
}
  
export function isBay(key) {
    return boardConfig.bays.some(pos => getKeyAsString(pos) === key);
}

// Takes a {q,r} and returns a bool based off if it's a valid hex
export function hexOnBoard(key) {
    return hexes.some(hex => hex.q === key.q && hex.r === key.r);
}
