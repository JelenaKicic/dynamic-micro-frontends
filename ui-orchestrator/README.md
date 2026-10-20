# UI Orchestrator
The UI Orchestrator builds itself at runtime from configuration served by the backend. At compile-time it does not know which routes it will have or which micro-applications it will load.

It connects to the backend over a live stream (Server-Sent Events) and reacts to changes in real time:

- **Dynamic routing:** adds, updates, and removes routes on the fly as the backend stream changes.
- **Micro-application loading:** mounts micro-apps into each route as web components, and keeps a shared sidebar consistent across all routes.
- **Live updates:** picks up route and app changes immediately, without a rebuild or reload.
- **Visit tracking:** reports each visited route back to the backend.

It is built with Vue, which lets routes be added at runtime and rendered from dynamically built templates.

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```
