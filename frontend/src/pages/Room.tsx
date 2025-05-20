// this is the user room page

import Base from '../components/Base';
import { useParams } from 'react-router-dom';
import { socket } from '../components/socket';
import { useEffect } from 'react';

function Room() {
    const { roomCode, userId } = useParams();

    useEffect(() => {

        const username = localStorage.getItem('username');
        
        const joinRoom = () => {
            if (roomCode && username) {
                socket.emit('join-room', {
                    roomCode,
                    username,
                });
                console.log('[socket] Rejoined room:', roomCode);
            }
        };

        socket.on('connect', () => {
            console.log('[socket] Connected:', socket.id);
            joinRoom();
        });

        socket.on('join-error', ({ message }) => {
            console.error(message);
            alert(message);
            window.location.href = '/';
        });

        return () => {
            socket.emit('leave-room');
            socket.off('connect');
            socket.off('join-error');
        }
    }, [roomCode])

    return (
        <Base>
            <h1> Room {roomCode}</h1>
            <p>User ID: {userId}</p>
        </Base>
    );
}

export default Room;
