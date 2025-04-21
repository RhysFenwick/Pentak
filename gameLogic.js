import { isIsland, cubeToPixel } from './grid.js';
import { render } from './ui.js';
import { boardConfig } from './boardconfig.js'


export const state = {
    currentPlayer: 'P1',
    selected: null,
    pieces: {}
};

export function handleClick(q, r) {
    const key = `${q},${r}`;
    const piece = state.pieces[key];

    if (piece && piece.owner === state.currentPlayer) { // If clicking on your own piece, it's selected now

        if (state.selected) { // De-highlight previously selected piece if there is one
            pieceHighlight(state.selected,false);
        }
        
        state.selected = { q, r }; // Make clicked-on piece the new selected one
        // Highlight newly selected piece
        pieceHighlight(state.selected);
    }

    else if (state.selected) { // If there's already a piece selected, check if you've clicked on a legal move
        if (isLegalMove(state.selected, { q, r })) {
            movePiece(state.selected, { q, r });
        } else {
            pieceHighlight(state.selected,false);
            state.selected = null; // Deselect
        }
    } 
}

// Get the actual DOM element
function getPieceFromKey(key) {
    // Hacky overloading - either pass a string or an object that needs converting into a string
    if (typeof key === "string") {
        return document.querySelector(`.piece[data-key="${key}"]`);
    }
    else {
        return document.querySelector(`.piece[data-key="${key.q},${key.r}"]`);
    }
}

// Highlights or de-highlights the actual DOM element of a piece
function pieceHighlight (key, turnOn=true) {
    if (turnOn) {
        getPieceFromKey(state.selected).style.filter = "brightness(1.5)";
    }
    else {
        getPieceFromKey(state.selected).style.filter = "brightness(1)";
    }
}

function isLegalMove(from, to) {
    const keyFrom = `${from.q},${from.r}`;
    const piece = state.pieces[keyFrom];
    const keyTo = `${to.q},${to.r}`;
    const dest = state.pieces[keyTo];

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

function shipRange(type) {
    return boardConfig.shipTypes[type].moves
}

function distance(dq, dr) {
    return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(-dq - dr));
}

function isStraightLine(dq, dr) {
    return dq === 0 || dr === 0 || dq + dr === 0;
}

function clearLine(from, to) {
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

function movePiece(from, to) {
    const keyFrom = `${from.q},${from.r}`;
    const keyTo = `${to.q},${to.r}`;
  
    const movingPiece = getPieceFromKey(keyFrom);
    if (!movingPiece) return;

    // If piece is taken, handle that
    if (state.pieces[keyTo]) {
        pieceTaken(keyTo);
    }
  
    const s = -to.q - to.r;
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
}

// Handles if a piece has been taken (doesn't need to delete it)
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
    const p1Start = [
        { q: 0, r: 0, type: 'Sloop' },
        { q: 1, r: 0, type: 'Brig' },
        { q: 2, r: 0, type: 'Sloop' },
        { q: 3, r: 0, type: 'Brig' },
        { q: 4, r: 0, type: 'Frigate' },
        { q: 5, r: 0, type: 'Brig' },
        { q: 6, r: 0, type: 'Sloop' },
        { q: 7, r: 0, type: 'Brig' },
        { q: 8, r: 0, type: 'Sloop' }
    ];
    for (const { q, r, type } of p1Start) {
        state.pieces[`${q},${r}`] = { type, owner: 'P2' };
    }
    for (const { q, r, type } of p1Start) {
        const newR = 8 - r, newQ = 4-q;
        state.pieces[`${newQ},${newR}`] = { type, owner: 'P1' };
    }

    console.log(state)
}
