<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { PriorityService } from '@/services/PriorityService.ts';
import type { ITodoPriority } from '@/domain/ITodoPriority.ts';
import type { IResultObject } from '@/types/IResultObject.ts'

const requestIsOngoing = ref(false)
const data = ref<IResultObject<ITodoPriority>>({})
const priorityService = new PriorityService()

const route = useRoute();
const router = useRouter();

const priority = ref<ITodoPriority>()

const fetchPriority = async () => {
    try {
        const id = route.params.id as string;
        const result = await priorityService.getAsync(id);
        data.value = result
        priority.value = result.data
    } catch (err) {
        console.error('Error loading data');
    }
};

onMounted(() => {
    fetchPriority()
})

const formatDate = (isoDate?: string): string => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toLocaleString('en-GB')
}

</script>

<template>
    <div class="container">
        <h1>Priority Info</h1>

        <div v-if="requestIsOngoing">Loading...</div>
        <div v-else-if="priority">
            <div class="content">
                <div class="info-panel">
                    <div class="detail-row">
                        <span class="label">Name:</span>
                        <span class="value">{{ priority.priorityName}}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Sort:</span>
                        <span class="value">{{ priority.prioritySort }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Sync Time:</span>
                        <span class="value">{{ formatDate(priority.syncDt) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Tag:</span>
                        <span class="value">{{ priority.tag }}</span>
                    </div>

                    <div class="button-group">
                        <button @click="router.push('/Priorities')" class="btn btn-secondary">Back</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.container {
    max-width: 600px;
    margin: 65px auto 0 auto;
    background: whitesmoke;
    padding: 5px 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.content {
    display: flex;
    gap: 20px;
    margin: 20px;
}

.info-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.label {
    font-weight: bold;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f5f7f9;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
    font-size: 1.1rem;
}

.button-group {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

button {
    background-color: #8da28d;
    border: none;
    padding: 12px;
    width: 100%;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
}

button:hover {
    background-color: #7c9778;
}

.btn.btn-secondary {
    background-color: #aaa;
}

.btn.btn-secondary:hover {
    background-color: #888;
}

</style>
