# announcements-react

React micro-frontend showing faculty announcements (огласна плоча).

Pulls the same data as the Angular `announcements` app and the other apps from
`https://efee.etf.unibl.org:8443/api/public/oglasne-ploce/{boardId}`.

Built on the same stack and mount pattern as the `class-schedule` app:
Redux Toolkit Query for data fetching, MUI for the UI, and a
`micro-announcements-react` web component with a
`window["micro-announcements-react_mount"]` entry point
(Emotion `CacheProvider` + MUI `ThemeProvider` scoped to the mount container).

## Run

```bash
npm install   # or pnpm install
npm start     # react-scripts dev server
npm run build
```
