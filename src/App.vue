<script>
import { store } from './store.js'
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
    }
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
