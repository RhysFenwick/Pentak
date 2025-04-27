import { state, isLegalMove } from './gameLogic.js'
import { boardConfig } from './boardconfig.js'
import { getKeyAsDict, getKeyAsString, hexDeltas, isEmpty, shipRange } from './helpers.js';
import { hexes } from './grid.js';

// Point of this file is to provide a simple interface for interacting with a game that's been set up
// Both get (info about state/board) and set (make moves)


// Given {q,r} of a piece, return all valid moves as an array of {q,r} keys.
export function getMoves(miscKey) {
    const key = getKeyAsDict(miscKey); // Make sure it's an object!
    const piece = state.pieces[getKeyAsString(key)] // Object of type and owner
    const range = shipRange(piece.type); // Int
    let inRange = []; // Will be array of {q,r} dict keys of possible squares (unfiltered for validity)
    let validMoves = []; // Will become array returned
    
    // Cycle through each direction in each range if that's the movement type
    if (boardConfig.shipTypes[piece.type].straight_line_only) {
        for (let i=1; i<=range; i++) {
            for (const delta of hexDeltas) {
                inRange.push({q: key.q + delta[0]*i, r: key.r + delta[1]*i});
            }
        }
        validMoves = inRange.filter(to => isLegalMove(key, to));
    }

    else { // Pieces that move by stepping
        // Create an array of sets of arrays - each inner set represents a step from the home base, starting with the piece itself
        // Using sets to auto-cut out duplicates; this requires using arrays for coords rather than objects
        let inner_layer = new Set();
        inner_layer.add([key.q,key.r]);
        let move_layers = [inner_layer];

        for (let i=1; i<=range; i++) { // Repeat for each layer
            let current_layer = new Set(); // Temporary (pre-legality-filter) set
            const last_layer = move_layers[move_layers.length-1]; // The set (previous layer) being compared to
            for (const coord of last_layer) { // Add the six neighbouring hexes (minus duplicates, because set)
                for (const delta of hexDeltas) {
                    current_layer.add([coord[0] + delta[0],coord[1]+delta[1]]);
                }
            }

            // Now filter out any that aren't legal moves and add to validMoves
            let legal_layer = new Set(); // Will get appended to move_layers when complete
            for (const coord of current_layer) {
                const coord_key = {q:coord[0],r:coord[1]}
                if (isLegalMove(key,coord_key)) { // If it's legal (including taking a piece!) add to validMoves
                    validMoves.push(coord_key);

                    // ...But only add to the move_layers if it's a free hex (i.e. can be navigated through)
                    if (isEmpty(coord)) {
                        legal_layer.add(coord);
                    }
                }
            }
            move_layers.push(legal_layer); // Now the next layer is added!
        }
    }

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
