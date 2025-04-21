import { createBoard, cubeToPixel, isIsland } from './grid.js';
import { state, initPieces, handleClick } from './gameLogic.js';
import { render } from './ui.js';

function setup() {
    createBoard(document.getElementById('board'), handleClick);
    initPieces();
    render();
}

setup();
