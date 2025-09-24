<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PriorityService } from '@/services/PriorityService.ts'
import type { ITodoPriority } from '@/domain/ITodoPriority.ts'
import type { IResultObject } from '@/types/IResultObject.ts'

const data = reactive<IResultObject<ITodoPriority>>({})
const priorityService = new PriorityService()

const route = useRoute()
const router = useRouter()

const priority = ref<ITodoPriority>()

async function fetchPriority() {
    try {
        const id = route.params.id as string

        const result = await priorityService.getAsync(id)

        data.data = result.data
        priority.value = result.data

    } catch (error) {
        console.error('Error loading priority:', error)
    }
}

async function deletePriority() {
    if (!priority.value?.id) return

    try {
        const result = await priorityService.deleteAsync(priority.value.id)
        data.errors = result.errors

        if (!result.errors) {
            await router.push("/Priorities")

        } else if (result.errors) {
            console.error('Error with deleting session', result.errors);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

onMounted(async () => {
    await fetchPriority();
});

</script>

<template>
    <div class="delete-container">
        <h1>Delete Priority</h1>
        <h3>Are you sure you want to delete this priority?</h3>
        <hr />

        <div v-if="priority" class="session-info">
            <div class="row">
                <span class="label">Name:</span>
                <span class="value"> {{ priority.priorityName }} </span>
            </div>
            <div class="row">
                <span class="label">Id:</span>
                <span class="value"> {{ priority.id }} </span>
            </div>
        </div>

        <div class="button-group">
            <button @click="deletePriority" class="btn btn-danger">Delete</button>
            <button @click="router.push('/Priorities')" class="btn btn-secondary">Cancel</button>
        </div>
    </div>
</template>

<style scoped>

.delete-container {
    text-align: center;
    margin: 65px auto;
    padding: 24px;
    max-width: 400px;
    background-color: whitesmoke;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.session-info {
    margin: 20px 0;
}

.row {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
}

.label {
    font-weight: bold;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 30px;
}

.btn {
    padding: 10px 18px;
    border-radius: 8px;
    text-decoration: none;
    cursor: pointer;
    border: none;
}

.btn-danger {
    background-color: #a94442;
}

.btn-danger:hover {
    background-color: #922d2d;
}

.btn.btn-secondary {
    background-color: #aaa;
}

.btn.btn-secondary:hover {
    background-color: #888;
}

</style>
