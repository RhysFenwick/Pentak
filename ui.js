import { state } from './gameLogic.js';
import { isIsland, isBay, cubeToPixel } from './grid.js';
import { boardConfig } from './boardconfig.js';

export function render() {
    // Clear existing pieces
    document.querySelectorAll('.piece').forEach(el => el.remove());
  
    for (const [key, piece] of Object.entries(state.pieces)) {
      const [q, r] = key.split(',').map(Number);
      const s = -q - r;
      const { x, y } = cubeToPixel(q, r, true);
  
      const el = document.createElement('div');
      el.className = 'piece';
      el.innerHTML = boardConfig.shipTypes[piece.type].symbol;
      el.style.textAlign = "center";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.background = piece.owner === 'P1' ? 'navy' : 'maroon';
  
      el.dataset.key = key;
      document.getElementById('board').appendChild(el);
    }
  
    // Also update base hex colours
    document.querySelectorAll('.hex').forEach(hex => {
      const key = `${hex.dataset.q},${hex.dataset.r}`;
      hex.style.background = isIsland(key)
        ? 'darkgreen'
        : isBay(key)
        ? 'lightseagreen'
        : 'dodgerblue';
    });
  }
  
