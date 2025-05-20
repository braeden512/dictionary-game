// this is the user room page

import Base from '../components/Base';
import { useParams } from 'react-router-dom';
import { socket } from '../components/socket';
import { useEffect } from 'react';

function Room() {
    const { roomCode, userId } = useParams();

    useEffect(() => {
        return () => {
            socket.emit('leave-room');
        }
    })

    return (
        <Base>
            <h1> Room {roomCode}</h1>
            <p>User ID: {userId}</p>
        </Base>
    );
}

export default Room;
