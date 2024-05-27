import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@mui/material';
import {CacheProvider} from "@emotion/react";
import createCache from '@emotion/cache'
import {createTheme, ThemeProvider} from "@mui/material";
import {store} from "./store";
import { Provider } from 'react-redux'

(() => {
    const mountApp = (element) => {
        const webComponentContainer = document.querySelector('micro-class-schedule');
        const rootContainer = document.getElementById('root');
        const container = element || webComponentContainer || rootContainer;

        const cache = createCache({
            key: 'css',
            prepend: true,
            container: container,
        });

        const theme = createTheme({
            components: {
                MuiPopover: {
                    defaultProps: {
                        container: container,
                    },
                },
                MuiPopper: {
                    defaultProps: {
                        container: container,
                    },
                },
                MuiModal: {
                    defaultProps: {
                        container: container,
                    },
                },
            },
        });

        ReactDOM.createRoot(container).render(
            <Provider store={store}>
                <CacheProvider value={cache}>
                    <ThemeProvider theme={theme}>
                        <App/>
                    </ThemeProvider>
                </CacheProvider>
            </Provider>
        );
    }

    if (document.querySelector('micro-class-schedule')) {
        window["micro-class-schedule_mount"] = mountApp;
    } else {
        mountApp();
    }
})();
