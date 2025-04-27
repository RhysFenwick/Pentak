import { boardConfig } from './boardconfig.js'

// This file is meant to hold the creation of the grid (including initial physical rendering)

export const hexes = []; // Will fill up with {q,r} of all hexes on the board


export function cubeToPixel(q, r, isPiece) {
    const size = 30; // TODO: Pull out to reference elsewhere
    const boardMargin = 10; // Pixel margin before closest hex
    const infoMargin = 80; // Height of info at the top
    let x = size * (Math.sqrt(3) * q + r * (Math.sqrt(3) / 2)) + boardMargin + 50;
    let y = size * 1.5 * r + boardMargin + infoMargin - Math.floor(r/2)- Math.floor(r/7) + Math.min(1,Math.max(0,1-r)); // Monstrosity at the end to compensate for weird pixel effects
    if (isPiece) {
        x += size/6;
        y += size/4;
    };
    return { x, y };
}
  
export function createBoard(container, onClick) {
    const gridSize = boardConfig.size;
    for (let r = 0; r < gridSize; r++) {
        for (let col = 0; col < gridSize; col++) {
            if (r%2 === 0  || col != gridSize - 1) { // Making the grid pinch in every second row to add symmetry
                const q = col - ((r - (r & 1)) / 2); // axial q
        
                const div = document.createElement('div');
                div.className = 'hex';
        
                const { x, y } = cubeToPixel(q, r, false);
                div.style.left = `${x}px`;
                div.style.top = `${y}px`;
        
                div.dataset.q = q;
                div.dataset.r = r;

                if (boardConfig.debug_mode) {
                    div.innerHTML = `${q},${r}`;
                }
        
                div.onclick = () => onClick({q, r});
                container.appendChild(div);
                hexes.push({q,r});
            }
        
        }
    }

    // Shrink board to fit
    container.style.width = `${54 * (gridSize + 1.5) + 40}px`;
    container.style.height = `${54 * gridSize + 30 + 30}px`;
}
  
  