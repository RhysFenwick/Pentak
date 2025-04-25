import { cubeToPixel, hexes } from './grid.js';
import { render, pieceHighlight, hexHighlight } from './ui.js';
import { boardConfig } from './boardconfig.js'
import { getAllMoves, getMoves } from './interact.js';
import { getDOMPieceFromKey, isStraightLine, distance, clearLine, shipRange, isIsland, getKeyAsString, hexOnBoard, getDOMHexFromKey } from './helpers.js';


export const state = {
    currentPlayer: 'P1',
    selected: null,
    pieces: {}
};

export function handleClick(q, r) {
    const key = `${q},${r}`;
    const piece = state.pieces[key];
    getAllMoves();

    if (piece && piece.owner === state.currentPlayer) { // If clicking on your own piece, it's selected now

        if (state.selected) { // De-highlight previously selected piece if there is one
            pieceHighlight(false);
        }
        
        state.selected = { q, r }; // Make clicked-on piece the new selected one
        const poss_moves = getMoves(state.selected);
        for (const hex of hexes) {
            if (poss_moves.some(poss => hex.q === poss.q && hex.r === poss.r)) { // For each hex on the board, see if it's a possible move...
                hexHighlight(hex); // ...Then highlight any that are a match...
            }
            else {
                hexHighlight(hex,false); // ...And turn off any that aren't a match
            }
        }
        // Highlight newly selected piece
        pieceHighlight();
    }

    else if (state.selected) { // If there's already a piece selected, check if you've clicked on a legal move
        if (!tryMove(state.selected, { q, r })) { // Tries to make the move - inside will trigger on failure
            pieceHighlight(false);
            state.selected = null; // Deselect
        }
    } 
}

// Tries to move a piece; returns a bool indicating success - takes {q,r}/{q,r}
export function tryMove(to,from) {
    if (isLegalMove(to,from)) {
        movePiece(to,from);
        return true;
    } else {
        return false;
    }
}

// Takes two {q,r}s and returns a bool if legal move
export function isLegalMove(from, to) {
    const keyFrom = getKeyAsString(from);
    const piece = state.pieces[keyFrom];
    const keyTo = getKeyAsString(to);
    const dest = state.pieces[keyTo];

    // Check both are in the grid
    if (!(hexOnBoard(from) && hexOnBoard(to))) {
        return false;
    }

    if (dest?.owner === piece.owner || isIsland(keyTo)) return false; // Can't move onto an island or take your own pieces
    if (!clearLine(from,to)) return false; // Can't move through an island

    const dq = to.q - from.q;
    const dr = to.r - from.r;

    switch (piece.type) {
        case 'Sloop':
            return isStraightLine(dq, dr) && distance(dq, dr) <= shipRange('Sloop') && dest?.type != 'Brig';
        case 'Brig':
            return distance(dq, dr) === shipRange('Brig');
        case 'Frigate':
            return isStraightLine(dq, dr) && distance(dq, dr) <= shipRange('Frigate');
        default:
            return false;
    }
}


function movePiece(from, to) {
    const keyFrom = `${from.q},${from.r}`;
    const keyTo = `${to.q},${to.r}`;
  
    const movingPiece = getDOMPieceFromKey(from);
    if (!movingPiece) return;

    // If piece is taken, handle that
    if (state.pieces[keyTo]) {
        pieceTaken(keyTo);
    }
  
    const { x, y } = cubeToPixel(to.q, to.r, true);
  
    // Update dataset so render() doesn't overwrite mid-move
    movingPiece.dataset.key = keyTo;
  
    // Animate with CSS transition
    movingPiece.style.left = `${x}px`;
    movingPiece.style.top = `${y}px`;
  
    // Wait for animation to complete, then update state
    setTimeout(() => {
        state.pieces[keyTo] = state.pieces[keyFrom]; // This wipes out any piece already there
        delete state.pieces[keyFrom];
        state.selected = null;
        endTurn();
        render();
    }, 300); // match CSS transition duration

    // Un-highlight any possible move hexes
    for (const hex of hexes) {
        hexHighlight(hex, false);
    }
}

// Handles if a piece has been taken (doesn't need to delete it) - currently just alters the counter
function pieceTaken(keyTo) {
    const pieceList = document.getElementById(`${state.currentPlayer}_pieces`)
    const pieceString = pieceList.textContent.toString();
    const takenToken = boardConfig.shipTypes[state.pieces[keyTo].type].symbol;
    pieceList.innerHTML = pieceString.replace(takenToken,"-");
}
  

function endTurn() {
    // Check if the current player has won
    // Check if 3 bays occupied
    var baycount = 0 // If +/-3, a winner
    const isleWinCount = 1;
    const pieceCoords = Object.keys(state.pieces);
    for (const bay of boardConfig.bays) {
        const bayKey = `${bay.q},${bay.r}`;
        if (pieceCoords.includes(bayKey)) {
            if (state.pieces[bayKey].owner === "P1") baycount += 1;
            else if (state.pieces[bayKey].owner === "P2") baycount -= 1;
        }
    }

    if (baycount >= isleWinCount) {
        endGame("P1");
        return;
    }
    else if (baycount <= -isleWinCount) {
        endGame("P2");
        return;
    }

    // Check if one side wiped out
    const owners = new Set();
    for (const piece in state.pieces) {
        owners.add(state.pieces[piece].owner);
    }
    if (!owners.has("P1")) {
        endGame("P2");
        return;
    }
    else if (!owners.has("P2")) {
        endGame("P1");
        return;
    }

    state.currentPlayer = state.currentPlayer === 'P1' ? 'P2' : 'P1';
    document.getElementById("game_title").textContent = `${state.currentPlayer}'s turn`
}


// Triggered on game end
function endGame(winner) {
    document.getElementById("game_title").textContent = `${winner} won!`;
    console.log("Game Over")
    // TODO: Offer new game
}


// Set up the two sides with rotational symmetry
export function initPieces() {
    const p2Start = boardConfig.initialShips;
    for (const { q, r, type } of p2Start) {
        state.pieces[`${q},${r}`] = { type, owner: 'P2' };
    }
    for (const { q, r, type } of p2Start) {
        const newR = 8 - r, newQ = 4-q;
        state.pieces[`${newQ},${newR}`] = { type, owner: 'P1' };
    }

    console.log(state);
}
