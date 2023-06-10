import socketIOClient from 'socket.io-client';

const baseUrl = "/"
const socketInstance = socketIOClient(baseUrl, {
    extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
});

export default socketInstance