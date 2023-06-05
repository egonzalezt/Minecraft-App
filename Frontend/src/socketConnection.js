import socketIOClient from 'socket.io-client';

const baseUrl = "http://localhost:8000/"
const socketInstance = socketIOClient(baseUrl, {
    extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
});

export default socketInstance