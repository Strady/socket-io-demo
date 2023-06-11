const app = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  vuetify: new Vuetify({theme: {light: true}}),
  data: {
    rooms: [],
    messages: [],
    chosenRoom: null,
    socket: null,
    tableHeaders: [
        { text: 'Time', value: 'time' },
        { text: 'Source', value: 'source' },
        { text: 'Message', value: 'message' }
    ],
    itemClass: 'indigo'
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
    },
    getItemStyle(item) {
      const alpha = 0.1
      const colorsMap = {
        SUCCESS: `rgba(76, 175, 80, ${alpha})`,
        WARNING: `rgba(255, 152, 0, ${alpha})`,
        FAILURE: `rgba(244, 67, 54, ${alpha})`
      }
      return colorsMap[item.level] ? { 'background-color': colorsMap[item.level] } : {};
    }
  },
  created() {
    this.socket = io('/some_namespace');
    this.socket.on('some_event', (data) => {
      this.messages.push(data)
    })
    this.loadRooms()
  }
})