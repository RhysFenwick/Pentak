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

    if (state.selected) {
        if (isLegalMove(state.selected, { q, r })) {
        movePiece(state.selected, { q, r });
        endTurn();
        } else {
        state.selected = null;
        }
    } else if (piece && piece.owner === state.currentPlayer) {
        state.selected = { q, r };
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
            return isStraightLine(dq, dr) && distance(dq, dr) <= 2 && dest?.type != 'Brig';
        case 'Brig':
            return distance(dq, dr) === 1;
        case 'Frigate':
            return isStraightLine(dq, dr) && distance(dq, dr) <= 5;
        default:
            return false;
    }
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
  
    const movingPiece = document.querySelector(`.piece[data-key="${keyFrom}"]`);
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
        render();
    }, 300); // match CSS transition duration
}

// Handles if a piece has been taken (doesn't need to delete it)
function pieceTaken(keyTo) {
    const pieceList = document.getElementById(`${state.currentPlayer}_pieces`)
    const pieceString = pieceList.textContent.toString();
    const takenToken = boardConfig.shipSymbols[state.pieces[keyTo].type];
    pieceList.innerHTML = pieceString.replace(takenToken,"-");
}
  

function endTurn() {
    checkWin()
    state.currentPlayer = state.currentPlayer === 'P1' ? 'P2' : 'P1';
    document.getElementById("game_title").textContent = `${state.currentPlayer}'s turn`
}

// Checks if the current player has won
function checkWin() {

    // Check if 3 bays occupied
    var baycount = 0 // If +/-3, a winner
    const isleWinCount = 3;
    for (const bay of boardConfig.bays) {
        const bayKey = `${bay.q},${bay.r}`;
        if (bayKey in state.pieces) {
            if (state.pieces[bayKey].owner === "P1") baycount += 1;
            else if (state.pieces[bayKey].owner === "P2") baycount -= 1;
        }
    }
    if (baycount >= isleWinCount) {
        endGame("P1");
    }
    else if (baycount <= -isleWinCount) {
        endGame("P2");
    }

    // Check if one side wiped out
    const owners = new Set();
    for (const piece in state.pieces) {
        owners.add(state.pieces[piece].owner);
    }
    if (!owners.has("P1")) {
        endGame("P2");
    }
    else if (!owners.has("P2")) {
        endGame("P1");
    }
}


// Triggered on game end
function endGame(winner) {
    document.getElementById("game_title").textContent = `${winner} won!`;
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
