import { createApp } from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'

(() => {
    const mountApp = (element, appContext, childElements, props) => {
        const webComponentContainer = document.querySelector('micro-navigation');
        const rootContainer = document.getElementById('app');
        const container = element || webComponentContainer || rootContainer;

        const app = createApp(App);

        app.provide("childElements", childElements);
        app.provide("rootElement", element);
        app.provide("props", props);
        app.provide("appContext", appContext);

        app.mount(container);
    }

    if (document.querySelector('micro-navigation')) {
        window["micro-navigation_mount"] = mountApp;
    } else {
        mountApp();
    }
})();
