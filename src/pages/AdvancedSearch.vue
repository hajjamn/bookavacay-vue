<script>
import axios from "axios";
import { calculateDistance } from "../functions.js";
import { getImageUrl } from "../functions.js";

export default {
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
      query: this.$route.query,
      results: [],
      servicesList: []
    };
  },
  methods: {
    getImageUrl,
    fetchResults() {
      axios.get('http://127.0.0.1:8000/api/apartments/search?latitude=44.49508802535032&longitude=11.34181285319268', { params: { q: this.query } })
        .then(response => {
          this.results = response.data;
        });
      console.log(this.results);
    },
    fetchServices() {
      axios
        .get("http://127.0.0.1:8000/api/apartments/services")
        .then((response) => {
          this.servicesList = response.data.services;
          // console.log(this.servicesList)
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
    },
    submitForm() {
      this.isSearching = true; // Set isSearching to true before API call
      axios
        .post("http://127.0.0.1:8000/api/apartments/search", {
          latitude: this.latitude,
          longitude: this.longitude,
          address: this.address,
          beds: this.beds,
          rooms: this.rooms,
          services: this.services,
          distance: this.distance,
        })
        .then((response) => {
          this.apartments = response.data.apartments;
          console.log("Form submitted successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
        .finally(() => {
          this.isSearching = false; // Reset isSearching after API call completes
          this.pastSearches = true;
        });
    },
    automaticSearch() {
      // console.log(this.query)
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
          center: [this.query.lon, this.query.lat],
          zoom: 15,
        });

        // inizializza il marker
        let marker = new tt.Marker({
          draggable: false,
        })
          // setta LAT e LON del marker e aggiungilo alla mappa
          .setLngLat(this.query.lon, this.query.lat)
          .addTo(map);

        // Quando il marker viene spostato cambia la LAT e LON che vengono salvate
        marker.on("dragend", () => {
          let lngLat = marker.getLngLat();
          this.latitude = lngLat.lat;
          this.longitude = lngLat.lng;

          // Servizi di TomTom (ricerca, distanza, ecc...)
          tt.services
            // Chiama la funzione reverseGeocode() passando Key e coordinate salvate
            .reverseGeocode({
              key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
              position: { lng: this.query.lon, lat: this.query.lat },
            })
            // Imposta l'indirizzo (userAddress) e salvalo in this.address
            .then((response) => {
              let userAddress = response.addresses[0].address.freeformAddress;
              this.address = userAddress;
            })
            .catch((error) => {
              console.error("Reverse geocode error:", error);
            });
        });

        // //Se necessaria la geolocalizzazione dello user
        // if (navigator.geolocation) {
        //   // Imposta la localizzazione dello user recuperando la sua posizione attuale
        //   navigator.geolocation.getCurrentPosition((position) => {
        //     let userLocation = [
        //       position.coords.longitude,
        //       position.coords.latitude,
        //     ];
        //     // Fai coincidere il centro della mappa e il marker con la posizione dello user (userPosition è un array con LAT e LON, è definita solo qui dentro)
        //     map.setCenter(userLocation);
        //     marker.setLngLat(userLocation);
        //     this.latitude = userLocation[1];
        //     this.longitude = userLocation[0];
        //     // console.log("Initial user location loaded.");
        //     // console.log("latitude:" + this.latitude);
        //     // console.log("longitude:" + this.longitude);

        //     // Servizi di TomTom (ricerca, distanza, ecc...)
        //     tt.services
        //       // Chiama la funzione reverseGeocode() passando Key e coordinate salvate
        //       .reverseGeocode({
        //         key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
        //         position: userLocation,
        //       })
        //       // Imposta l'indirizzo (userAddress) e salvalo in this.address
        //       .then((response) => {
        //         let address = response.addresses[0].address.freeformAddress;
        //         this.address = address;
        //         // console.log("Address:" + this.address);
        //       })
        //       .catch((error) => {
        //         console.error("Reverse geocode error:", error);
        //       });
        //   });
        // }

        // // Inizializzazione searchbox 
        // let searchBoxOptions = {
        //   // Opzioni necessarie per la fuzzy search (Key, lingua, limite(?))
        //   searchOptions: {
        //     key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
        //     language: "en-GB",
        //     limit: 5,
        //   },
        //   // Opzioni necessarie per l'autocompletamento (Key, lingua)
        //   autocompleteOptions: {
        //     key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
        //     language: "en-GB",
        //   },
        //   noResultsMessage: "No results found.",
        // };

        // // Se non esiste già un elemento con id 'search-input'
        // if (!document.getElementById("search-input")) {
        //   // Inizializza una searchBox tramite plugin di TomTom, passando i tt.services e le opzioni per Fuzzy search e autocompletamento
        //   let ttSearchBox = new tt.plugins.SearchBox(
        //     tt.services,
        //     searchBoxOptions
        //   );
        //   // Rendi la searchbox inizializzata un elemento HTML e inseriscilo come 'figlio' di #searchbar
        //   let searchBoxHTML = ttSearchBox.getSearchBoxHTML();
        //   document.getElementById("searchbar").appendChild(searchBoxHTML);
        //   searchBoxHTML.id = "search-input";

        //   // Prendi le informazioni passate dalla searchbar e impostale come coordinate salvate, centratura della mappa e del marker
        //   ttSearchBox.on("tomtom.searchbox.resultselected", (data) => {
        //     let result = data.data.result;
        //     let lngLat = result.position;
        //     map.setCenter(lngLat);
        //     marker.setLngLat(lngLat);
        //     this.latitude = lngLat.lat;
        //     this.longitude = lngLat.lng;
        //     this.address = result.address.freeformAddress;
        //   });

        //   // Quando viene inserito un input nella searchbar 
        //   searchBoxHTML.addEventListener("input", (event) => {
        //     // Imposta query come il valore inserito nell'input
        //     let query = event.target.value;
        //     tt.services
        //       // effettua fuzzy search
        //       .fuzzySearch({
        //         key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
        //         query: query,
        //         language: "en-GB",
        //       })
        //       // In base alla risposta della fuzzy search setta le coordinate, centratura mappa, marker e indirizzo
        //       .then((response) => {
        //         if (response.results && response.results.length > 0) {
        //           let result = response.results[0];
        //           let lngLat = result.position;
        //           map.setCenter(lngLat);
        //           marker.setLngLat(lngLat);
        //           this.latitude = lngLat.lat;
        //           this.longitude = lngLat.lng;
        //           this.address = result.address.freeformAddress;
        //           // console.log("Searchbox used.");
        //           // console.log("latitude:" + this.latitude);
        //           // console.log("longitude:" + this.longitude);
        //         }
        //       });
        //   });
        // }
      } else {
        console.error("TomTom SDK not loaded properly.");
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeMap();
    });
    this.searchQuery = this.$route.query.q;
    this.fetchServices();
    this.automaticSearch();
    /* this.fetchResults(); */
  }
};
</script>

<template>
  <main>
    <section class="section-title mb-5">
      <div class="container-title">
        <div>
          <p>The best way</p>
          <p class="to-book">to book your next vacay</p>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div id="search-map">
          <div id="searchbar"></div>
          <div id="map"></div>
        </div>
      </div>
    </section>

    <div class="container py-5">
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
    </div>

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-7">
          <input type="hidden" v-model="latitude" name="latitude" />
          <input type="hidden" v-model="longitude" name="longitude" />
          <input type="hidden" v-model="address" name="address" />

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


          <!-- filter head -->

          <!-- PER ORA TI HO COMMENTATO LA TUA, POI VEDI COME MODIFICARE -->

          <!--           <div class="filter-box">
            <div class="filter-container">
              <img src="/public/img/icon_filter_01.png" alt="" />
              <p>More filters</p>
              <span><font-awesome-icon :icon="['fas', 'sort-down']" /></span>
            </div>
          </div> -->

          <div class="accordion mb-3" id="servicesAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Apartment Services**
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#servicesAccordion">
                <div class="accordion-body">
                  <div class="row">

                    <div class="col-2" v-for="service in servicesList">
                      <label :for="service.name">{{ service.name }}</label>
                      <input type="checkbox" name="services[]" :id="service.name" :value="service.id">
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <!-- filter body -->
            <div class="filter-box">
              <div class="all-filter-container">
                <div class="numeric-filters">
                  <div class="filter-num">
                    <p>Min beds:</p>
                    <input class="input-num" v-model="beds" name="beds" placeholder="0" />
                  </div>
                  <div class="filter-num">
                    <p>Min rooms:</p>
                    <input class="input-num" type="number" v-model="rooms" name="rooms" placeholder="0" />
                  </div>
                  <div class="filter-num">
                    <p>Search km radius:</p>
                    <input class="input-num" type="number" v-model="distance" name="distance" placeholder="20" />
                  </div>
                </div>
                <div class="filters-divider"></div>

                <!-- SERVONO SERVICES API -->
                <!-- <div class="filter-service">
                    <div v-for="service in services">
                        <input type="checkbox" name="" id="">
                        <p>{{ service.name }}</p>
                    </div>
                </div> -->
              </div>
            </div>


            <div class="row justify-content-center">
              <div class="col-auto">
                <label for="services">Services</label>
                <input type="number" v-model="services" name="services" />
              </div>
              <div class="col-auto text-center">
                <button @click="submitForm" id="form-submit" type="submit" class="btn btn-warning">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>

  <button class="btn btn-primary d-none" @click="console.log(apartments)">
    Test Apartments
  </button>

  <section id="articles" v-if="apartments.length > 0 || pastSearches || isSearching">
    <!-- La ricerca e' finita e abbiamo dei risultati -->
    <div class="container-article" v-if="apartments.length > 0 && !isSearching">
      <h1>Your results:</h1>
      <div class="row-article">
        <article v-for="apartment in apartments" class="col-article">
          <img :src="getImageUrl(apartment.image)" alt="" />
          <p>{{ apartment.title }}</p>
          <div class="container-article-info">
            <div class="article-info primo">
              <img class="icon-info" src="/public/img/icon_room_01.png" alt="" />
              <span>Rooms</span>
              <span>{{ apartment.rooms }}</span>
            </div>
            <div class="article-info secondo">
              <img class="icon-info" src="/public/img/icon_space_01.png" alt="" />
              <span>m ^2</span>
              <span>{{ apartment.sqr_mt }}</span>
            </div>
            <div class="article-info terzo">
              <img class="icon-info" src="/public/img/icon_room_01.png" alt="" />
              <span>Beds</span>
              <span>{{ apartment.beds }}</span>
            </div>
            <div class="article-info">
              <img class="icon-info" src="/public/img/icon_bathroom_01.png" alt="" />
              <span>Bathroom</span>
              <span>{{ apartment.bathrooms }}</span>
            </div>
          </div>
        </article>
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
</style>
