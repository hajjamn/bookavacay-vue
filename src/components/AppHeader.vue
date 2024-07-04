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
    performSearch() {
      this.$router.push({ name: 'research', query: { q: this.searchQuery } });
    }
  },

  components: {
  },
  data() {
    return {
      searchQuery: ''
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
          <input type="text">
          <RouterLink to="/search">
            <button><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
          </RouterLink>
        </form>
        <h1 class="search-title">Apartments advanced research</h1>
        <a class="register-btn">Register <br><span class="underline">or log in</span></a>
      </div>
    </div>
    <!-- <RouterLink class="link-home" to="home">Home</RouterLink> -->
  </header>



</template>

<style></style>