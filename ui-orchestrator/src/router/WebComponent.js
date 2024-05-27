import db from "@/firebase/init.js";
import {collection, doc, getDoc, getDocs, onSnapshot} from "firebase/firestore";

const createWebComponent = (name, childElements) => {
    return class WebComponentClass extends HTMLElement {
        static observedAttributes = ["js-url", "css-url", "props"];
        constructor() {
            super();

            this.name = name;
            this.childElements = childElements;

            this.resources = [];
            this.scriptUrls = [];
            this.stylesheetsUrls = [];

            this.shadow = this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
            if(this.shadow.children.length === 0) {
                ;(async () => {
                    await this.loadCSS();
                    await this.loadJSAndMountApp();
                })();
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            const appContent = this.shadow.getElementById(this.name);

            if(appContent != null && oldValue !== null && oldValue !== newValue) {
                if (name === "js-url" || name === "props") {
                    appContent.remove();

                    for (let url in this.scriptUrls) {
                        this.shadow.querySelectorAll(`script[src="${url}"]`)[0]?.remove();
                    }

                    ;(async () => {
                        await this.loadJSAndMountApp();
                    })();
                } else if (name === "css-url") {
                    for (let url in this.stylesheetsUrls) {
                        this.shadow.querySelector(`link[href="${url}"]`)?.remove();
                    }

                    ;(async () => {
                        await this.loadCSS();
                    })();
                }
            }
        }


        async loadCSS() {

            if (this.hasAttribute("css-url") && this.getAttribute("css-url") != null) {
                const stylesheets = JSON.parse(this.getAttribute("css-url"));
                for(let styleSheet of stylesheets) {
                    this.stylesheetsUrls.push(styleSheet);
                    await this.loadResource(
                        styleSheet,
                        {
                            element: "link",
                            type: "text/css",
                            attribute: "href",
                            rel: "stylesheet"
                        }
                    );
                }
            }
        }

        async loadJSAndMountApp() {
            if (this.hasAttribute("js-url") && this.getAttribute("js-url") != null) {
                const scripts = JSON.parse(this.getAttribute("js-url"));
                for(let script of scripts) {
                    this.scriptUrls.push(script);
                    await this.loadResource(
                        script,
                        {
                            element: "script",
                            type: "module",
                            attribute: "src"
                        }
                    );
                }

                if(window[`${this.name}_mount`]) {
                    let properties = null;
                    if(this.getAttribute("props")) {
                        properties = JSON.parse(this.getAttribute("props"));
                    }
                    const appMountContainer = document.createElement("div");
                    appMountContainer.id = this.name;
                    this.shadowRoot.append(appMountContainer);
                    await window[`${this.name}_mount`](appMountContainer, this.shadowRoot, this.childElements, properties);
                }
            }
        }

        loadResource(resource, props) {
            return new Promise((resolve) => {
                const elementSelector = `${props.element}[${props.attribute}="${resource}"]`;
                let element = document.querySelector(elementSelector);

                const listener = () => {
                    element.onload = null;
                    this.resources[resource] = element;
                    resolve(element);
                }

                if(!element) {
                    element = document.createElement(props.element);
                    element.type = props.type;
                    element.rel = props.rel;
                    element.async = true;
                    element[props.attribute] = resource;
                    element.onload = listener;
                    this.shadow.appendChild(element);
                }

                if(this.resources[resource]) {
                    resolve(element)
                } else {
                    element.onload = listener;
                }
            })
        }
    }
}

const resources = [];
const loadResource = (resource, props) => {
    return new Promise((resolve) => {
        const elementSelector = `${props.element}[${props.attribute}="${resource}"]`;
        let element = document.querySelector(elementSelector);

        const listener = () => {
            element.onload = null;
            resources[resource] = element;
            resolve(element);
        }

        if(!element) {
            element = document.createElement(props.element);
            element.type = props.type;
            element.rel = props.rel;
            element.async = true;
            element[props.attribute] = resource;
            element.onload = listener;
            document.head.appendChild(element);
        }

        if(resources[resource]) {
            resolve(element)
        } else {
            element.onload = listener;
        }
    })
}

const getResourceType = (resourceLocation) =>  {
    let resourceTag = "script";
    let resourceType = "module";
    let attribute = "src";
    if(resourceLocation.endsWith(".css")) {
        resourceTag = "link";
        attribute = "href";
        resourceType = "text/css";
    }
    return {resourceType, resourceTag, attribute};
}

export const initiateAndObserveMicroApp = async (appId, args) => {
    const docReference = doc(db, "microfrontends", appId);
    let app = {}
    let oldData;
    let version = 0;
    await onSnapshot(docReference, async (doc) => {
        console.log(doc.id)
        console.log(JSON.stringify(doc.data()))
        const data = doc.data();
        let element = document.querySelector(data.name);

        if (element == null) {
            element = document.createElement(data.name);
        }

        if (oldData?.css !== data.css) {
            element.setAttribute("css-url", JSON.stringify(data.css));
        }
        if (oldData?.js !== data.js) {
            element.setAttribute("js-url", JSON.stringify(data.js));
        }

        if (args.props) {
            element.setAttribute("props", JSON.stringify(args.props));
        }

        if (!customElements.get(data.name)) {
            customElements.define(data.name, createWebComponent(data.name, element.children));
        }

        const parent = document.querySelector(args.parentSelector);
        parent.appendChild(element);

        oldData = data;
        version++;
    });
}

export default createWebComponent;
