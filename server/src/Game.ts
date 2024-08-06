import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

type M = {
    from: string;
    to: string;
};

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private moves: string[];
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                player: "1",
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                player: "2",
                color: "black"
            }
        }))
    }
    
    makeMove(socket: WebSocket, move: M) {
        console.log('move maked', move, this.board.history().length);
        let a = this.moveCount % 2 === 0 && socket !== this.player1; // Actually Player 1 Turn
        let b = this.moveCount % 2 === 1 && socket !== this.player2; // Actually Player 2 Turn
        if(a || b){
            return;
        }
        
        try{
            this.board.move(move);
        }catch(err){
            console.log(err);
            return;
        }

        
        if(this.board.isGameOver()){    // Returns true if the game has ended via checkmate, stalemate, draw, threefold repetition, or insufficient material. Otherwise, returns false.
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            this.player2.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
        }

        
        console.log('move valid');

        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        this.moveCount++;
    }
}