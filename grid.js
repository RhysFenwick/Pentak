import { boardConfig } from './boardconfig.js'


export function cubeToPixel(q, r, s) {
    const size = 36; // TODO: Pull out to reference elsewhere
    const boardMargin = 10; // Pixel margin before closest hex
    const x = size * Math.sqrt(3) * q + (r % 2) * (Math.sqrt(3) / 2) * size + boardMargin;
    const y = size * 1.5 * r + boardMargin - Math.floor(r/2);
    return { x, y };
}
  
function getKey(q, r) {
    return `${q},${r}`;
}

export function isIsland(key) {
    return boardConfig.islands.some(pos => getKey(pos.q, pos.r) === key);
}
  
export function isBay(key) {
    return boardConfig.bays.some(pos => getKey(pos.q, pos.r) === key);
}
  
export function createBoard(container, onClick) {
    const gridSize = boardConfig.size;
    container.innerHTML = '';
    for (let r = 0; r < gridSize; r++) {
        for (let col = 0; col < gridSize; col++) {
        const q = col - ((r - (r & 1)) / 2); // axial q
        const s = -q - r; // cube s
        const key = `${q},${r}`;

        const div = document.createElement('div');
        div.className = 'hex';

        const { x, y } = cubeToPixel(col, r,s);
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;

        div.dataset.q = q;
        div.dataset.r = r;
        div.dataset.s = s;

        div.onclick = () => onClick(q, r, s);
        container.appendChild(div);
        }
    }

    // Shrink board to fit
    container.style.width = `${54 * (gridSize + 1.5) + 20}px`;
    container.style.height = `${54 * gridSize + 10}px`;
}
  
  