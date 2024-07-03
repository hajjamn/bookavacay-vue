<script>
import { store } from './store.js'
import axios from 'axios'
import AppHeader from './components/AppHeader.vue'
import AppContent from './components/AppContent.vue'
import AppFooter from './components/AppFooter.vue'

export default {
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
    fetchApartments() {
      axios.get('http://127.0.0.1:8000/api/apartments').then(res => {
        this.apartments = res.data
        console.log(this.apartments)
      })
    }
  },
  created() {
    this.fetchApartments()
  }
}

</script>

<template>


  <AppHeader></AppHeader>
  <!-- <AppContent></AppContent> -->
  <RouterView />
  <!-- <AppFooter></AppFooter> -->


</template>

<style lang="scss">
@use './assets/style/general.scss';
@use 'bootstrap';
</style>
