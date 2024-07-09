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
  <div>
    <main>
      <span v-if="tokenSet">LOGGED IN WITH SUCCESS</span>
      <div v-else>
        <div>
          <label for="email">Email:</label>
          <input type="email" name="email" v-model="email" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" name="password" v-model="password" />
        </div>
        <button class="btn btn-primary mb-5" @click="getUser">Cliccami</button>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
