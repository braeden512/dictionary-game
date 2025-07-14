// this is the join room page
import Base from '../components/Base';
import { useState } from 'react';
import { socket } from '../components/socket';
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
    const [roomCode, setRoomCode] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();


    const handleSubmit =  async (event: React.FormEvent) => {
        event.preventDefault();
        // if they haven't entered anything for username, they are anonymous
        const nameToUse = username || 'Anonymous';
        
        const response = await fetch('http://localhost:5000/api/validate-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomCode }),
        });

        await response.json();

        if (!response.ok) {
            return;
        }
        
        // reestablish connection if it was closed
        if (!socket.connected) {
            socket.connect();
        }

        // connect user to room socket
        socket.emit('join-room', { roomCode, username: nameToUse });
        localStorage.setItem('username', nameToUse);

        // wait for response
        socket.once('room-joined', ({ userId }) => {
            localStorage.setItem('userId', userId);
            // navigate to the room
            navigate(`/room/${roomCode}/${userId}`)
        });
    }

    return (
        <Base>
            <div className="flex flex-col items-center justify-center px-4">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 m-8 dark:text-white">Join a Room</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 text-center max-w-md w-full dark:bg-[#353738] dark:border-[#56585a]">
                
                        <p className="text-2xl text-gray-600 mb-2 dark:text-white">Enter the room code:</p>
                        <input
                            onChange={(event) => setRoomCode(event.target.value)}
                            type="text"
                            placeholder="572834"
                            maxLength={6}
                            className="w-full text-4xl font-extrabold tracking-widest text-blue-600 bg-blue-100 py-4 px-4 mb-6 rounded-xl text-center focus:outline-none focus:ring-1 focus:ring-gray-300 dark:bg-[#14181e] dark:placeholder-gray-700 dark:text-blue-800 dark:focus:ring-gray-600"
                            required
                        />
                        
                        {/* fix soon */}
                        <hr className='border-t border-gray-300 dark:border-gray-600 my-4'/>
                            
                        <p className="text-lg text-gray-600 m-2 dark:text-white">Create your username:</p>
                        <input
                            onChange={(event) => setUsername(event.target.value)}
                            type="text"
                            placeholder="Anonymous"
                            maxLength={10}
                            className="w-full text-2xl font-bold tracking-wide text-gray-600 bg-blue-100 py-2 px-4 mb-6 rounded-xl text-center focus:outline-none focus:ring-1 focus:ring-gray-300 dark:bg-[#14181e] dark:placeholder-gray-700 dark:text-gray-300 dark:focus:ring-gray-600"
                        />

                        <button
                            type='submit'
                            className="w-full bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition duration-200 dark:bg-blue-800"
                        >
                            Join Room
                        </button>
                    </div>
                </form>
            </div>
        </Base>
    );
}

export default JoinRoom;
