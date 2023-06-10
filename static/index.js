console.log('HELL WORLD!')
const socket = io('/some_namespace');

socket.emit(
    'join',
    'room 1',
    messages => {
      for (const message of messages) {console.log(message)}
    }
)

socket.on('some_event', (data) => {
  console.log('Received message:', data);
})