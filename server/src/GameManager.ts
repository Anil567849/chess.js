
import {WebSocket} from 'ws';
import { INIT_GAME, MOVE } from './messages';
import { Game } from './Game';

export class GameManager{

    private game: Game[]; // list of the games
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor(){
        this.game = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket){
        console.log("user came");
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket);
        // stop the game 
    }

    private addHandler(socket: WebSocket){

        //when user send message then it will run
        socket.on('message', (data) => { // data if type Buffer
            const msg = JSON.parse(data.toString());
            if(msg.type === INIT_GAME){
                if(this.pendingUser){
                    //start a game
                    console.log("found", msg);
                    const game = new Game(this.pendingUser, socket);
                    this.game.push(game);
                    this.pendingUser = null;
                }else{
                    //put on waiting list
                    console.log("not found", msg);
                    this.pendingUser = socket;
                }
            }else if(msg.type == MOVE){
                const game = this.game.find(game => game.player1 == socket || game.player2 == socket);
                if(game){
                    console.log("msg", msg)
                    game.makeMove(socket, msg.payload);
                }
            }
        })

    }

}