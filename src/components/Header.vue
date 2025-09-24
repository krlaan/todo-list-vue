<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useUserDataStore } from '@/stores/userDataStore'

const userStore = useUserDataStore()
const router = useRouter()

const doLogout = () => {
    userStore.jwt = ''
    router.push('/')
}

</script>

<template>
    <header>
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <div class="container">
                <a class="navbar-brand" href="/">ToDoApp</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                        aria-controls="navbarCollapse" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul v-if="userStore.jwt" class="navbar-nav">
                        <li class="nav-item">
                            <RouterLink class="nav-link text-white" to="/ToDoList">TodoList</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link text-white" to="/Categories">Categories</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link text-white" to="/Priorities">Priorities</RouterLink>
                        </li>
                    </ul>

                    <ul class="navbar-nav flex-grow-1"></ul>

                    <ul v-if="!userStore.jwt" class="navbar-nav">
                        <li class="nav-item">
                            <RouterLink class="nav-link text-white" to="/register">Register</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link text-white" to="/login">Login</RouterLink>
                        </li>
                    </ul>

                    <ul v-else class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link text-white" href="/" @click="doLogout">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>

</style>
