import { createRouter, createWebHistory } from 'vue-router'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import ToDoList from '@/views/TodoList/ToDoList.vue'
import ToDoCreate from '@/views/TodoList/ToDoCreate.vue'
import ToDoUpdate from '@/views/TodoList/ToDoUpdate.vue'
import ToDoDetails from '@/views/TodoList/ToDoDetails.vue'
import ToDoDelete from '@/views/TodoList/ToDoDelete.vue'
import PriorityCreate from '@/views/Priorities/PriorityCreate.vue'
import PriorityDetails from '@/views/Priorities/PriorityDetails.vue'
import PriorityDelete from '@/views/Priorities/PriorityDelete.vue'
import Priorities from '@/views/Priorities/Priorities.vue'
import PriorityUpdate from '@/views/Priorities/PriorityUpdate.vue'
import CategoryDetails from '@/views/Categories/CategoryDetails.vue'
import Categories from '@/views/Categories/Categories.vue'
import CategoryCreate from '@/views/Categories/CategoryCreate.vue'
import CategoryDelete from '@/views/Categories/CategoryDelete.vue'
import CategoryUpdate from '@/views/Categories/CategoryUpdate.vue'
import ToDoAdmin from '@/views/TodoList/ToDoAdmin.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/ToDoList',
        name: 'ToDoList',
        component: ToDoList,
        meta: { requiresAuth: true }
    },
    {
        path: '/TodoCreate',
        name: 'TodoCreate',
        component: ToDoCreate,
        meta: { requiresAuth: true }
    },
    {
        path: '/TodoDetails/:id',
        name: 'TodoDetails',
        component: ToDoDetails,
        meta: { requiresAuth: true }
    },
    {
        path: '/TodoUpdate/:id',
        name: 'TodoUpdate',
        component: ToDoUpdate,
        meta: { requiresAuth: true }
    },
    {
        path: '/TodoDelete/:id',
        name: 'TodoDelete',
        component: ToDoDelete,
        meta: { requiresAuth: true }
    },
    { // Categories
        path: '/Categories',
        name: 'Categories',
        component: Categories,
        meta: { requiresAuth: true }
    },
    {
        path: '/CategoryCreate',
        name: 'CategoriesCreate',
        component: CategoryCreate,
        meta: { requiresAuth: true }
    },
    {
        path: '/CategoryDetails/:id',
        name: 'CategoriesDetails',
        component: CategoryDetails,
        meta: { requiresAuth: true }
    },
    {
        path: '/CategoryUpdate/:id',
        name: 'CategoriesUpdate',
        component: CategoryUpdate,
        meta: { requiresAuth: true }
    },
    {
        path: '/CategoryDelete/:id',
        name: 'CategoriesDelete',
        component: CategoryDelete,
        meta: { requiresAuth: true }
    },
    { // Priorities
        path: '/Priorities',
        name: 'Priorities',
        component: Priorities,
        meta: { requiresAuth: true }
    },
    {
        path: '/PriorityCreate',
        name: 'PrioritiesCreate',
        component: PriorityCreate,
        meta: { requiresAuth: true }
    },
    {
        path: '/PriorityDetails/:id',
        name: 'PrioritiesDetails',
        component: PriorityDetails,
        meta: { requiresAuth: true }
    },
    {
        path: '/PriorityUpdate/:id',
        name: 'PrioritiesUpdate',
        component: PriorityUpdate,
        meta: { requiresAuth: true }
    },
    {
        path: '/PriorityDelete/:id',
        name: 'PrioritiesDelete',
        component: PriorityDelete,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: ToDoAdmin,
        meta: { hidden: true }
    },
]

import { useUserDataStore } from '@/stores/userDataStore'

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const userStore = useUserDataStore()

    if (to.meta.requiresAuth && !userStore.jwt) {
        next({ name: 'Login' })
    } else {
        next()
    }
})

export default router
