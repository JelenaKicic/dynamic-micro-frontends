import asyncio


class Broker:
    def __init__(self):
        self._subscribers: set[asyncio.Queue] = set()
        self._loop = None

    def bind_loop(self, loop):
        self._loop = loop

    def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self._subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        self._subscribers.discard(queue)

    def publish(self):
        if self._loop is None:
            return
        for queue in list(self._subscribers):
            self._loop.call_soon_threadsafe(queue.put_nowait, None)


broker = Broker()
