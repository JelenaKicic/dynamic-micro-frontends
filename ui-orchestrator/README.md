# UI Orchestrator
The UI Orchestrator is a core component of the system, designed to dynamically configure itself based on data from a Firestore database. At compile-time, the application is not aware of the number of routes it will manage or which applications it will load. Key features of the UI Orchestrator include:

Dynamic Configuration: Subscribes to Firestore to read and configure routes and applications in real-time.
Micro-Application Management: Loads specific micro-applications into a sidebar that remains consistent across all routes.
Template Management: Uses predefined templates for creating new routes.
Web Component Framework: Provides a framework for creating and defining web components, including methods for loading external applications within these components.
Data-Driven Presentation: Relies on a data repository to ensure the application is both valid and functional.
The UI Orchestrator is built using the Vue framework, which is ideal for this project due to its capability to add routes at runtime and provide dynamically built templates to these routes.

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```
