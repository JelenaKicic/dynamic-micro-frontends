import { createRouter, createWebHistory } from 'vue-router'
import {collection, doc, getDoc, getDocs, onSnapshot} from "firebase/firestore";
import db from "@/firebase/init.js";
import createWebComponent, {initiateAndObserveMicroApp} from "@/router/WebComponent.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
});

export const loadRoutes = async () => {
  const collectionRef = collection(db, "route-apps");

  const querySnapshot = await getDocs(collectionRef);
  querySnapshot.forEach((doc) => {
    if(doc.id !== "all") {
      const route = {
        id: doc.id,
        path: `/${doc.id}`,
        apps: doc.data().apps,
        routeName: doc.data().linkName
      }

      if (doc.data().isHome) {
        route.path = "/";
      }
      addNewRoute(route);
    }
  });


  onSnapshot(collectionRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if(change.doc.id !== "all") {
        if (change.type === "removed" || change.type === "modified") {
          router.removeRoute(change.doc.data().linkName)
        }

        if (change.type === "removed") {
          if (router.currentRoute.value.path !== `/${change.doc.id}`) {
            router.replace(router.currentRoute.value.fullPath);
          } else {
            router.back()
          }
        }

        if (!router.hasRoute(change.doc.data().linkName) && (change.type === "added" || change.type === "modified")) {
          const route = {
            id: change.doc.id,
            path: `/${change.doc.id}`,
            apps: change.doc.data().apps,
            routeName: change.doc.data().linkName
          }

          if (change.doc.data().isHome) {
            route.path = "/";
          }
          addNewRoute(route);

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
        for (const app of routeMetaFields.apps) {
          await initiateAndObserveMicroApp(app, { parentSelector: `div[id="${routeMetaFields.routeId}"]` });
        }
      },
    },
  };

  router.addRoute({path: route.path, component: newComponent, name: route.routeName, meta: {routeId: route.id, apps: route.apps}});
}

await loadRoutes();

export default router;
