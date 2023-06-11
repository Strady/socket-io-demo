import datetime
import random
import threading
import time
import pydantic
from typing import Optional
from faker import Faker
from flask_socketio import SocketIO


class LogEntry(pydantic.BaseModel):
    time: str
    source: str
    level: str
    message: str


LEVELS = ['INFO'] * 5 + ['SUCCESS', 'WARNING', 'FAILURE']


class Emitter(threading.Thread):

    def __init__(self, name: str, socket: SocketIO, namespace: str, room: str):
        super().__init__()
        self._name = name
        self._socket = socket
        self._namespace = namespace
        self._room = room
        self._messages: list[LogEntry] = []

    @property
    def messages(self) -> list:
        return [msg.dict() for msg in self._messages]

    def run(self) -> None:
        fake = Faker()
        counter = 0
        while True:
            self._messages.append(
                LogEntry(
                    time=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    source=self._name,
                    level=random.choice(LEVELS),
                    message=fake.paragraph(nb_sentences=random.randint(1, 10))
                )
            )
            self._socket.emit(
                event='some_event',
                data=self._messages[-1].dict(),
                namespace=self._namespace,
                room=self._room
            )
            counter += 1
            time.sleep(1)


class EmittersManager:

    def __init__(self):
        self._emitters: dict[str, Emitter] = {}

    def start_emitters(self, socket: SocketIO, namespace: str, rooms: list[str]) -> None:
        for room in rooms:
            self._emitters[room] = Emitter(
                name=f'{room}-emitter',
                namespace=namespace,
                socket=socket,
                room=room
            )
            self._emitters[room].start()

    def get_emitter(self, room: str) -> Optional[Emitter]:
        return self._emitters.get(room)


emitters_manager = EmittersManager()
