"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                player: "1",
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                player: "2",
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        console.log('move maked', move, this.board.history().length);
        let a = this.moveCount % 2 === 0 && socket !== this.player1; // Actually Player 1 Turn
        let b = this.moveCount % 2 === 1 && socket !== this.player2; // Actually Player 2 Turn
        if (a || b) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (err) {
            console.log(err);
            return;
        }
        if (this.board.isGameOver()) { // Returns true if the game has ended via checkmate, stalemate, draw, threefold repetition, or insufficient material. Otherwise, returns false.
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
        }
        console.log('move valid');
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
