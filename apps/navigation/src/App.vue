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
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

#navigation {
    padding-top: 40px;
    bottom: 40px;
    display: flex;
    flex-direction: column;
}

.routerLink {
    text-decoration: none;
    color: gray;
    font-size: 20px;
    padding: 20px;
    border-bottom: 1px solid #e1e9f0;
}

.routerLink:hover {
    background-color: #e1e9f0;
}

.routerLink:local-link {
    font-weight: 600;
    background-color: #e1e9f0;
}

</style>
