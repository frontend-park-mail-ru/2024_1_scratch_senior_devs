const socket = new WebSocket('ws://localhost:3001');

socket.addEventListener('message', (event) => {
    if (event.data === 'reload') {
        console.log('Reloading scripts...');
        location.reload();
    }
});