import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { socket } from '../components/socket';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleClick = () => {
        socket.emit('create-room');
    }

    useEffect(() => {
        const handleRoomCreated = (roomId: number) => {
            navigate(`/room/${roomId}`);
        };

        socket.on('room-created', handleRoomCreated);

        return () => {
            socket.off('room-created', handleRoomCreated);
        };

    }, [navigate]);

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center">
                <div className="bg-gray-100 rounded-2xl shadow-md p-8 w-full max-w-xl text-center">
                <h1 className="text-2xl font-semibold mb-6">Home Page</h1>
                <button className="bg-gray-900 text-white px-5 py-2 rounded-xl shadow-sm hover:bg-gray-800 transition duration-200" onClick={handleClick} >
                    Create Room
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;
