// This is the view of the host once creating a room


import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { socket } from '../components/socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function HostRoom() {
    const [roomCode, setRoomCode] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const fetchRoomCode = async () => {
            const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
            const data = await response.json();
            setRoomCode(data.roomCode);
        };
        fetchRoomCode();
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
            </div>
            <Footer />
        </>
    );
}

export default HostRoom;