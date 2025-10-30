const WebSocket = require('ws');

const url = 'ws://localhost:8080/ws';
const ws = new WebSocket(url);

ws.on('open', () => {
  console.log('Connected to server!');
});

ws.on('close', () => {
  console.log('Disconnected from server');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});
