<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { PriorityService } from '@/services/PriorityService.ts';
import type { ITodoPriority } from '@/domain/ITodoPriority.ts';
import type { IResultObject } from '@/types/IResultObject.ts'
import { ToDoService } from '@/services/ToDoService.ts'
import { CategoryService } from '@/services/CategoryService.ts'
import type { ITodoCategory } from '@/domain/ITodoCategory.ts'
import type { ITodoTask } from '@/domain/ITodoTask.ts'

const data = reactive<IResultObject<ITodoTask>>({})

const todoService = new ToDoService()
const categoryService = new CategoryService()
const priorityService = new PriorityService()

const route = useRoute();
const router = useRouter();

const categories = ref<ITodoCategory[]>([])
const priorities = ref<ITodoPriority[]>([])
const categoryName = ref<string | null>(null)
const priorityName = ref<string | null>(null)

async function fetchTaskDetails() {
    const id = route.params.id as string
    if (!id) return


    const [taskResult, catResult, prioResult] = await Promise.all([
        todoService.getAsync(id),
        categoryService.getAllAsync(),
        priorityService.getAllAsync()
    ])
    data.data = taskResult.data
    data.errors = taskResult.errors

    categories.value = catResult.data || []
    priorities.value = prioResult.data || []

    if (data.data) {
        categoryName.value = categories.value.find(c => c.id === data.data?.todoCategoryId)?.categoryName || null
        priorityName.value = priorities.value.find(p => p.id === data.data?.todoPriorityId)?.priorityName || null
    }
}

onMounted(() => {
    fetchTaskDetails()
})

const formatDate = (isoDate?: string): string => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toLocaleString('en-GB')
}

</script>

<template>
    <div class="container">
        <h1>Task Info</h1>

        <div>
            <div class="content">
                <div class="info-panel">
                    <div class="detail-row">
                        <span class="label">Name:</span>
                        <span class="value">{{ data.data?.taskName }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Sort:</span>
                        <span class="value">{{ data.data?.taskSort  }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Sync Time:</span>
                        <span class="value">{{ formatDate(data.data?.syncDt) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Completed:</span>
                        <span class="value">{{ data.data?.isCompleted ? 'Yes' : 'No' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Archived:</span>
                        <span class="value">{{ data.data?.isArchived ? 'Yes' : 'No' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Category:</span>
                        <span class="value">{{ categoryName }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Priority:</span>
                        <span class="value">{{ priorityName }}</span>
                    </div>

                    <div class="button-group">
                        <button @click="router.push('/ToDoList')" class="btn btn-secondary">Back</button>
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
