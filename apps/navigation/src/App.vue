<script setup>
import {inject, onMounted, ref} from 'vue'

const routes = ref([])

onMounted(() => {
    const childElements = inject("childElements");
    const childrenContainer = inject("appContext").getElementById("children");
    if(childrenContainer) {
        for (let i = 0; i < childElements.length; i++) {
            childrenContainer.innerHTML = "";
            childrenContainer.append(childElements[i]);
        }
    }

    const props = inject("props");
    routes.value = props.routes;

})
</script>

<template>
  <main>
    <nav id="navigation">
        <a class="routerLink" v-for="route in routes" :href="route.path" :key="route.path">{{route.name}}</a>
    </nav>
    <div id="children"></div>
  </main>
</template>

<style scoped>
#navigation {
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.routerLink {
    text-decoration: none;
    color: #475569;
    font-size: 16px;
    font-weight: 500;
    padding: 14px 24px;
    border-left: 3px solid transparent;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.routerLink:hover {
    background-color: #f0fdfa;
    color: #0f766e;
}

.routerLink:local-link {
    font-weight: 600;
    color: #0f766e;
    background-color: #f0fdfa;
    border-left-color: #0f766e;
}

</style>
