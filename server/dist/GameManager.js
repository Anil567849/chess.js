"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.game = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        console.log("user came");
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        // stop the game 
    }
    addHandler(socket) {
        //when user send message then it will run
        socket.on('message', (data) => {
            const msg = JSON.parse(data.toString());
            if (msg.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    //start a game
                    console.log("found", msg);
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.game.push(game);
                    this.pendingUser = null;
                }
                else {
                    //put on waiting list
                    console.log("not found", msg);
                    this.pendingUser = socket;
                }
            }
            else if (msg.type == messages_1.MOVE) {
                const game = this.game.find(game => game.player1 == socket || game.player2 == socket);
                if (game) {
                    console.log("msg", msg);
                    game.makeMove(socket, msg.payload);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
