<script>
import axios from "axios";
export default {
  data() {
    return {
      password: null,
      email: null,
      userToken: null,
      typeToken: null,
      tokenSet: false,
      name: null,
    };
  },
  computed: {
    sessionUserToken() {
      return sessionStorage.getItem("sessionUserToken");
    },
  },
  watch: {
    sessionUserToken(newToken) {
      if (newToken) {
        this.tokenSet = true;
      }
    },
  },
  methods: {
    getUser() {
      axios
        .post(`http://127.0.0.1:8000/api/auth/login`, {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          this.userToken = res.data.accessToken;
          this.typeToken = res.data.token_type;
          const sessionUserToken = `${this.typeToken} ${this.userToken}`;
          sessionStorage.setItem("sessionUserToken", sessionUserToken);
          sessionStorage.setItem("sessionUserEmail", this.email);

          // Perform the second axios call within the same then block
          return axios.get("http://127.0.0.1:8000/api/auth/user", {
            headers: {
              Accept: "application/json",
              Authorization: `${this.typeToken} ${this.userToken}`,
            },
          });
        })
        .then((res) => {
          sessionStorage.setItem("sessionUserName", res.data.name);
          // Optionally, you can reload the page here if needed
          window.location.reload();
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
  },
  mounted() {
    if (this.sessionUserToken) {
      this.tokenSet = true;
    }
  },
};
</script>

<template>
    <main class="container-sm">
      <span v-if="tokenSet" class="success-container">
        <div class="login-succes">
          You're logged in
        </div>
        <!-- <button class="button-login">
          <a href="http://127.0.0.1:8000/admin.dashboard">Go to your dashboard</a>
        </button> -->
      </span>
      <div v-else>
        <div class="container-login">
          <div>
            <label for="email">Email:</label>
            <input class="input-container-login" type="email" name="email" v-model="email" />
          </div>
          <div>
            <label for="password">Password:</label>
            <input class="input-container-login" type="password" name="password" v-model="password" />
          </div>
          <button class="button-login" @click="getUser">Log in</button>
          <a class="button-login-reg" href="http://127.0.0.1:8000/register">Don't have an account? Register now!</a>
        </div>
      </div>
    </main>
</template>

<style scoped></style>
