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
  components: {
  },
  data() {
    return {
      // searchQuery: ''
      query: {
        latitude: '',
        longitude: '',
        address: ''
      },
    }
  },
  methods: {
    // performSearch() {
    //   this.$router.push({ name: 'research', query: { q: this.searchQuery } });
    // }
    search() {
      if (this.query) {
        this.$router.push({ name: 'search', query: { q: this.query } });
      }
    },
    initializeSearchBox() {
      //Controlliamo se tt e tt.services sono definiti
      if (
        typeof tt !== "undefined" &&
        typeof tt.services !== "undefined"
      ) {
        //Sono definiti, procediamo!
        console.log('tt and tt.services not undefined')

        //Inizializzazione della searchbox
        let searchBoxOptions = {
          //Opzioni necessarie per la fuzzy search
          searchOptions: {
            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
            language: "en-GB",
            limit: 5
          },
          autocompleteOptions: {
            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
            language: "en-GB",
          },
          noResultsMessage: "No results found.",
        };

        //Se non esiste gia' un elemento con id 'search-input'
        if (!document.getElementById("search-input")) {

          //inizializza una searchBox con il plugin di tom tom, passando per i tt.services e le opzioni di prima
          let ttSearchBox = new tt.plugins.SearchBox(tt.services, searchBoxOptions);
          //Rendi la searchbox inizializzata un elemento HTML e inseriscilo come figlio di #searchbar
          let searchBoxHTML = ttSearchBox.getSearchBoxHTML();
          document.getElementById("header-searchbar").appendChild(searchBoxHTML);
          searchBoxHTML.id = "search-input";
        }


      } else {
        //Non sono definiti quindi RIP
        console.log('tt or tt.services undefined')
      }
    }
  },
  mounted() {
    this.initializeSearchBox()
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
          <div @keyup.enter="search" placeholder="Search..." id="header-searchbar" :key="query"></div>
          <RouterLink to="/search">
            <button @click="search"><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
          </RouterLink>
        </form>
        <h1 class="search-title">Apartments advanced research</h1>

        <div class="register-btn">
          <a href="http://127.0.0.1:8000/register"><span>Register</span></a>
          <br>
          <a href="http://127.0.0.1:8000/login"><span class="underline">or log in</span></a>
        </div>

      </div>
    </div>
    <!-- <RouterLink class="link-home" to="home">Home</RouterLink> -->
  </header>



</template>

<style>
#header-searchbar .tt-search-box-input-container,
#header-searchbar .-focus,
#header-searchbar .-focused {
  border: 0 !important;
  transition: none !important;
  border-color: white !important;
}

#header-searchbar svg {
  display: none;
}
</style>