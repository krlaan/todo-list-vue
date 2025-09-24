<script setup lang="ts">
import { ref } from 'vue'
import { useUserDataStore } from '@/stores/userDataStore'
import { AccountService } from '@/services/AccountService.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useUserDataStore()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const doLogin = async () => {

    const response = await AccountService.login(email.value, password.value)

    if (response.data) {
        store.jwt = response.data.token
        store.firstName = response.data.firstName
        store.lastName = response.data.lastName
        await router.push('/ToDoList')
    } else {
        error.value = 'Wrong email or password! Try again...'
    }
}

const showPassword = ref(false)

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

</script>

<template>
    <main role="main" class="pb-3">
        <div class="form-container">

            <section>
                <form @submit.prevent="doLogin" id="account" method="post">

                    <h1>Login</h1>
                    <div v-if="error" class="alert alert-warning">
                        {{ error }}
                    </div>
                    <div class="mb-3">
                        <label for="userEmail" class="form-label">Email</label>
                        <input v-model="email" type="text" class="form-control" id="userEmail"
                               aria-describedby="emailHelp" required>
                    </div>

                    <div class="mb-3 password-field">
                        <label for="userPassword" class="form-label">Password</label>
                        <div class="input-with-icon">
                            <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                   class="form-control" id="userPassword" required>

                            <span class="toggle-password" @click="togglePasswordVisibility">
                {{ showPassword ? '🔒' : '👁️' }}
              </span>
                        </div>
                    </div>

                    <button id="login-submit" type="submit" class="btn btn-primary">Login</button>

                    <div class="links-container">
                        <p>
                            <RouterLink id="create-account" to="/register">Create a new account</RouterLink>
                        </p>
                    </div>
                </form>
            </section>

        </div>
    </main>

</template>


<style scoped>

form {
    margin: 65px auto;
    background-color: whitesmoke;
    padding: 20px 30px;
    border-radius: 12px;
    width: 370px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
    margin-bottom: 12px;
    text-align: center;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    padding: 12px;
    border: 1px solid lightslategrey;
    border-radius: 10px;
}

input:focus {
    border-color: #006400;
    box-shadow: 0 0 0 2px rgba(0, 100, 0, 0.2);
}

button {
    background-color: #8da28d;
    margin-top: 12px;
    border: none;
    padding: 12px;
    width: 100%;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: none !important;
}

button:hover {
    background-color: #7c9778 !important;
    box-shadow: none !important;
}

.links-container {
    margin-top: 24px;
    text-align: center;
}

.links-container p {
    margin: 8px 0;
}

.links-container a {
    color: #4caf50;
    font-weight: 500;
    text-decoration: underline;
    font-size: 0.95rem;
    transition: color 0.3s;
}

.links-container a:hover {
    color: #388e3c;
}

.input-with-icon {
    position: relative;
}

.toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.alert-warning {
    text-align: center;
    margin: auto;
    background: none;
    border: none;
    color: orangered;
}

</style>
