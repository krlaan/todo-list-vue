<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CategoryService } from '@/services/CategoryService.ts'
import type { ITodoCategory } from '@/domain/ITodoCategory.ts'
import type { IResultObject } from '@/types/IResultObject.ts'

const data = reactive<IResultObject<ITodoCategory>>({})
const categoryService = new CategoryService()

const route = useRoute()
const router = useRouter()

const category = reactive<ITodoCategory>({
    id: '',
    categoryName: '',
    categorySort: 0,
    syncDt: '',
    tag: ''
})

async function fetchCategory() {
    try {
        const id = route.params.id as string

        const result = await categoryService.getAsync(id)
        data.data = result.data
        data.errors = result.errors

        if (result.data) {
            Object.assign(category, result.data)
        }
    } catch (error) {
        console.error('Error loading Category:', error)
    }
}

const nameError = ref('')

function getProhibitedWords(): string[] {
    const stored = window.localStorage.getItem('prohibitedWords') || ''
    return stored ? JSON.parse(stored) : []
}

async function updateCategory() {
    nameError.value = ''

    const prohibitedWords = getProhibitedWords()
    const nameWords = category.categoryName.toLowerCase().split(/\W+/)

    for (const pw of prohibitedWords) {
        if (nameWords.includes(pw.toLowerCase())) {
            nameError.value = `Oops! The word "${pw}" is not allowed in the Category name.`
            return
        }
    }

    try {
        category.syncDt = new Date().toISOString()

        const result = await categoryService.updateAsync(category.id!, category)
        data.data = result.data
        data.errors = result.errors

        if (!result.errors) {
            console.log('Session updated!');
            router.push("/Categories")

        } else if (result.errors) {
            console.error('Error with creating session', result.errors);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

onMounted(async () => {
    await fetchCategory()
});

</script>

<template>
    <form @submit.prevent="updateCategory">
        <h1>Edit Category</h1>

        <div class="mb-3">
            <label for="CategoryName">Category Name:</label>
            <input
                id="CategoryName"
                v-model="category.categoryName"
                type="text"
                required />
            <p v-if="nameError" class="error">{{ nameError }}</p>
        </div>

        <div class="mb-3">
            <label for="CategorySort">Sort Order:</label>
            <input
                id="CategorySort"
                v-model.number="category.categorySort"
                type="number"
                min="0"
                required />
        </div>

        <div class="mb-3">
            <label for="tag">Tag:</label>
            <input
                id="tag"
                v-model="category.tag"
                type="text"
            />
        </div>

        <div class="button-group">
            <button type="submit" class="create-button">Edit</button>
            <button type="button" class="btn btn-secondary" @click="router.push('/Categories')">Cancel</button>
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
