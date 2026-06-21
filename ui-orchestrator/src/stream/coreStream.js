const CORE_REGISTRY_URL = "http://localhost:8000";

// withCredentials sends the ab_id cookie so the A/B assignment stays sticky.
export function openCoreStream() {
  const source = new EventSource(`${CORE_REGISTRY_URL}/stream`, {
    withCredentials: true,
  });

  source.addEventListener("open", () => {
    console.log("[core-stream] connected");
  });

  source.addEventListener("snapshot", (event) => {
    const data = JSON.parse(event.data);
    console.log("[core-stream] snapshot received:", data);
    data.routes?.forEach((route) => {
      console.log(
        `[core-stream] route "${route.name}" (${route.link}) -> apps:`,
        route.apps,
      );
    });
  });

  source.addEventListener("error", (error) => {
    console.warn("[core-stream] connection error / reconnecting", error);
  });

  return source;
}
