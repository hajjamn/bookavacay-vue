<script>
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import { computed } from 'vue';


export default {
  setup() {
    const route = useRoute();

    const headerClass = computed(() => {
      switch (route.path) {
        case '/':
          return 'home-header';
        case '/research':
          return 'research-header';
      }
    });

    return { headerClass };
  },

  components: {
  },
  data() {
    return {
    }
  }
}

</script>

<template>

  <header :class="headerClass">
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

<style>
</style>