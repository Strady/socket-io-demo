const app = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  vuetify: new Vuetify({theme: {light: true}}),
  data: {
    rooms: [],
    messages: [],
    chosenRoom: null
  },
  methods: {
    loadRooms () {
      fetch('/api/rooms').
      then(response => response.json()).
      then(data => {
        this.rooms = data
        this.chosenRoom = data[0]
      })
    },
    buttonColor (room) {
      return room === this.chosenRoom ? 'primary' : 'success'
    },
    onRoomButtonClick (room) {
      this.chosenRoom = room
    }
  },
  created() {
    this.loadRooms()
    const socket = io('/some_namespace');
    socket.emit(
        'join',
        'room 1',
        messages => {
          for (const message of messages) {
            console.log(message)
            this.messages.push(message)
          }
        }
    )
    socket.on('some_event', (data) => {
      console.log('Received message:', data);
      this.messages.push(data)
    })
  }
})