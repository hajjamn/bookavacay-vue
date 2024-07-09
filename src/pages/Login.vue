<script>
export default {
  data() {
    return {
      password: null,
      email: null,
      userToken: null,
      typeToken: null,
    };
  },
  methods: {
    getUser() {
      axios
        .post(
          `http://127.0.0.1:8000/api/auth/login?email=${this.email}&password=${this.password}`
        )
        .then((res) => {
          this.userToken = res.data.accessToken;
          this.typeToken = res.data.token_type;
        });
      axios
        .get(`http://127.0.0.1:8000/api/auth/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `${this.typeToken} ${this.userToken}`,
          },
        })
        .then((res) => {
          console.log(res);
        });
    },
  },
};
</script>

<template>
  <main>
    <form class="container">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          type="password"
          class="form-control mb-3"
          id="exampleInputPassword1"
          placeholder="Password"
        />
      </div>
      <button type="submit" class="btn btn-primary mb-5">Submit</button>
    </form>
  </main>
</template>

<style scoped></style>
