import json

from flask import Flask, render_template, send_from_directory
from socket_io import socketio, SomeNamespace

from emitters import emitters_manager


NAMESPACE = '/some_namespace'
ROOMS = ['room 1', 'room 2', 'room 3']


app = Flask(__name__)
socketio.init_app(app)
socketio.on_namespace(SomeNamespace(NAMESPACE))


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/api/rooms')
def rooms():
    return json.dumps(ROOMS)


if __name__ == '__main__':
    emitters_manager.start_emitters(
        socket=socketio,
        namespace=NAMESPACE,
        rooms=ROOMS
    )
    app.run()
