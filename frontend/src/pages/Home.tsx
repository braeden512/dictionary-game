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
        // ensure the socket reconnects after host disconnects from prior room
        if (!socket.connected) {
            socket.connect();
        }

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
            <div className="flex flex-col sm:flex-row w-full flex-grow">
                <button
                className="group flex-1 flex-grow bg-gray-700 text-white text-4xl sm:text-6xl font-semibold flex flex-col items-center justify-center hover:bg-gray-600 transition duration-200 dark:bg-[#18191a] dark:hover:bg-[#28292a] px-4 text-center"
                onClick={createRoom}
                >
                <div>
                    Create Room
                    <p className="text-base sm:text-xl font-normal mt-2 text-white/80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                        Create a room and invite your friends.
                    </p>
                </div>
                </button>

                <button
                className="group flex-1 flex-grow bg-blue-700 text-white text-4xl sm:text-6xl font-semibold flex flex-col items-center justify-center hover:bg-blue-800 transition duration-200 dark:bg-blue-800 dark:hover:bg-blue-900 px-4 text-center"
                onClick={joinRoom}
                >
                <div>
                    Join Room
                    <p className="text-base sm:text-xl font-normal mt-2 text-white/80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                        Enter a room code and join a game.
                    </p>
                </div>
                </button>
            </div>
        </Base>

    );
}

export default Home;