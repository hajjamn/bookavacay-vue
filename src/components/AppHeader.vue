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
        case '/search':
          return 'search-header';
      }
    });

    return { headerClass };
  },
  methods: {
    // performSearch() {
    //   this.$router.push({ name: 'research', query: { q: this.searchQuery } });
    // }
    search() {
      if (this.query) {
        this.$router.push({ name: 'search', query: { q: this.query } });
      }
    }
  },

  components: {
  },
  data() {
    return {
      // searchQuery: ''
      query: ''
    }
  }
}

</script>

<template>

  <header :class="headerClass">
    <div class="header-container">
      <div class="header-row">
        <img class="logo-home" src="/public/img/BookaVacay_01.png">
        <RouterLink to="/" class="back-home">
          <img class="logo" src="/public/img/BookaVacay_02.png">
        </RouterLink>
        <form action="" class="search-home">
          <input type="text" v-model="query" @keyup.enter="search" placeholder="Search..." :key="query">
          <RouterLink to="/search">
            <button @click="search"><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
          </RouterLink>
        </form>
        <h1 class="search-title">Apartments advanced research</h1>

        <div class="register-btn">
          <a href="http://127.0.0.1:8000/register"><span class="register-btn-one">Register</span></a>
          <a href="http://127.0.0.1:8000/login"><span class="underline">or log in</span></a>
        </div>

      </div>
    </div>
    <!-- <RouterLink class="link-home" to="home">Home</RouterLink> -->
  </header>



</template>

<style></style>