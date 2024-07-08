<script>
import axios from "axios";
import { calculateDistance } from "../functions.js";
import { getImageUrl } from "../functions.js";

export default {
  props: [
    'queryLatitude',
    'queryLongitude',
    'queryAddress'
  ],
  data() {
    return {
      apartments: [],
      latitude: 0,
      longitude: 0,
      address: "",
      searchQuery: "",
      beds: null,
      rooms: null,
      distance: null,
      services: null,
      isSearching: false,
      pastSearches: false,
      results: [],
      servicesList: [],
      currentPage: 1,
      lastPage: null,
      ttSearchBox: null,
      searchBoxHTML: null,
      showFilters: false,
      filtersVisible: false,
    };
  },
  methods: {
    toggleFilters() {
      this.filtersVisible = !this.filtersVisible;
      this.showFilters = !this.showFilters;
    },
    getImageUrl,
    fetchResults() {
      axios.get('http://127.0.0.1:8000/api/apartments/search?latitude=44.49508802535032&longitude=11.34181285319268', { params: { q: this.query } })
        .then(response => {
          this.results = response.data;
        });
    },
    fetchServices() {
      axios
        .get("http://127.0.0.1:8000/api/apartments/services")
        .then((response) => {
          this.servicesList = response.data.services;
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
    },
    validateForm() {
      if (this.beds < 0 || this.rooms < 0 || this.distance < 0) {
        alert("Beds, rooms, and distance must be non-negative values.");
        return false;
      }
      return true;
    },
    submitForm(n) {
      if (!this.validateForm()) {
        return;
      }
      this.isSearching = true; // Set isSearching to true before API call
      console.log(n)
      axios
        .post("http://127.0.0.1:8000/api/apartments/search", {
          latitude: this.latitude,
          longitude: this.longitude,
          address: this.address,
          beds: this.beds,
          rooms: this.rooms,
          services: this.services,
          distance: this.distance,
          page: n
        })
        .then((response) => {
          /* this.apartments = response.data.apartments; */
          let paginatedResults = response.data.apartments
          this.apartments = paginatedResults.data
          this.currentPage = paginatedResults.current_page
          this.lastPage = paginatedResults.last_page
          console.log("Form submitted successfully:", paginatedResults);
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
        .finally(() => {
          this.isSearching = false; // Reset isSearching after API call completes
          this.pastSearches = true;
        });
    },
    initializeMap() {

      // tt è l'oggetto con tutte le info di tomtom,
      // tt.map ha le info della mappa 
      // tt.services ha tutte le informazioni aggiuntive (ricerca, distanza, ecc...) 

      // Se tt, tt.map, tt.services NON sono undefined => crea la mappa
      if (
        typeof tt !== "undefined" &&
        typeof tt.map !== "undefined" &&
        typeof tt.services !== "undefined"
      ) {
        // Inizializza la mappa con TomTom Key, indicazione di dove inserirla nel HTML, dove centrarla e zoom
        let map = tt.map({
          key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
          container: "map",
          center: [0, 0],
          zoom: 15,
        });
        console.log('Map set')

        // inizializza il marker
        let marker = new tt.Marker({
          draggable: true,
        })
          // setta LAT e LON del marker e aggiungilo alla mappa
          .setLngLat([0, 0])
          .addTo(map);

        console.log('Marker set')
        // Quando il marker viene spostato cambia la LAT e LON che vengono salvate
        marker.on("dragend", () => {
          let lngLat = marker.getLngLat();
          this.latitude = lngLat.lat;
          this.longitude = lngLat.lng;

          console.log('Listening to marker drag')

          // Servizi di TomTom (ricerca, distanza, ecc...)
          tt.services
            // Chiama la funzione reverseGeocode() passando Key e coordinate salvate
            .reverseGeocode({
              key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
              position: lngLat,
            })
            // Imposta l'indirizzo (userAddress) e salvalo in this.address
            .then((response) => {
              let userAddress = response.addresses[0].address.freeformAddress;
              this.address = userAddress;
              console.log('Address and coordinates set at: ', lngLat)
            })
            .catch((error) => {
              console.error("Reverse geocode error:", error);
            });
        });

        //Se e' stata mandata una query con le props allora prendi quelle coordinate e indirizzo
        if (this.queryLatitude !== undefined) {
          //recupera i dati della query
          let queryLocation = [
            this.queryLongitude,
            this.queryLatitude,
          ];
          console.log('Query found with this data: ', queryLocation, this.queryAddress)
          //centra la mappa e il marker su quelle coordinate
          map.setCenter(queryLocation);
          marker.setLngLat(queryLocation);
          this.latitude = queryLocation[1];
          this.longitude = queryLocation[0];
          this.address = this.queryAddress;
          console.log('Location updated: ', this.latitude, this.longitude, this.address)
        }
        //Altrimenti, se necessaria la geolocalizzazione dello user
        else if (navigator.geolocation) {
          // Imposta la localizzazione dello user recuperando la sua posizione attuale
          navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            // Fai coincidere il centro della mappa e il marker con la posizione dello user (userPosition è un array con LAT e LON, è definita solo qui dentro)
            map.setCenter(userLocation);
            marker.setLngLat(userLocation);
            this.latitude = userLocation[1];
            this.longitude = userLocation[0];
            console.log('Query not found, data now is: ', this.latitude, this.longitude)
            console.log('Moved the marker to user location')


            // Servizi di TomTom (ricerca, distanza, ecc...)
            tt.services
              // Chiama la funzione reverseGeocode() passando Key e coordinate salvate
              .reverseGeocode({
                key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                position: userLocation,
              })
              // Imposta l'indirizzo (userAddress) e salvalo in this.address
              .then((response) => {
                let address = response.addresses[0].address.freeformAddress;
                this.address = address;
                console.log("Address:" + this.address);
              })
              .catch((error) => {
                console.error("Reverse geocode error:", error);
              });
          });
        }

        // Inizializzazione searchbox 
        let searchBoxOptions = {
          // Opzioni necessarie per la fuzzy search (Key, lingua, limite(?))
          searchOptions: {
            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
            language: "en-GB",
            limit: 5,
          },
          // Opzioni necessarie per l'autocompletamento (Key, lingua)
          autocompleteOptions: {
            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
            language: "en-GB",
          },
          noResultsMessage: "No results found.",
        };

        // Se non esiste già un elemento con id 'advanced-search-input'
        if (!document.getElementById("advanced-search-input")) {
          // Inizializza una searchBox tramite plugin di TomTom, passando i tt.services e le opzioni per Fuzzy search e autocompletamento
          this.ttSearchBox = new tt.plugins.SearchBox(
            tt.services,
            searchBoxOptions
          );
          // Rendi la searchbox inizializzata un elemento HTML e inseriscilo come 'figlio' di #searchbar
          this.searchBoxHTML = this.ttSearchBox.getSearchBoxHTML();
          document.getElementById("searchbar").appendChild(this.searchBoxHTML);
          this.searchBoxHTML.id = "advanced-search-input";
          console.log('Child appended')

        } else {
          console.log('Ho trovato un search input')
        }

        // Prendi le informazioni selezionate dai suggerimenti e impostale come coordinate salvate, centratura della mappa e del marker
        this.ttSearchBox.on("tomtom.searchbox.resultselected", (data) => {
          let result = data.data.result;
          let lngLat = result.position;
          map.setCenter(lngLat);
          marker.setLngLat(lngLat);
          this.latitude = lngLat.lat;
          this.longitude = lngLat.lng;
          this.address = result.address.freeformAddress;
        });

        // Quando viene inserito un input nella searchbar 
        this.searchBoxHTML.addEventListener("input", (event) => {
          // Imposta query come il valore inserito nell'input
          let query = event.target.value;
          tt.services
            // effettua fuzzy search
            .fuzzySearch({
              key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
              query: query,
              language: "en-GB",
            })
            // In base alla risposta della fuzzy search setta le coordinate, centratura mappa, marker e indirizzo
            .then((response) => {
              if (response.results && response.results.length > 0) {
                let result = response.results[0];
                let lngLat = result.position;
                map.setCenter(lngLat);
                marker.setLngLat(lngLat);
                this.latitude = lngLat.lat;
                this.longitude = lngLat.lng;
                this.address = result.address.freeformAddress;
                // console.log("Searchbox used.");
                // console.log("latitude:" + this.latitude);
                // console.log("longitude:" + this.longitude);
              }
            });
        });

      } else {
        console.error("TomTom SDK not loaded properly.");
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeMap();
      if (this.queryLatitude !== undefined) {
        // Wait for the map initialization to complete before calling submitForm()
        setTimeout(() => {
          this.submitForm(1);
        }, 1000);
      }
    });
    this.fetchServices();
    /* this.fetchResults(); */
    console.log('myQuery: ', this.$route.params);
  }

};
</script>

<template>
  <main>

    <!-- MAP -->
    <section>
      <div class="container-map-search">
        <div id="search-map" class="map-flex">
          <div id="searchbar" class="searchbar-style"></div>
          <div id="map"></div>
        </div>
      </div>
    </section>

    <!-- USER GEO-DATA -->
    <!-- <div class="container py-5">
      <div class="card">
        <div class="row justify-content-evenly text-center">
          <div class="col-auto p-3">
            <p>User latitude: {{ latitude }}</p>
          </div>
          <div class="col-auto p-3">
            <p>User longitude: {{ longitude }}</p>
          </div>
          <div class="col-auto p-3">
            <p>User address: {{ address }}</p>
          </div>
        </div>
      </div>
    </div> -->

    <div>
      <div class="flex justify-content-center">
        <div class="col-md-7">
          <input type="hidden" v-model="latitude" name="latitude" />
          <input type="hidden" v-model="longitude" name="longitude" />
          <input type="hidden" v-model="address" name="address" />

          <!-- SEARCH BASE INPUT -->
          <!-- <div>
              <label for="rooms">Rooms</label>
              <input type="number" v-model="rooms" name="rooms">
            </div>
            <div>
              <label for="beds">Beds</label>
              <input type="number" v-model="beds" name="beds">
            </div>
            <div>
              <label for="distance">Distance</label>
              <input type="number" v-model="distance" name="distance">
            </div> -->
          <!-- <div class="col-auto">
              <label for="services">Services</label>
              <input type="number" v-model="services" name="services" />
            </div> -->


          <!-- filter head -->
          <div class="filter-box">
            <button class="filter-container" type="button" :class="{ 'border-radius': !filtersVisible }"
              @click="toggleFilters">
              <img src="/public/img/icon_filter_01.png" alt="" />
              <p>More filters</p>
            </button>
          </div>

          <!-- filter body -->
          <div>
            <div class="all-filter-container" v-show="showFilters">
              <div class="numeric-filters">
                <div class="filter-num">
                  <p>Min beds:</p>
                  <input class="input-num" type="number" v-model="beds" name="beds" placeholder="1" min="1" />
                </div>
                <div class="filter-num">
                  <p>Min rooms:</p>
                  <input class="input-num" type="number" v-model="rooms" name="rooms" placeholder="1" min="1" />
                </div>
                <div class="filter-num">
                  <p>Search km radius:</p>
                  <input class="input-num" type="number" v-model="distance" name="distance" placeholder="20" min="1" />
                </div>
              </div>
              <div class="filters-divider"></div>

              <!-- Services -->
              <ul class="services-container">
                <li class="service-box" v-for="service in servicesList">
                  <label class="container-checkbox">
                    <input class="checkbox" type="checkbox" name="services[]" :id="service.name" :value="service.id">
                    <span class="checkmark"></span>
                  </label>
                  <label :for="service.name">{{ service.name }}</label>
                </li>
              </ul>
            </div>
          </div>


          <div class="row justify-content-center">
            <div class="col-auto text-center">
              <button @click="submitForm(1)" id="form-submit" type="submit" class="btn btn-warning mt-3">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>

  <button class="btn btn-primary d-none" @click="console.log(apartments)">
    Test Apartments
  </button>

  <section class="container-search" v-if="apartments.length > 0 || pastSearches || isSearching">
    <!-- La ricerca e' finita e abbiamo dei risultati -->
    <div class="container-search-results" v-if="apartments.length > 0 && !isSearching">
      <h1>Your results:</h1>

      <!-- Singolo apartamento ciclato -->
      <div v-for="apartment in apartments">
        <router-link :to="'/apartments/' + apartment.id" class="search-apartment-detail-card">
          <!-- IMMAGINE SINISTRA -->
          <div>
            <img class="search-image-container" :src="getImageUrl(apartment.image)" alt="">
          </div>
          <!-- DATI DESTRA -->
          <div class="search-data-container">
            <div>
              <h2>{{ apartment.title }}</h2>
              <h5>{{ apartment.address }}</h5>
            </div>
            <div class="search-detail-container">
                <div class="search-detail-info">
                  <img class="search-icon-detail" src="/public/img/icon_room_01.png" alt="">
                  <span>Rooms</span>
                  <span>{{ apartment.rooms }}</span>
                </div>
                <div class="search-icon-divider"></div>
                <div class="search-detail-info">
                  <img class="search-icon-detail" src="/public/img/icon_space_01.png" alt="">
                  <span>m ^2</span>
                  <span>{{ apartment.sqr_mt }}</span>
                </div>
                <div class="search-icon-divider"></div>
                <div class="search-detail-info">
                  <img class="search-icon-detail" src="/public/img/icon_bed_01.png" alt="">
                  <span>Beds</span>
                  <span>{{ apartment.beds }}</span>
                </div>
                <div class="search-icon-divider"></div>
                <div class="search-detail-info">
                  <img class="search-icon-detail" src="/public/img/icon_bathroom_01.png" alt="">
                  <span>Bathroom</span>
                  <span>{{ apartment.bathrooms }}</span>
                </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Paginazione -->
      <div class="container nav-menu">
        <div class="row py-3 justify-content-center align-items-baseline">
          <div class="col-auto">
            <font-awesome-icon :class="currentPage === 1 ? 'nav-btn-disabled' : ''" class="fs-5 nav-btn"
              :icon="['fas', 'angles-left']" @click="submitForm(1)" />
          </div>
          <div class="col-auto" @click="">
            <font-awesome-icon :class="currentPage - 1 <= 0 ? 'nav-btn-disabled' : ''" class="fs-5 nav-btn"
              :icon="['fas', 'angle-left']" @click="submitForm(currentPage - 1)" />
          </div>
          <div class="col-auto">
            <span class="fs-4 nav-number">{{ currentPage }}</span>
          </div>
          <div class="col-auto">
            <font-awesome-icon :class="currentPage + 1 > lastPage ? 'nav-btn-disabled' : ''" class="fs-5 nav-btn"
              :icon="['fas', 'angle-right']" @click="submitForm(currentPage + 1)" />
          </div>
          <div class="col-auto">
            <font-awesome-icon :class="currentPage + 2 > lastPage ? 'nav-btn-disabled' : ''" class="fs-5 nav-btn"
              :icon="['fas', 'angles-right']" @click="submitForm(lastPage)" />
          </div>
        </div>
      </div>

    </div>

    <!-- La ricerca e' finita ma NON ci sono risultati -->
    <div class="container-article" v-if="apartments.length === 0 && pastSearches && !isSearching">
      <div class="row justify-content-center aling-items-center align-content-center h-100">
        <div class="col-auto">
          <h3>No results... try again!</h3>
        </div>
      </div>
    </div>

    <!-- La ricerca e' in corso -->
    <div class="container-article" v-if="isSearching">
      <div class="row justify-content-center aling-items-center align-content-center h-100">
        <div class="col-auto">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="svg-wave"></section>


</template>

<style scoped>
.loader {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #ffa516;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes l13 {
  100% {
    transform: rotate(1turn);
  }
}

.svg-wave {
  background-image: url("/public/img/wave.svg");
  background-size: contain;
  background-repeat: repeat-x;
  background-position: bottom center;
  min-width: 100%;
  height: 200px;
  padding: 0;
}

@media (max-width: 768px) {
  .svg-wave {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .svg-wave {
    height: 100px;
  }
}

#map {
  width: 100%;
  height: 500px;
}

#searchbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  width: 80%;
  max-width: 500px;
}

#search-map {
  position: relative;
}

.nav-number {
  color: var(--orange);
  cursor: default;
}

.nav-btn {
  cursor: pointer;
  color: var(--orange);
}

.nav-btn:hover {
  color: var(--light--orange);
}

.nav-btn-disabled {
  cursor: default;
  color: lightgrey;
  pointer-events: none;
}

.nav-menu a {
  color: currentColor;
  text-decoration: none;
}
</style>
