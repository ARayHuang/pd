import socketIO from 'socket.io-client';

const disconnectSocketIO = () => socketIO.close();

export default disconnectSocketIO;
