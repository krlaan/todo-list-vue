<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputText = ref('')
const savedWords = ref<string[]>([])

const localStorageKey = 'prohibitedWords'

function saveProhibitedWords() {
    const words = inputText.value
        .split(';')
        .map(w => w.trim())
        .filter(w => w.length > 0)

    localStorage.setItem(localStorageKey, JSON.stringify(words))
    savedWords.value = words
    inputText.value = ''
}

function loadProhibitedWords() {
    const stored = localStorage.getItem(localStorageKey)
    if (stored) {
        try {
            savedWords.value = JSON.parse(stored)
        } catch {
            savedWords.value = []
        }
    }
}

onMounted(() => {
    loadProhibitedWords()
});

</script>

<template>
    <div class="container">
        <div class="header-row">
            <div class="title">🚫 Prohibited Words Admin</div>
        </div>

        <div class="form-group">
            <label for="prohibitedInput" class="label">Enter prohibited words (separated by ";"):</label>
            <textarea
                id="prohibitedInput"
                class="textarea"
                rows="3"
                v-model="inputText"
                placeholder="e.g. spam; scam; hack"
            ></textarea>
            <button class="save-button" @click="saveProhibitedWords">Save</button>
        </div>

        <div v-if="savedWords.length" class="word-list">
            <h4 class="list-title">Currently Stored Words:</h4>
            <ul>
                <li v-for="(word, index) in savedWords" :key="index" class="word-item">
                    {{ word }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 900px;
    margin: 60px auto;
    background: whitesmoke;
    padding: 25px 35px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
}

.title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.label {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 4px;
}

textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid lightslategrey;
    border-radius: 10px;
}

textarea:focus {
    border-color: #006400;
    box-shadow: 0 0 0 2px rgba(0, 100, 0, 0.2);
    outline: none;
}

.save-button {
    background-color: #8da28d;
    color: white;
    border: none;
    padding: 10px;
    width: 120px;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    align-self: center;
}

.save-button:hover {
    background-color: #7c9778;
}

.word-list {
    margin-top: 25px;
}

.list-title {
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.word-item {
    background: white;
    padding: 8px 15px;
    border-radius: 8px;
    margin-bottom: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    font-size: 0.95rem;
}

ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}
</style>
