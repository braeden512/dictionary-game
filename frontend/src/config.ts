const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const socketUrl = process.env.REACT_APP_SOCKET_URL || backendUrl;

export { backendUrl, socketUrl };