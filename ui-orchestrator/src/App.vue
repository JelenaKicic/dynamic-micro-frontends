<script setup>
import {RouterView, useRouter} from 'vue-router'
import {onMounted, ref} from "vue";
import {onSnapshot, doc} from "firebase/firestore";
import db from "@/firebase/init.js";
import {initiateAndObserveMicroApp} from "@/router/WebComponent.js";
import {routesUpdated} from "@/router/index.js";

const router = useRouter();
const routes = ref([])
const sidebarData = ref({})

const sidebarOpen = ref(true)

let oldSidebarData = null;
let oldRoutesVersion = routesUpdated.value;

router.afterEach(() => {
    routes.value = [];
    router.getRoutes().forEach((route) => {
        routes.value.push({
            path: route.path,
            name: route.name
        })
    });

    // Re-mount only when the config or the route set changed; plain navigation
    // changes neither, so we skip it and avoid flashing the nav app.
    if (sidebarData.value === oldSidebarData && routesUpdated.value === oldRoutesVersion) return;
    oldRoutesVersion = routesUpdated.value;

    if(sidebarData.value)
        initializeSidebar();
})

onMounted(async () => {
    const docReference = doc(db, "route-apps", "all");

    onSnapshot(docReference, async (doc) => {
        sidebarData.value = doc.data();

        await initializeSidebar();
    });
});

const initializeSidebar = async () => {
    if(sidebarData.value?.root) {
        // Baseline so the first afterEach doesn't re-mount.
        oldSidebarData = sidebarData.value;
        oldRoutesVersion = routesUpdated.value;

        for (let i = 0; i < sidebarData.value.apps?.length; i++) {
            await initiateAndObserveMicroApp(sidebarData.value.apps[i], {parentSelector: 'div[id="apps"]'});
        }

        await initiateAndObserveMicroApp(sidebarData.value.root, {
            parentSelector: 'div[id="navigation"]',
            props: {routes: routes.value}
        });
    }
}

</script>

<template>

  <div v-if="sidebarOpen" id="sidebar">
      <div id="navigation"></div>
      <div id="apps"></div>
  </div>
  <div v-else id="sidebarButton">
      else
  </div>
  <div id="pageContent">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<style scoped>
#sidebar {
  height: 100vh;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  background-color: #f5f7f7;
  border-right: 1px solid #e2e8f0;
  position: fixed;
}

#pageContent {
    width: 100%;
    margin-left: 400px;
}

</style>
