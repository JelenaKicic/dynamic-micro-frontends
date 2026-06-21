# announcements-vue

Vue micro-frontend showing faculty announcements (огласна плоча).

Pulls the same data as the Angular `announcements` app and the other apps from
`https://efee.etf.unibl.org:8443/api/public/oglasne-ploce/{boardId}`.

Uses the same micro-frontend mount pattern as the `navigation` app:
a `micro-announcements-vue` web component with a `window["micro-announcements-vue_mount"]`
entry point (provide/inject for `childElements`, `props`, `appContext`).

## Run

```bash
npm install   # or pnpm install
npm run dev   # vite dev server
npm run build
```
