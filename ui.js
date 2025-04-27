import { state } from './gameLogic.js';
import { cubeToPixel } from './grid.js';
import { boardConfig } from './boardconfig.js';
import { getDOMPieceFromKey, isIsland, isBay, getDOMHexFromKey } from './helpers.js';

export function render() {
    // Clear existing pieces
    document.querySelectorAll('.piece').forEach(el => el.remove());
  
    for (const [key, piece] of Object.entries(state.pieces)) {
      const [q, r] = key.split(',').map(Number);
      const s = -q - r;
      const { x, y } = cubeToPixel(q, r, true);
  
      const el = document.createElement('div');
      el.className = 'piece';
      el.innerHTML = `<h2>${boardConfig.shipTypes[piece.type].symbol}</h2>`;
      el.style.textAlign = "center";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.background = piece.owner === 'P1' ? 'navy' : 'maroon';
  
      el.dataset.key = key;
      document.getElementById('board').appendChild(el);
    }
  
    // Also update base hex colours
    document.querySelectorAll('.hex').forEach(hex => {
      const key = {q: parseInt(hex.dataset.q),r: parseInt(hex.dataset.r)};
      hex.style.background = isIsland(key)
        ? 'darkgreen'
        : isBay(key)
        ? 'lightseagreen'
        : 'dodgerblue';
    });
  }

// Highlights or de-highlights the actual DOM element of the selected piece
export function pieceHighlight(turnOn=true, piece=state.selected) {
  if (turnOn) {
      getDOMPieceFromKey(piece).style.filter = "brightness(1.5)";
  }
  else {
      getDOMPieceFromKey(piece).style.filter = "brightness(1)";
  }
}

// Highlights hex from {q,r} (with or without piece)
export function hexHighlight(key,turnOn=true) {
  if (turnOn) {
    getDOMHexFromKey(key).style.filter = "brightness(1.5)";
  }
  else {
    getDOMHexFromKey(key).style.filter = "brightness(1)";
  }
}
  
