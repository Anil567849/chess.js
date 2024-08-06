import React, { useEffect, useState } from 'react'
import { Color, PieceSymbol, Square } from 'chess.js';
type b = ({
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null)[][];
type O = {
    from: string | null;
    to: string | null;
}

function ChessBoard({board, socket, chess, setBoard} : {board: b, socket: WebSocket, chess: any, setBoard: any}) {
    const [move, setMove] = useState<O>({
        from: null,
        to: null,
    })

    useEffect(() => {
        if(move.to){            
            socket.send(JSON.stringify({
                type: "move",
                payload: move,
            }))
            try {
                chess.move(move)
                setBoard(chess.board());
            } catch (error) {
                console.log(error);
            }
        }
    }, [move])

    function handleMove(i: number, j: number){
        let row = String.fromCharCode((j%8) + 97);
        let col = (7-i)+1;
        let sq = (row + col.toString()).toString();
        if(!move.from){
            setMove({...move, from: sq});
        }else{
            setMove({...move, to: sq});
            setTimeout(() => {
                setMove({
                    from: null,
                    to: null,
                })   
            }, 1000)
        }
    }

  return (
    <div>
        {
            board.map((row, i) => {
                return <div className="flex" key={i}>
                    {
                        row.map((cell, j) => {
                            return <div key={j} onClick={() => handleMove(i, j)} className={`cursor-pointer w-16 h-16 ${ ((i+j)%2 == 0) ? 'bg-white' : 'bg-black'}`}>     
                            <div className="flex justify-center items-center w-full h-full">
                                {cell ? <img src={`/${cell?.color}${cell?.type}.png`} alt="" /> : null }
                            </div>
                            </div>
                        })
                    }
                </div>
            })
        }
    </div>
  )
}

export default ChessBoard