import asyncio


class Broker:
    def __init__(self):
        self._subscribers: set[asyncio.Queue] = set()
        self._loop = None
        self._snapshot_builder = None

    def bind_loop(self, loop):
        self._loop = loop

    def set_snapshot_builder(self, builder):
        self._snapshot_builder = builder

    def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self._subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        self._subscribers.discard(queue)

    def publish(self):
        if self._loop is None or self._snapshot_builder is None:
            return
       
        snapshot = self._snapshot_builder()
        for queue in list(self._subscribers):
            self._loop.call_soon_threadsafe(queue.put_nowait, snapshot)


broker = Broker()
