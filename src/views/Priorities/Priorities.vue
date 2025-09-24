<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { PriorityService } from '@/services/PriorityService.ts'
import type { IResultObject } from '@/types/IResultObject.ts'
import type { ITodoPriority } from '@/domain/ITodoPriority.ts'
import { useRouter } from 'vue-router'

const requestIsOngoing = ref(false)
const data = reactive<IResultObject<ITodoPriority[]>>({})
const priorityService = new PriorityService()

const router = useRouter()

const fetchPriorities = async () => {
    requestIsOngoing.value = true
    try {
        const result = await priorityService.getAllAsync()

        data.data = result.data
        data.errors = result.errors

    } catch (error) {
        console.error('Error fetching data:', error)
    } finally {
        requestIsOngoing.value = false
    }
}

onMounted(async () => {
    await fetchPriorities()
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
            <button class="create-button" @click="router.push('/PriorityCreate')">Create New
            </button>
            <div class="title">Priorities</div>
        </div>

        <div v-if="requestIsOngoing">Loading...</div>
        <div v-else class="sessions-list">
            <div v-for="item in data.data" :key="item.id" class="session-card">
                <div class="detail-row">
                    <span class="label">{{ item.priorityName }}</span>
                    <span class="value">{{ formatDate(item.syncDt) }}</span>
                </div>
                <div class="detail-row">
                    <span class="value">Sort: {{item.prioritySort}}</span>
                </div>
                <div class="detail-row">
                    <span class="value">Tag: {{ item.tag }}</span>
                    <span class="links-container">
                    <RouterLink :to="`/PriorityDetails/${item.id}`" class="link">Details</RouterLink>
                        |
                    <RouterLink :to="`/PriorityUpdate/${item.id}`" class="link">Edit</RouterLink>
                        |
                    <RouterLink :to="`/PriorityDelete/${item.id}`" class="link">Delete</RouterLink>
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
    width: 15%;
    color: white;
    border-radius: 10px;
    cursor: pointer;
}

button:hover {
    background-color: #6c8a6c;
}

</style>
