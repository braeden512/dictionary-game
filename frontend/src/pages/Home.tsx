import Base from '../components/Base';
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
        <Base>
            <div className="flex justify-center items-center">
                <div className="bg-white rounded-2xl shadow-md p-4 m-8 max-w-xl text-center dark:bg-[#353738]">
                    <div className='mb-2'>
                        <button
                            className="bg-gray-500 text-white px-5 py-2 rounded-xl shadow-sm hover:bg-gray-600 transition duration-200 dark:bg-[#18191a] dark:hover:bg-[#28292a]" onClick={createRoom} >
                            Create Room
                        </button>
                    </div>
                    <div>
                        <button
                            className="bg-blue-600 text-white px-7 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition duration-200 dark:bg-blue-800"
                            onClick={joinRoom}>
                            
                            Join Room
                        </button>
                    </div>
                </div>
            </div>
        </Base>
    );
}

export default Home;