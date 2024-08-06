import React, { useEffect, useState } from 'react'
import ChessBoard from '../components/ChessBoard'
import useSocket from '../hooks/useSocket'
import { Chess } from 'chess.js';


const INIT_GAME = 'init_game';
const MOVE = 'move';
const GAME_OVER = 'game_over';

function Game() {

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if(!socket) return;
        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            switch(msg.type){
                case INIT_GAME:
                    console.log("game init");
                    // setChess(new Chess());
                    setBoard(chess.board());
                    break;
                case MOVE:                    
                    const move = msg.payload;
                    console.log("move done", move)
                    try {
                        chess.move(move)
                        setBoard(chess.board());
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                default:
                    console.log("game over");
                    break;
            }
        }
    }, [socket])
    
    
    if(!socket) return <>Connecting...</>

    function handleClick(){
        console.log('clicked')
        socket?.send(JSON.stringify({
            type: INIT_GAME,
        }))
    }
  return (
    <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg w-full bg-red-500">
            <div className="grid grid-cols-6 gap-4 md:grid-cols-8">
                <div className='col-span-4 w-full'>
                    <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board}/>
                </div>
                <div className='col-span-2 w-full'>
                    <button className="bg-red-200" onClick={() => handleClick()}>Play</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Game