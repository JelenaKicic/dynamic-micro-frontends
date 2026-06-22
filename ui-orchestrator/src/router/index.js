import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import {initiateAndObserveMicroApp} from "@/router/WebComponent.js";
import {openCoreStream} from "@/stream/coreStream.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
});

// Exposed the router for the child apps
window.__hostRouter = router;

// Used for nav refresh when routes are updated
export const routesUpdated = ref(0);

const SIDEBAR_LINK = "**";

export const sidebar = ref({ root: null, apps: [] });

const routeRegistry = new Map();

const linkToId = (link) =>
  link === "/" ? "home" : link.replace(/^\//, "").replaceAll("/", "-");

const updateSidebar = (route) => {
  const apps = route.apps || [];
  sidebar.value = {
    root: apps.find((app) => app.position === "navigation") || null,
    apps: apps.filter((app) => app.position === "sidebar"),
  };
};

const registerRoute = (route) => {
  if (route.link === SIDEBAR_LINK) {
    updateSidebar(route);
    return;
  }
  addNewRoute({
    id: linkToId(route.link),
    path: route.link,
    apps: route.apps,
    routeName: route.name,
  });
  routeRegistry.set(route.id, { name: route.name, path: route.link });
};

const unregisterRoute = (routeId) => {
  const existing = routeRegistry.get(routeId);
  if (existing && router.hasRoute(existing.name)) {
    router.removeRoute(existing.name);
  }
  routeRegistry.delete(routeId);
};

const applyChange = (change) => {
  const route = change.route;
  if (route.link === SIDEBAR_LINK) {
    if (change.type === "removed") {
      sidebar.value = { root: null, apps: [] };
    } else {
      updateSidebar(route);
    }
    return;
  }

  if (change.type === "removed") {
    const removedPath = routeRegistry.get(route.id)?.path;
    unregisterRoute(route.id);
    routesUpdated.value++;
    if (router.currentRoute.value.path === removedPath) {
      router.back();
    } else {
      router.replace(router.currentRoute.value.fullPath);
    }
    return;
  }

  if (change.type === "added") {
    registerRoute(route);
    routesUpdated.value++;
    router.replace(router.currentRoute.value.fullPath);
    return;
  }

  const previousPath = routeRegistry.get(route.id)?.path;
  const structural = change.changed?.some((field) => field === "link" || field === "name");
  unregisterRoute(route.id);
  registerRoute(route);

  if (structural) {
    routesUpdated.value++;
    if (previousPath && router.currentRoute.value.path === previousPath) {
      router.replace(route.link);
    } else {
      router.replace(router.currentRoute.value.fullPath);
    }
  } else if (router.currentRoute.value.path === route.link) {
    const parentSelector = `div[id="${linkToId(route.link)}"]`;
    for (const app of route.apps) {
      initiateAndObserveMicroApp(app.name, { parentSelector }, app);
    }
  }
};

export const loadRoutes = async () => {
  await new Promise((resolve) => {
    openCoreStream({
      onSnapshot: (snapshot) => {
        snapshot.routes.forEach(registerRoute);
        resolve();
      },
      onChange: applyChange,
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
        // Wait for this route's container div to be in the DOM before rendering
        await this.$nextTick();
        for (const app of routeMetaFields.apps) {
          await initiateAndObserveMicroApp(app.name, { parentSelector: `div[id="${routeMetaFields.routeId}"]` }, app);
        }
      },
    },
  };

  router.addRoute({path: route.path, component: newComponent, name: route.routeName, meta: {routeId: route.id, apps: route.apps}});
}

await loadRoutes();

export default router;
