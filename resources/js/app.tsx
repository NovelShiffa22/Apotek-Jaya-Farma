import '../css/app.css';
import './styles/index.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import ConfirmModal from './app/components/ConfirmModal';

const appName = import.meta.env.VITE_APP_NAME || 'Apotek Jaya Farma';

const showGlobalTimeoutModal = () => {
    const modalRootId = 'global-timeout-modal-root';
    let container = document.getElementById(modalRootId);
    if (!container) {
        container = document.createElement('div');
        container.id = modalRootId;
        document.body.appendChild(container);
    }
    
    const root = createRoot(container);
    root.render(
        <ConfirmModal 
            isOpen={true} 
            type="timeout"
            title="Sesi Berakhir"
            message="Sesi Anda telah berakhir atau terjadi kesalahan otentikasi. Anda akan dialihkan ke halaman login."
            confirmText="OK"
            onConfirm={() => {
                root.unmount();
                if (container) container.remove();
                window.location.href = '/login';
            }}
            onClose={() => {}}
        />
    );
};

// Global error handler for session timeouts and 409 Inertia location redirects
axios.interceptors.response.use(
    (response) => {
        const isLocationRedirect = response.status === 409 && response.headers['x-inertia-location'];
        if (isLocationRedirect) {
            showGlobalTimeoutModal();
            // Halt the promise chain so Inertia doesn't immediately redirect
            return new Promise(() => {});
        }
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if ([401, 405, 419].includes(status)) {
                showGlobalTimeoutModal();
                // Halt the promise chain to prevent further error bubbling
                return new Promise(() => {});
            }
        }
        return Promise.reject(error);
    }
);

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./app/pages/${name}.tsx`,
            import.meta.glob('./app/pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
