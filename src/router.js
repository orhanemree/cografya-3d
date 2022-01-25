import { createRouter, createWebHistory } from 'vue-router'

// routes
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./components/Home.vue'),
    },
    {
        path: '/:model',
        name: 'Model',
        component: () => import('./components/Model.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router