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
    },
    initializeMap() {
      if (
        typeof tt !== "undefined" &&
        typeof tt.map !== "undefined" &&
        typeof tt.services !== "undefined"
      ) {
        let map = tt.map({
          key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
          container: "map",
          center: [0, 0],
          zoom: 15,
        });

        let marker = new tt.Marker({
          draggable: true,
        })
          .setLngLat([0, 0])
          .addTo(map);

        marker.on("dragend", () => {
          let lngLat = marker.getLngLat();
          this.latitude = lngLat.lat;
          this.longitude = lngLat.lng;
          console.log('Marker dragged.')
          console.log('latitude:' + this.latitude);
          console.log('longitude:' + this.longitude);

          tt.services
            .reverseGeocode({
              key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
              position: lngLat,
            })
            .then((response) => {
              let userAddress = response.addresses[0].address.freeformAddress;
              this.address = userAddress;
            })
            .catch((error) => {
              console.error('Reverse geocode error:', error);
            });
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            map.setCenter(userLocation);
            marker.setLngLat(userLocation);
            this.latitude = userLocation[1];
            this.longitude = userLocation[0];
            console.log('Initial user location loaded.')
            console.log('latitude:' + this.latitude);
            console.log('longitude:' + this.longitude);

            tt.services
              .reverseGeocode({
                key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                position: userLocation,
              })
              .then((response) => {
                let address = response.addresses[0].address.freeformAddress;
                this.address = address;
                console.log('Address:' + this.address)
              })
              .catch((error) => {
                console.error('Reverse geocode error:', error);
              });
          });
        }

        let searchBoxOptions = {
          searchOptions: {
            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
            language: "en-GB",
            limit: 5,
          },
          autocompleteOptions: {
            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
            language: "en-GB",
          },
          noResultsMessage: "No results found.",
        };

        if (!document.getElementById("search-input")) {
          let ttSearchBox = new tt.plugins.SearchBox(tt.services, searchBoxOptions);
          let searchBoxHTML = ttSearchBox.getSearchBoxHTML();
          document.getElementById("searchbar").appendChild(searchBoxHTML);
          searchBoxHTML.id = "search-input";

          ttSearchBox.on("tomtom.searchbox.resultselected", (data) => {
            let result = data.data.result;
            let lngLat = result.position;
            map.setCenter(lngLat);
            marker.setLngLat(lngLat);
            this.latitude = lngLat.lat;
            this.longitude = lngLat.lng;
            this.address = result.address.freeformAddress;
          });

          searchBoxHTML.addEventListener("input", (event) => {
            let query = event.target.value;
            tt.services
              .fuzzySearch({
                key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                query: query,
                language: "en-GB",
              })
              .then((response) => {
                if (response.results && response.results.length > 0) {
                  let result = response.results[0];
                  let lngLat = result.position;
                  map.setCenter(lngLat);
                  marker.setLngLat(lngLat);
                  this.latitude = lngLat.lat;
                  this.longitude = lngLat.lng;
                  this.address = result.address.freeformAddress;
                  console.log('Searchbox used.');
                  console.log('latitude:' + this.latitude);
                  console.log('longitude:' + this.longitude);
                }
              });
          });
        }
      } else {
        console.error("TomTom SDK not loaded properly.");
      }
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
      <div class="container">
        <div id="search-map">
          <div id="searchbar"></div>
          <div id="map"></div>
        </div>
      </div>
      <div class="header-row">
        <img class="logo-home" src="/public/img/BookaVacay_01.png">
        <RouterLink to="/" class="back-home">
          <img class="logo" src="/public/img/BookaVacay_02.png">
        </RouterLink>
        <form action="" class="search-home">
          <!-- <input v-model="searchQuery" type="text"> -->
          <RouterLink to="/search">
            <button @onclick="performSearch()"><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
          </RouterLink>
        </form>
        <h1 class="search-title">Apartments advanced research</h1>
        <a class="register-btn">Register <br><span class="underline">or log in</span></a>
      </div>
    </div>
    <!-- <RouterLink class="link-home" to="home">Home</RouterLink> -->
  </header>



</template>

<style scoped>
#searchbar {
  width: 300px;
  height: 30px;
}
</style>