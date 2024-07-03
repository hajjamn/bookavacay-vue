<script>
import { RouterLink } from 'vue-router';


export default {
  components: {
  },
  data() {
    return {
    }
  }
}

</script>

<template>

  <header>
    <div class="header-container">
      <div class="header-row">
        <img class="logo" src="/public/img/BookaVacay_01.png">
        <form action="">
          <input type="text">
          <button><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
        </form>
        <a>Register <br><span class="underline">or log in</span></a>
      </div>
    </div>
    <!-- <RouterLink class="link-home" to="home">Home</RouterLink> -->
  </header>


</template>

<style></style>