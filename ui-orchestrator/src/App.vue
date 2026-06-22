<script setup>
import {RouterView} from 'vue-router'
import {onMounted, ref, watch} from "vue";
import {initiateAndObserveMicroApp} from "@/router/WebComponent.js";
import router, {routesUpdated, sidebar} from "@/router/index.js";

const routes = ref([])
const sidebarOpen = ref(true)

const buildRoutes = () => {
    routes.value = router.getRoutes().map((route) => ({
        path: route.path,
        name: route.name,
    }));
};

const initializeSidebar = async () => {
    if (!sidebar.value.root) return;

    for (const app of sidebar.value.apps) {
        await initiateAndObserveMicroApp({parentSelector: 'div[id="apps"]'}, app);
    }

    await initiateAndObserveMicroApp({
        parentSelector: 'div[id="navigation"]',
        props: {routes: routes.value}
    }, sidebar.value.root);
};

const refreshSidebar = async () => {
    buildRoutes();
    await initializeSidebar();
};

onMounted(refreshSidebar);
watch(sidebar, refreshSidebar, {deep: true});
watch(routesUpdated, refreshSidebar);

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
