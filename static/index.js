const app = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  vuetify: new Vuetify({theme: {light: true}}),
  data: {
    rooms: [],
    messages: [],
    chosenRoom: null,
    socket: null
  },
  methods: {
    loadRooms () {
      fetch('/api/rooms').
      then(response => response.json()).
      then(data => {
        this.rooms = data
        this.chosenRoom = data[0]
        this.joinRoom(this.chosenRoom)
        })
    },
    joinRoom (room) {
      this.socket.emit('join', this.chosenRoom, messages => {
        for (const message of messages) {
          console.log(message)
          this.messages.push(message)
        }
      })
    },
    leaveRoom (room) {
      this.socket.emit('leave', this.chosenRoom)
    },
    buttonColor (room) {
      return room === this.chosenRoom ? 'primary' : 'success'
    },
    onRoomButtonClick (room) {
      if (room !== this.chosenRoom) {
        this.messages.splice(0, this.messages.length)
        this.leaveRoom(this.chosenRoom)
        this.chosenRoom = room
        this.joinRoom(this.chosenRoom)
      }
    }
  },
  created() {
    this.socket = io('/some_namespace');
    this.socket.on('some_event', (data) => {
      console.log('Received message:', data);
      this.messages.push(data)
    })
    this.loadRooms()
  }
})