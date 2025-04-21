import { state } from './gameLogic.js';
import { isIsland, isBay } from './grid.js';
import { boardConfig } from './boardconfig.js';

export function render() {
    document.querySelectorAll('.hex').forEach(hex => {
        const key = `${hex.dataset.q},${hex.dataset.r}`;
        const piece = state.pieces[key];
        hex.innerHTML = piece ? boardConfig.shipSymbols[piece.type] : '';
        hex.style.background = piece
        ? (piece.owner === 'P1' ? 'navy' : 'maroon')
        : isIsland(key) ? 'sienna' : isBay(key) ? 'aqua' : 'lightblue';
    });
}
