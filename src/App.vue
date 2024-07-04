<script>
import { store } from './store.js'
import axios from 'axios'
import AppHeader from './components/AppHeader.vue'
import AppContent from './components/AppContent.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppContent,
    AppFooter,
  },
  data() {
    return {
      store,
      apartments: [],
    }
  },
  methods: {
    fetchApartments(perPage) {
      axios.get('http://127.0.0.1:8000/api/apartments', {
        params: {
          perPage
        }
      })
        .then(res => {
          this.apartments = res.data
          console.log(this.apartments)
        })
    }
  },
  created() {
    /* this.fetchApartments(6) */
  }
}

</script>

<template>


  <AppHeader></AppHeader>
  <!-- <AppContent></AppContent> -->
  <RouterLink to="/">Go home</RouterLink>
  <RouterLink to="/search">Go search</RouterLink>
  <RouterLink to="/research">Go research</RouterLink>
  <RouterView />
  <!-- <AppFooter></AppFooter> -->


</template>

<style lang="scss">
@use './assets/style/general.scss';
@use 'bootstrap';
</style>
