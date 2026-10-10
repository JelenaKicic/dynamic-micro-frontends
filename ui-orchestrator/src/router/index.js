import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import {initiateAndObserveMicroApp} from "@/router/WebComponent.js";
import {openCoreStream, onAppChange, postVisit} from "@/stream/coreStream.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
});

// Exposed so micro-apps can navigate via router.push without a full reload.
window.__hostRouter = router;

router.afterEach((to) => {
  if (to.matched.length > 0) {
    postVisit(to.path);
  }
});

// Bumped by the stream when a route is added/removed so the nav can refresh.
export const routesUpdated = ref(0);

const SIDEBAR_LINK = "**";

export const sidebar = ref({ root: null, apps: [] });

const linkToId = (link) =>
  link === "/" ? "home" : link.replace(/^\//, "").replaceAll("/", "-");

const updateSidebar = (route) => {
  const apps = route.apps || [];
  sidebar.value = {
    root: apps.find((app) => app.position === "navigation") || null,
    apps: apps.filter((app) => app.position === "sidebar"),
  };
};

export const loadRoutes = async () => {
  await new Promise((resolve) => {
    openCoreStream({
      onSnapshot: (snapshot) => {
        snapshot.routes.forEach((streamRoute) => {
          if (streamRoute.link === SIDEBAR_LINK) {
            updateSidebar(streamRoute);
          } else {
            addNewRoute({
              id: linkToId(streamRoute.link),
              path: streamRoute.link,
              apps: streamRoute.apps,
              routeName: streamRoute.name,
            });
          }
        });
        resolve();
      },
      onChange: (change) => {
        const streamRoute = change.route;

        if (streamRoute.link === SIDEBAR_LINK) {
          if (change.type === "removed") {
            sidebar.value = { root: null, apps: [] };
          } else {
            updateSidebar(streamRoute);
          }
          return;
        }

        if (change.type === "removed" || change.type === "modified") {
          router.removeRoute(streamRoute.name);
          routesUpdated.value++;
        }

        if (
          change.type === "removed" &&
          router.currentRoute.value.path === streamRoute.link
        ) {
          router.back();
        }

        if (
          !router.hasRoute(streamRoute.name) && 
          (change.type === "added" || change.type === "modified")
        ) {
          addNewRoute({
            id: linkToId(streamRoute.link),
            path: streamRoute.link,
            apps: streamRoute.apps,
            routeName: streamRoute.name,
          });
          routesUpdated.value++;

          router.replace(router.currentRoute.value.fullPath);
        }
      }
    });
  });
};

const addNewRoute = (route) => {
  const newComponent = {
    template: `<div id="${route.id}"></div>`,
    created() {
      this.$watch(
          () => this.$route.params,
          async () => {
            await this.fetchApps(this.$route.meta)
          },
          { immediate: true }
      )

    },
    methods: {
      async fetchApps(routeMetaFields) {
        await this.$nextTick();
        for (const app of routeMetaFields.apps) {
          await initiateAndObserveMicroApp({ parentSelector: `div[id="${routeMetaFields.routeId}"]` }, app);
        }
      },
    },
  };

  router.addRoute({path: route.path, component: newComponent, name: route.routeName, meta: {routeId: route.id, apps: route.apps}});
}

// The web component swaps its own resources live; here we only keep the route's
// stored apps current so a route that isn't mounted right now still mounts with
// the new resources next time it is visited.
onAppChange((change) => {
  if (change.route.link === SIDEBAR_LINK) {
    updateSidebar(change.route);
    return;
  }

  const record = router.getRoutes().find((route) => route.name === change.route.name);
  if (record) {
    record.meta.apps = change.route.apps;
  }
});

export default router;
