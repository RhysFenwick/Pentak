import { state, isLegalMove } from './gameLogic.js'
import { boardConfig } from './boardconfig.js'
import { getKeyAsString, shipRange } from './helpers.js';
import { hexes } from './grid.js';

// Point of this file is to provide a simple interface for interacting with a game that's been set up
// Both get (info about state/board) and set (make moves)


// Given {q,r} of a piece, return all valid moves as an array of {q,r} keys.
export function getMoves(key) {
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
