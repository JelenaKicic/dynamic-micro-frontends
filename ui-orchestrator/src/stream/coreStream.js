const CORE_REGISTRY_URL = "http://localhost:8000";

export function postVisit(link) {
  fetch(`${CORE_REGISTRY_URL}/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ link }),
  }).catch((error) => console.warn("[core-stream] visit post failed", error));
}

// Lets a micro-app observe stream changes on its own, the way each app had its
// own onSnapshot in the firestore version.
const appChangeListeners = new Set();

export function onAppChange(listener) {
  appChangeListeners.add(listener);
  return () => appChangeListeners.delete(listener);
}

// withCredentials sends the ab_id cookie
export function openCoreStream({ onSnapshot, onChange } = {}) {
  const source = new EventSource(`${CORE_REGISTRY_URL}/stream`, {
    withCredentials: true,
  });

  source.addEventListener("snapshot", (event) => {
    const snapshot = JSON.parse(event.data);
    console.log("[core-stream] snapshot received:", snapshot);
    onSnapshot?.(snapshot);
  });

  source.addEventListener("change", (event) => {
    const change = JSON.parse(event.data);
    console.log("[core-stream] change received:", change);

    if (change.type === "app_modified") {
      appChangeListeners.forEach((listener) => listener(change));
      return;
    }

    onChange?.(change);
  });

  source.addEventListener("error", (error) => {
    console.warn("[core-stream] connection error / reconnecting", error);
  });

  return source;
}
