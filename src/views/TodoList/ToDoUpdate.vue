<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ITodoCategory } from '@/domain/ITodoCategory.ts'
import type { ITodoPriority } from '@/domain/ITodoPriority.ts'
import { ToDoService } from '@/services/ToDoService.ts'
import { CategoryService } from '@/services/CategoryService.ts'
import { PriorityService } from '@/services/PriorityService.ts'
import type { ITodoTask } from '@/domain/ITodoTask.ts'

const route = useRoute()
const router = useRouter()

const todoService = new ToDoService()
const categoryService = new CategoryService()
const priorityService = new PriorityService()

const categories = ref<ITodoCategory[]>([])
const priorities = ref<ITodoPriority[]>([])

const task = reactive<ITodoTask>({
    taskName: '',
    taskSort: 0,
    createdDt: new Date().toISOString(),
    dueDt: '',
    isCompleted: false,
    isArchived: false,
    todoCategoryId: '',
    todoPriorityId: '',
    syncDt: new Date().toISOString()
})

const nameError = ref('')

function getProhibitedWords(): string[] {
    const stored = window.localStorage.getItem('prohibitedWords') || ''
    return stored ? JSON.parse(stored) : []
}

async function updateToDoTask() {
    nameError.value = ''
    const prohibitedWords = getProhibitedWords()
    const taskNameLower = task.taskName.toLowerCase().split(/\W+/)

    for (const pw of prohibitedWords) {
        const pwLower = pw.toLowerCase()
        if (pwLower && taskNameLower.includes(pwLower)) {
            nameError.value = `Oops! The word "${pw}" is not allowed here. Try to be nicer!`
            return
        }
    }
    const id = route.params.id as string

    try {
        const result = await todoService.updateAsync(id, task)

        if (result.data) {
            console.log('Session edited: ', result.data);
            router.push("/ToDoList")

        } else if (result.errors) {
            console.error('Error with creating session', result.errors);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchTodoTask() {
    try {
        const id = route.params.id as string

        const result = await todoService.getAsync(id)
        if (result.data) {
            Object.assign(task, result.data)
        }

    } catch (error) {
        console.error('Error loading priority:', error)
    }
}

onMounted(async () => {
    await fetchTodoTask()

    const categoriesResult = await categoryService.getAllAsync()
    categories.value = categoriesResult.data || []

    const prioritiesResult = await priorityService.getAllAsync()
    priorities.value = prioritiesResult.data || []
})
</script>

<template>
    <form @submit.prevent="updateToDoTask">
        <h1>Edit Task</h1>

        <div class="mb-3">
            <label for="taskName">Task Name:</label>
            <input
                id="taskName"
                v-model="task.taskName"
                type="text"
                required />
            <p v-if="nameError" class="error">{{ nameError }}</p>
        </div>

        <div class="mb-3">
            <label for="taskSort">Task Sort:</label>
            <input
                id="taskSort"
                v-model.number="task.taskSort"
                type="number"
                min="0"
                required />
        </div>

        <div class="mb-3 inline-field">
            <label for="dueTo">Due Date:</label>
            <input
                id="dueTo"
                v-model="task.dueDt"
                type="datetime-local"
                class="small-date"
                required />
        </div>

        <div class="mb-3">
            <label for="category">Category</label>
            <select
                id="category"
                v-model="task.todoCategoryId"
                required>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.categoryName }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label for="priority">Priority</label>
            <select
                id="priority"
                v-model="task.todoPriorityId"
                required>
                <option v-for="pr in priorities" :key="pr.id" :value="pr.id">
                    {{ pr.priorityName }}
                </option>
            </select>
        </div>

        <div class="mb-3 inline-checkboxes">
            <div class="checkbox-item">
                <input id="isCompleted" type="checkbox" v-model="task.isCompleted" />
                <label for="isCompleted">Completed</label>
            </div>
            <div class="checkbox-item">
                <input id="isArchived" type="checkbox" v-model="task.isArchived" />
                <label for="isArchived">Archived</label>
            </div>
        </div>

        <div class="button-group">
            <button type="submit" class="create-button">Edit</button>
            <button type="button" class="btn btn-secondary" @click="router.push('/ToDoList')">Cancel</button>
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

.inline-field {
    display: flex;
    align-items: center;
    gap: 12px;
}

.inline-field label {
    min-width: 100px;
    font-weight: bold;
}

.small-date {
    width: 200px;
}

.inline-checkboxes {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 0 2px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    padding: 8px 12px;
}

.checkbox-item input {
    width: auto;
}

.error {
    color: red;
}
</style>
