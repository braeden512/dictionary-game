// this is the user room page

import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { socket } from '../components/socket';

function Room() {
    const { roomCode, userId } = useParams();

    return (
        <>
            <h1> Room {roomCode}</h1>
            <p>User ID: {userId}</p>
            <Footer />
        </>
    );
}

export default Room;
