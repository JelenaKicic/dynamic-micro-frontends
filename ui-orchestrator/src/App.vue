<script setup>
import {RouterView, useRouter} from 'vue-router'
import {onMounted, ref} from "vue";
import {onSnapshot, doc} from "firebase/firestore";
import db from "@/firebase/init.js";
import {initiateAndObserveMicroApp} from "@/router/WebComponent.js";

const router = useRouter();
const routes = ref([])
const sidebarData = ref({})

const sidebarOpen = ref(true)

router.afterEach(() => {
    routes.value = [];
    router.getRoutes().forEach((route) => {
        routes.value.push({
            path: route.path,
            name: route.name
        })
    });

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
    if(sidebarData) {
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
  background-color: aliceblue;
  position: fixed;
}

#pageContent {
    width: 100%;
    margin-left: 400px;
}

</style>
