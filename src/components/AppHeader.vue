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
        <img class="logo" src="/public/img/BookaVacay_01.png">
        <form action="">
          <input type="text" v-model="searchQuery">
          <button @click="performSearch"><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
        </form>
        <a>Register <br><span class="underline">or log in</span></a>
      </div>
    </div>
    <!-- <RouterLink class="link-home" to="home">Home</RouterLink> -->
  </header>


</template>

<style></style>