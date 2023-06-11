from flask_socketio import SocketIO, Namespace, join_room, leave_room

from emitters import emitters_manager

socketio = SocketIO()


class SomeNamespace(Namespace):

    @staticmethod
    def on_join(room):
        print(f'joining to {room}')
        join_room(room)
        return emitters_manager.get_emitter(room).messages

    @staticmethod
    def on_leave(room):
        print(f'leaving {room}')
        leave_room(room)




