import socketIO from 'socket.io-client';
import config from '../config';

const createSocketIO = () => socketIO.connect(config.SOCKET_URL);

export default createSocketIO;
