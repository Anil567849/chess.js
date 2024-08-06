import React from 'react'
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div>
        <div className="mt-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <img src="/board.png" alt="board" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Play Chess</h1>
                    <div className="mt-4">
                        <Link className="bg-blue-500" to={'/game'}>Play Online</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Landing