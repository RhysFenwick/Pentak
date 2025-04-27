import { getAllMoves } from "./interact.js";
import { tryMove } from "./gameLogic.js";
import { getPiece } from "./helpers.js";

// This file contains the AIs that can play the game via interact.js
// They're each a function that takes a player string and returns a move of form from{q,r}, to{q,r}
// Which one to go with is decided by the switch case; each is correlated with a string passed to that
// They each take the state and use that to derive their next move from getAllMoves()
// The main way I anticipate them varying is via how they rank the moves

// The general-purpose interface - returns a move given a mode
export function makeAIMove(mode="random",player="P2") {
    let move; // Currently null

    switch (mode) {
        case "warden":
            break;

        default:
            move = opportunistMove(player);
    }

    setTimeout(() => { // Delay makes the animations work better
        tryMove(move.from,move.to);
    },300);
}

////////////////
// Modes!
////////////////

// P2 makes random walks
export function randomMove(player="P2") {
    const moves = getAllMoves(player);
    const rando = moves[Math.floor(Math.random() * moves.length)]; // Gets a random move
    return rando;
}

// P2 takes piece if it can, otherwise random
export function opportunistMove(player="P2") {
    const moves = getAllMoves(player);
    const rival = (player == "P2") ? "P1" : "P2";
    for (const move of moves) {
        if (getPiece(move.to) && getPiece(move.to).owner == rival) { // Owned by the other team!
            return move;
        }
    }
    return moves[Math.floor(Math.random() * moves.length)]; // If all else fails, go random

}

