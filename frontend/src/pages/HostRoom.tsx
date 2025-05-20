// This is the view of the host once creating a room


import Base from '../components/Base';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';

interface User {
    id: string;
    username: string;
}

function HostRoom() {
    const [roomCode, setRoomCode] = useState("");
    const [userList, setUserList] = useState<User[]>([]);
    const [copied, setCopied] = useState(false);
    const { id } = useParams();

    // used for colored blocks of users
    const colors = [
        'bg-red-200 text-red-800',
        'bg-blue-200 text-blue-800',
        'bg-green-200 text-green-800',
        'bg-yellow-200 text-yellow-800',
        'bg-purple-200 text-purple-800',
        'bg-pink-200 text-pink-800',
        'bg-orange-200 text-orange-800',
        'bg-teal-200 text-teal-800',
    ];

    useEffect(() => {
        const fetchRoomCode = async () => {
            const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
            const data = await response.json();
            setRoomCode(data.roomCode);

            socket.on('join-error', ({ message }) => {
                console.error(message);
                alert(message);
                window.location.href = '/';
            });

            socket.emit('join-room', {
                roomCode: data.roomCode,
                username: 'Host',
                isHost: true,
            });
        };
        fetchRoomCode();

        socket.on('room-users', (users: User[]) => {
            setUserList(users);
        })

        return () => {
            socket.emit('leave-room');
            socket.off('room-users');
        };
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        // reset after 2 seconds
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <Base>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 m-8">Room Created!</h1>
                
                <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 text-center max-w-md relative">
                    <p className="text-lg text-gray-600 mb-2">Share this room code with others:</p>
                    <div className='relative'>
                        <div className="text-4xl font-extrabold tracking-widest text-blue-600 bg-blue-100 px-6 py-4 rounded-xl">
                            {roomCode}
                        </div>
                        <button
                            // call handleCopy function
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-1 text-blue-600 hover:text-blue-800 transition"
                            aria-label="Copy room code"
                        >
                            {/* when clicked, switch to check mark for 2 seconds, then go back */}
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>
                {/* Connected Users */}
                {userList.length > 0 && (
                    <div className="border border-gray-300 mt-8 bg-white shadow-lg rounded-xl p-6 max-w-3xl w-full">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center mb-5">Connected Users</h2>
                        {/* displayed in colored blocks */}
                        <div className="grid grid-cols-5 gap-2">
                            {userList.map((user, index) => {
                                const color = colors[index % colors.length];
                                return (
                                    <div key={user.id} className={`rounded-xl px-2 py-6 text-center font-semibold text-sm ${color}`}>
                                    {user.username}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Base>
    );
}

export default HostRoom;