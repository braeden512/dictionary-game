import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { socket } from '../components/socket';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const createRoom = () => {
        socket.emit('create-room');
    }

    const joinRoom = () => {
        navigate('/join_room');
    }

    useEffect(() => {
        const handleRoomCreated = (roomId: number) => {
            navigate(`/create_room/${roomId}`);
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
                <div className="bg-gray-200 rounded-2xl shadow-md p-4 m-8 max-w-xl text-center">
                    <button
                        className="bg-gray-600 text-white px-5 py-2 rounded-xl shadow-sm hover:bg-gray-700 transition duration-200" onClick={createRoom} >
                        Create Room
                    </button>
                    <h1 className='text-2xl font-extrabold tracking-wider text-gray-600 px-6 py-1 rounded-xl'>OR</h1>
                    <button
                        className="bg-blue-400 text-white px-7 py-2 rounded-xl shadow-sm hover:bg-blue-500 transition duration-200"
                        onClick={joinRoom}>
                        
                        Join Room
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Home;