import socketIOClient from 'socket.io-client';

const baseUrl = "/"
const socketInstance = socketIOClient(baseUrl, {
    auth: {
        token: `Bearer ${localStorage.getItem("accessToken")}`
    },
});

export default socketInstance