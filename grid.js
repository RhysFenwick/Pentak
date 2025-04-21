import { boardConfig } from './boardconfig.js'


export function cubeToPixel(q, r, s) {
    const size = 60 * 2/3;
    const x = size * Math.sqrt(3) * q + (r % 2) * (Math.sqrt(3) / 2) * size;
    const y = size * 1.5 * r;
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
}
  
  