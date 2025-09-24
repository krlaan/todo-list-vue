<script setup lang="ts">
import { ref } from 'vue';
import { useUserDataStore } from '@/stores/userDataStore';
import { AccountService } from '@/services/AccountService.ts';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useUserDataStore();

const email = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const error = ref<string | null>(null);

const doRegister = async () => {

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

  if (!passwordRegex.test(password.value)) {
    error.value = 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character!';
    return;
  }

  const response = await AccountService.register(email.value, firstName.value, lastName.value, password.value);

  if (response.data) {
    store.jwt = response.data.token;
    store.firstName = response.data.firstName;
    store.lastName = response.data.lastName;
    await router.push('/');
  } else {
    error.value = 'Name and Email need to contain a character!';
  }
}

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

</script>

<template>
  <main role="main" class="pb-3">
    <div class="form-container">

      <section>
        <form @submit.prevent="doRegister" id="account" method="post">

          <h1>Register</h1>

          <div class="mb-3">
            <input v-model="email" type="text" class="form-control" id="userEmail"
                   aria-describedby="emailHelp" placeholder="Email" required>
          </div>
          <div class="mb-3">
            <input v-model="firstName" type="text" class="form-control" id="userFirstName"
                   aria-describedby="firstNameHelp" placeholder="First Name" required>
          </div>
          <div class="mb-3">
            <input v-model="lastName" type="text" class="form-control" id="userLastName"
                   aria-describedby="lastNameHelp" placeholder="Last Name" required>
          </div>

          <div class="mb-3 password-field">
            <div class="input-with-icon">
              <input v-model="password" :type="showPassword ? 'text' : 'password'"
                     class="form-control" id="userPassword" placeholder="Password" required>

              <span class="toggle-password" @click="togglePasswordVisibility">
                {{ showPassword ? '🔒' : '👁️' }}
              </span>
            </div>
          </div>

          <button id="login-submit" type="submit" class="btn btn-primary">Register</button>

        </form>
      </section>

      <div v-if="error" class="alert alert-warning" role="alert">
        {{ error }}
      </div>
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
  margin-bottom: 24px;
  text-align: center;
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
}

button:hover {
  background-color: #7c9778;
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
