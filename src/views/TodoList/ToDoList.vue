<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ToDoService } from '@/services/ToDoService.ts'
import type { ITodoTask } from '@/domain/ITodoTask.ts'
import type { IResultObject } from '@/types/IResultObject.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive<IResultObject<ITodoTask[]>>({})
const todoService = new ToDoService()

const fetchTasks = async () => {
    try {
        const result = await todoService.getAllAsync()

        data.data = result.data
        data.errors = result.errors

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

const searchTerm = ref('')
const showCompleted = ref<'all' | 'completed' | 'notCompleted'>('all')
const showArchived = ref<'all' | 'archived' | 'active'>('all')

const filteredData = computed(() => {
    const items = data.data || []
    const term = searchTerm.value.toLowerCase()

    return items.filter(item => {
        const matchesSearch = item.taskName?.toLowerCase().includes(term) ?? false

        const matchesCompleted =
            showCompleted.value === 'all' ||
            (showCompleted.value === 'completed' && item.isCompleted) ||
            (showCompleted.value === 'notCompleted' && !item.isCompleted)

        const matchesArchived =
            showArchived.value === 'all' ||
            (showArchived.value === 'archived' && item.isArchived) ||
            (showArchived.value === 'active' && !item.isArchived)

        return matchesSearch && matchesCompleted && matchesArchived
    })
})

onMounted(async () => {
    await fetchTasks()
})

const formatDate = (isoDate?: string): string => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toLocaleString('en-GB')
}

</script>

<template>
    <div class="container">
        <div class="header-row">
            <button class="create-button" @click="router.push('/ToDoCreate')">Create New
            </button>
            <div class="title">ToDo Tasks</div>
            <input
                v-model="searchTerm"
                class="search-input"
                type="text"
                placeholder="Search by task name..."
            />
        </div>

        <div class="filter-group">
            <div class="filter-section">
                <div class="filter-header">Completed:</div>
                <div class="options">
                    <label><input type="radio" value="all" v-model="showCompleted" /> All</label>
                    <label><input type="radio" value="completed" v-model="showCompleted" /> Completed</label>
                    <label><input type="radio" value="notCompleted" v-model="showCompleted" /> Not Completed</label>
                </div>
            </div>
            <div class="filter-section">
                <div class="filter-header">Archived:</div>
                <div class="options">
                    <label><input type="radio" value="all" v-model="showArchived" /> All</label>
                    <label><input type="radio" value="archived" v-model="showArchived" /> Archived</label>
                    <label><input type="radio" value="active" v-model="showArchived" /> Active</label>
                </div>
            </div>
        </div>

        <div class="sessions-list">
            <div v-for="item in filteredData" :key="item.id" class="session-card">
                <div class="detail-row">
                    <span class="label">{{ item.taskName }}</span>
                    <span class="value">{{ formatDate(item.syncDt) }}</span>
                </div>
                <div class="detail-row">
                    <span :class="item.isCompleted ? 'status-completed' : 'status-not-completed'">
                        {{ item.isCompleted ? 'Completed' : 'Not Completed' }}
                    </span>
                </div>
                <div class="detail-row" v-if="item.isArchived">
                    <span class="archived-label">Archived</span>
                    <span class="links-container">
                        <RouterLink :to="`/ToDoDetails/${item.id}`" class="link">Details</RouterLink> |
                        <RouterLink :to="`/ToDoUpdate/${item.id}`" class="link">Edit</RouterLink> |
                        <RouterLink :to="`/ToDoDelete/${item.id}`" class="link">Delete</RouterLink>
                    </span>
                </div>


                <div class="detail-row" v-else>
                    <span></span>
                    <span class="links-container">
                        <RouterLink :to="`/ToDoDetails/${item.id}`" class="link">Details</RouterLink> |
                        <RouterLink :to="`/ToDoUpdate/${item.id}`" class="link">Edit</RouterLink> |
                        <RouterLink :to="`/ToDoDelete/${item.id}`" class="link">Delete</RouterLink>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.container {
    max-width: 1000px;
    margin: 65px auto 10px;
    background: whitesmoke;
    padding: 5px 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 15px;
    margin-top: 10px;
}

.title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
}

.radio-group input[type="radio"] {
    margin-right: 8px;
    accent-color: #4caf50;
}

.sessions-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-bottom: 10px;
}

.session-card {
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.detail-row {
    display: flex;
    justify-content: space-between;
}

.label {
    font-weight: bold;
}

.links-container a, .link {
    color: #4caf50;
    font-weight: 500;
    text-decoration: underline;
    font-size: 0.95rem;
    transition: color 0.3s;
    width: auto;
}

.links-container a:hover, .link:hover {
    color: #388e3c;
}

button {
    background-color: #8da28d;
    border: none;
    padding: 8px 10px;
    width: 20%;
    color: white;
    border-radius: 10px;
    cursor: pointer;
}

button:hover {
    background-color: #6c8a6c;
}

.status-completed {
    color: #2e7d32;
}

.status-not-completed {
    color: #c62828;
}

.archived-label {
    color: #666;
    font-style: italic;
}

.search-input {
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
    width: 20%;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #006400;
    box-shadow: 0 0 0 2px rgba(0, 100, 0, 0.2);
}

.filter-group {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin: 10px 0 20px;
    flex-wrap: wrap;
}

.filter-section {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    text-align: center;
}

.filter-header {
    font-weight: bold;
    font-size: 1.1rem;
}

.options {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}

.options label {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #f0f0f0;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.options label:hover {
    background: #e0e0e0;
}

.options input[type='radio'] {
    accent-color: #4caf50;
    cursor: pointer;
}

</style>
