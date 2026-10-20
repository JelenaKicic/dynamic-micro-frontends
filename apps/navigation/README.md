# Navigation

Micro-frontend that renders the navigation menu from the routes data passed in by
the host application. Expected input format:

```
[
    {
        path: string,
        name: string
    },
]
```

**Stack:** Vue 3 built with Vite.

## Run

```sh
pnpm install
pnpm dev       # dev server
pnpm build     # production build
```
