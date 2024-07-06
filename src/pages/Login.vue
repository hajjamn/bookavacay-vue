<template>
  <main>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-4">
          <form @submit.prevent="formLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" v-model="form.email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" v-model="form.password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        email: 'robertorossi@gmail.com',
        password: 'robertorossi'
      }
    }
  },
  methods: {
    formLogin() {
      axios.defaults.withCredentials = true; // Ensure credentials are sent with CORS requests

      axios.post('http://127.0.0.1:8000/login', {
        email: this.form.email,
        password: this.form.password
      }, {
        headers: {
          'Content-Type': 'application/json', // Adjust as per your request
          'X-Requested-With': 'XMLHttpRequest',
          // Fetch CSRF token from meta tag
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      })
        .then(res => {
          console.log(res.data);
          // Handle successful login response
        })
        .catch(err => {
          console.error('Error logging in:', err);
          // Handle error, if needed
        });
    },
  },
  created() {
    // Fetch CSRF token on component creation, if needed
  }
}
</script>

<style scoped>
/* Your scoped styles here */
</style>
