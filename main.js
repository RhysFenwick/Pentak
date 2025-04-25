import { createBoard } from './grid.js';
import { initPieces, handleClick } from './gameLogic.js';
import { render } from './ui.js';


// Core file that kicks everything off

function setup() {
    createBoard(document.getElementById('board'), handleClick);
    initPieces();
    render();
}

setup();
