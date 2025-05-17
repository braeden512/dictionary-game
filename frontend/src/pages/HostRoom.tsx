// This is the view of the host once creating a room


import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface User {
    id: string;
    username: string;
}

function HostRoom() {
    const [roomCode, setRoomCode] = useState("");
    const [userList, setUserList] = useState<User[]>([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchRoomCode = async () => {
            const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
            const data = await response.json();
            setRoomCode(data.roomCode);

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
            socket.off('room-users');
        };
    }, [id]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 m-8">Room Created!</h1>
                
                <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 text-center max-w-md">
                    <p className="text-lg text-gray-600 mb-2">Share this room code with others:</p>
                    <div className="text-4xl font-extrabold tracking-widest text-blue-600 bg-blue-100 px-6 py-4 rounded-xl">
                        {roomCode}
                    </div>
                </div>
                {/* Connected Users */}
                {userList.length > 0 && (
                    <div className="mt-8 bg-white shadow-md rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Connected Users</h2>
                        <ul className="text-gray-600 space-y-1">
                            {userList.map(user => (
                                <li key={user.id}>• {user.username}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default HostRoom;