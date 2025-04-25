import { state, isLegalMove } from './gameLogic.js'
import { boardConfig } from './boardconfig.js'
import { getKeyAsDict, getKeyAsString, shipRange } from './helpers.js';
import { hexes } from './grid.js';

// Point of this file is to provide a simple interface for interacting with a game that's been set up
// Both get (info about state/board) and set (make moves)


// Given {q,r} of a piece, return all valid moves as an array of {q,r} keys.
export function getMoves(miscKey) {
    const key = getKeyAsDict(miscKey); // Make sure it's an object!
    const piece = state.pieces[getKeyAsString(key)] // Object of type and owner
    const range = shipRange(piece.type); // Int
    let inRange = []; // Will be array of {q,r} dict keys of possible squares (unfiltered for validity)
    
    // Cycle through each direction in each range
    for (let i=1; i<range+1; i++) {
        inRange.push({q: key.q + i, r: key.r});
        inRange.push({q: key.q - i, r: key.r});
        inRange.push({q: key.q, r: key.r + i});
        inRange.push({q: key.q, r: key.r - i});
        inRange.push({q: key.q + i, r: key.r-i});
        inRange.push({q: key.q - i, r: key.r+i});
    }

    const validMoves = inRange.filter(from => isLegalMove(key, from));
    return validMoves;
}


// Gets all moves for a player by looping over getMoves() for all their pieces
export function getAllMoves(player="P2") {
    let totalMoves = []; // Will be filled with objects of {from:{q,r},to:{q,r}}
    for (const piece in state.pieces) {
        if (state.pieces[piece].owner == player) {
            const pieceMoves = getMoves(piece); // This should be an array of {q,r} 
            for (const move of pieceMoves) { // "Of" because it's an array
                totalMoves.push({"from":getKeyAsDict(piece),"to":move});
            }
        }
    }
    return totalMoves;
}
