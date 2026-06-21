import { createApp } from 'vue'
import App from './App.vue'

(() => {
    const mountApp = (element, appContext, childElements, props) => {
        const webComponentContainer = document.querySelector('micro-announcements-vue');
        const rootContainer = document.getElementById('app');
        const container = element || webComponentContainer || rootContainer;

        const app = createApp(App);

        app.provide("childElements", childElements);
        app.provide("rootElement", element);
        app.provide("props", props);
        app.provide("appContext", appContext);

        app.mount(container);
    }

    if (document.querySelector('micro-announcements-vue')) {
        window["micro-announcements-vue_mount"] = mountApp;
    } else {
        mountApp();
    }
})();
