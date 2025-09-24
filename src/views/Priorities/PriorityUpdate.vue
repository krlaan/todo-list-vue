<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PriorityService } from '@/services/PriorityService.ts'
import type { ITodoPriority } from '@/domain/ITodoPriority.ts'
import type { IResultObject } from '@/types/IResultObject.ts'

const data = reactive<IResultObject<ITodoPriority>>({})
const priorityService = new PriorityService()

const route = useRoute()
const router = useRouter()

const priority = reactive<ITodoPriority>({
    id: '',
    priorityName: '',
    prioritySort: 0,
    syncDt: '',
    tag: ''
})

async function fetchPriority() {
    try {
        const id = route.params.id as string

        const result = await priorityService.getAsync(id)
        data.data = result.data
        data.errors = result.errors

        if (result.data) {
            Object.assign(priority, result.data)
        }
    } catch (error) {
        console.error('Error loading priority:', error)
    }
}

const nameError = ref('')

function getProhibitedWords(): string[] {
    const stored = window.localStorage.getItem('prohibitedWords') || ''
    return stored ? JSON.parse(stored) : []
}

async function updatePriority() {
    nameError.value = ''

    const prohibitedWords = getProhibitedWords()
    const nameWords = priority.priorityName.toLowerCase().split(/\W+/)

    for (const pw of prohibitedWords) {
        if (nameWords.includes(pw.toLowerCase())) {
            nameError.value = `Oops! The word "${pw}" is not allowed in the priority name.`
            return
        }
    }

    try {
        priority.syncDt = new Date().toISOString()

        const result = await priorityService.updateAsync(priority.id!, priority)
        data.data = result.data
        data.errors = result.errors

        if (!result.errors) {
            console.log('Session updated!');
            router.push("/Priorities")

        } else if (result.errors) {
            console.error('Error with creating session', result.errors);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

onMounted(async () => {
    await fetchPriority()
});

</script>

<template>
    <form @submit.prevent="updatePriority">
        <h1>Edit Priority</h1>

        <div class="mb-3">
            <label for="priorityName">Priority Name:</label>
            <input
                id="priorityName"
                v-model="priority.priorityName"
                type="text"
                required />
            <p v-if="nameError" class="error">{{ nameError }}</p>
        </div>

        <div class="mb-3">
            <label for="prioritySort">Sort Order:</label>
            <input
                id="prioritySort"
                v-model.number="priority.prioritySort"
                type="number"
                min="0"
                required />
        </div>

        <div class="mb-3">
            <label for="tag">Tag:</label>
            <input
                id="tag"
                v-model="priority.tag"
                type="text"
            />
        </div>

        <div class="button-group">
            <button type="submit" class="create-button">Edit</button>
            <button type="button" class="btn btn-secondary" @click="router.push('/Priorities')">Cancel</button>
        </div>
    </form>
</template>

<style scoped>

form {
    margin: 65px auto 0 auto;
    background-color: whitesmoke;
    padding: 20px 30px;
    border-radius: 12px;
    width: 370px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input, textarea, select {
    width: 100%;
    padding: 12px;
    border: 1px solid lightslategrey;
    border-radius: 10px;
}

input:focus, textarea:focus {
    border-color: #006400;
    box-shadow: 0 0 0 2px rgba(0, 100, 0, 0.2);
    outline: none;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.create-button,
.btn.btn-secondary {
    background-color: #8da28d;
    margin-top: 12px;
    border: none;
    padding: 12px;
    width: 100%;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
}

.create-button {
    background-color: #8da28d;
    color: #fff;
}

.create-button:hover {
    background-color: #7c9778;
}

.btn.btn-secondary {
    background-color: #aaa;
    color: white;
}

.btn.btn-secondary:hover {
    background-color: #888;
}

.inline-field label {
    min-width: 150px;
    font-weight: bold;
}

.error {
    color: red;
}

</style>
