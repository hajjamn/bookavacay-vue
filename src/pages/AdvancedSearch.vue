<script>
import axios from "axios";
import { calculateDistance } from "../functions.js";
import { getImageUrl } from "../functions.js";

export default {
  data() {
    return {
      apartments: [],
      totalResults: [],
      latitude: 0,
      longitude: 0,
      address: "",
      searchQuery: "",
      beds: null,
      rooms: null,
      distance: null,
      selectedServices: [],
      isSettingMap: false,
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
      lastPage: null,
      markers: [],
      popupOffsets: {
        top: [0, 0],
        bottom: [0, -70],
        "bottom-right": [0, -70],
        "bottom-left": [0, -70],
        left: [25, -35],
        right: [-25, -35],
      },
    };
  },
  methods: {
    changePage(n, id) {
      if (n === this.currentPage) return;
      this.currentPage = n;
      if (id) {
        this.submitForm(this.currentPage, id)
      } else {
        this.submitForm(this.currentPage, 0);
      }

      if (id) {
        const interval = setInterval(() => {
          if (!this.isSearching) {
            clearInterval(interval);
            document.getElementById(`result${id}`).scrollIntoView({ behavior: 'smooth' });
          }
        }, 100); // Check every 100 milliseconds
      }
      console.log('Changing page to ', n + ' at ', id);
    },
    toggleFilters() {
      this.filtersVisible = !this.filtersVisible;
      this.showFilters = !this.showFilters;
    },
    getImageUrl,
    fetchResults() {
      axios
        .get(
          "http://127.0.0.1:8000/api/apartments/search?latitude=44.49508802535032&longitude=11.34181285319268",
          { params: { q: this.query, page: this.currentPage } }
        )
        .then((response) => {
          this.results = response.data;
          /* console.log(response.data.apartments.data); */
          this.apartments = response.data.apartments.data;
          this.lastPage = response.data.apartments.last_page;
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
        });
    },
    validateForm() {
      if (this.beds < 0 || this.rooms < 0 || this.distance < 0) {
        alert("Beds, rooms, and distance must be non-negative values.");
        return false;
      }
      return true;
    },
    submitForm(n, id) {
      console.log('Ricerca inizializzata con: ', n, id);

      // Function to perform the API call and update the results
      const performSearch = () => {
        if (!this.validateForm()) {
          return;
        }
        console.log('Comincio la ricerca');
        this.isSearching = true; // Set isSearching to true before API call
        axios
          .post("http://127.0.0.1:8000/api/apartments/search", {
            latitude: this.latitude,
            longitude: this.longitude,
            address: this.address,
            beds: this.beds,
            rooms: this.rooms,
            selectedServices: this.selectedServices,
            distance: this.distance,
            page: n,
          })
          .then((response) => {
            let paginatedResults = response.data.apartments;
            this.apartments = paginatedResults.data;
            this.totalResults = response.data.totalresults;
            this.numberOfResults = paginatedResults.total;
            this.currentPage = paginatedResults.current_page;
            this.lastPage = paginatedResults.last_page;
            console.log("Form submitted successfully:", this.apartments, this.totalResults);
          })
          .catch((error) => {
            console.error("Error submitting form:", error);
          })
          .finally(() => {
            this.isSearching = false; // Reset isSearching after API call completes
            this.pastSearches = true;
            this.addMarkers();

            // Scroll into view if id is provided
            if (id !== undefined) {
              console.log('Scorro verso id che mi hanno passato, ', id);
              this.$nextTick(() => {
                const retryScrollIntoView = (retryCount = 0) => {
                  const element = document.getElementById(`result${id}`);
                  if (element) {
                    console.log(`Found element with id result${id}`);
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else if (retryCount < 10) { // Retry up to 10 times
                    console.log(`Element with id result${id} not found, retrying... (${retryCount + 1})`);
                    setTimeout(() => retryScrollIntoView(retryCount + 1), 100); // Check every 100 milliseconds
                  } else {
                    console.warn(`Element with id result${id} not found after multiple retries`);
                  }
                };
                retryScrollIntoView();
              });
            }
          });
      };

      // Check if isSettingMap is false, otherwise wait until it becomes false
      if (this.isSettingMap) {
        console.log('La mappa si sta aggiornando');
        const interval = setInterval(() => {
          if (!this.isSettingMap) {
            console.log('La mappa ha finito');
            clearInterval(interval);
            performSearch();
          }
        }, 100); // Check every 100 milliseconds
      } else {
        performSearch();
      }
    },
    addMarkers() {
      // Reset all markers and make them invisible
      this.markers.forEach((marker, i) => {
        marker.setLngLat([0, 0]);
        document.getElementById(`marker${i}`).classList.add('invisible');
      });

      let resultNumberInPage = -1;

      // Iterate over all results
      for (let i = 0; i < this.totalResults.length; i++) {
        let apartment = this.totalResults[i];
        let popupHtml;
        let markerElement = document.getElementById(`marker${i}`);
        let popup;

        // For the first 6 results
        if (i < 6) {
          apartment = this.apartments[i];
          popupHtml = `
        <a href="#result${i}">
          <img class="popup-image" src="${getImageUrl(apartment.image)}" style="width:50%;float:right;">
          <p class="popup-title">${apartment.title}</p>
        </a>`;

          markerElement.classList.remove('invisible');
          popup = new tt.Popup({ offset: this.popupOffsets }).setHTML(popupHtml);

          this.markers[i]
            .setLngLat([apartment.longitude, apartment.latitude])
            .setPopup(popup);

        } else {
          if (resultNumberInPage < 5) {
            resultNumberInPage++;
          } else {
            resultNumberInPage = 0;
          }

          popupHtml = `
        <a id="popup${i}" href="#result${resultNumberInPage}">
          <img class="popup-image" src="${getImageUrl(apartment.image)}" style="width:50%;float:right;">
          <p class="popup-title">${apartment.title}</p>
        </a>`;

          markerElement.classList.remove('invisible');
          popup = new tt.Popup({ offset: this.popupOffsets }).setHTML(popupHtml);

          this.markers[i]
            .setLngLat([apartment.longitude, apartment.latitude])
            .setPopup(popup);

          // Add event listener with a closure to capture current iteration variables
          ((index, resultPos) => {
            popup.on('open', () => {
              document.getElementById(`popup${index}`).addEventListener('click', () => this.changePage(Math.floor(index / 6) + 1, resultPos));
            });
          })(i, resultNumberInPage);
        }
      }
    }
    ,
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
        this.isSettingMap = true;
        let map = tt.map({
          key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
          container: "map",
          center: [0, 0],
          zoom: 15,
        });

        // inizializza il marker
        let marker = new tt.Marker({
          draggable: true,
        })
          // setta LAT e LON del marker e aggiungilo alla mappa
          .setLngLat([0, 0])
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
              position: lngLat,
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

        // Creiamo i 50 marker jankissimi
        for (let i = 0; i < 60; i++) {
          // Marker
          let element = document.createElement("div");
          element.id = `marker${i}`;
          element.classList = 'invisible';
          // Popup
          this.markers[i] = new tt.Marker({
            element: element,
            draggable: false,
          })
            // setta LAT e LON del marker e aggiungilo alla mappa
            .setLngLat([i, i])
            .addTo(map);
        }

        // Se e' stata mandata una query con le props allora prendi quelle coordinate e indirizzo
        if (this.$route.query.queryLatitude !== undefined) {
          // recupera i dati della query
          let queryLocation = [
            this.$route.query.queryLongitude,
            this.$route.query.queryLatitude,
          ];
          // centra la mappa e il marker su quelle coordinate
          map.setCenter(queryLocation);
          marker.setLngLat(queryLocation);
          this.latitude = queryLocation[1];
          this.longitude = queryLocation[0];
          this.address = this.$route.query.queryAddress;
          this.isSettingMap = false; // Set isSettingMap to false after setting query location
        }
        // Altrimenti, se necessaria la geolocalizzazione dello user
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
                this.isSettingMap = false; // Set isSettingMap to false here
              })
              .catch((error) => {
                console.error("Reverse geocode error:", error);
                this.isSettingMap = false; // Set isSettingMap to false on error
              });
          }, () => {
            this.isSettingMap = false; // Set isSettingMap to false if geolocation fails
          });
        } else {
          this.isSettingMap = false; // Set isSettingMap to false if no query or geolocation
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
              }
            });
        });
      } else {
        console.error("TomTom SDK not loaded properly.");
        this.isSettingMap = false;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeMap();
      // Se hai effettuato una ricerca dalla home, fai la ricerca automatica con quei parametri
      if (this.$route.query.queryHomeSearch) {
        this.latitude = this.$route.query.queryLatitude
        this.longitude = this.$route.query.queryLongitude
        this.address = this.$route.query.queryAddress
        this.submitForm(1);
        console.log('Query home found')
      } else if (this.$route.query.queryBack) {
        this.beds = this.$route.query.queryBeds;
        this.rooms = this.$route.query.queryRooms;
        this.selectedServices = this.$route.query.queryServices;
        this.distance = this.$route.query.queryDistance;
        this.submitForm(this.$route.query.queryPage, this.$route.query.queryPosition);
        console.log('Query back con: ', this.$route.query.queryPage, this.$route.query.queryPosition)
      }
    });
    this.fetchServices();
    /* console.log("myQuery: ", this.$route.query); */
  },
  created() {
    /* this.fetchResults(); */
  },
};
window.addEventListener("scroll", () => {
  const scrollBar = document.querySelector(".scroll-my");
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;
  scrollBar.style.transform = `scaleX(${scrollPercent})`;
});
</script>

<template>
  <main id="hidden-scrollbar">
    <div class="scroll-my"></div>

    <!-- THEBEST il bottone del TEST -->
    <!-- <button class="btn btn-warning m-5" @click="console.log(isSettingMap)">Test</button> -->

    <!-- MAP -->
    <section>
      <div class="container-map-search">
        <div id="search-map" class="map-flex">
          <div id="searchbar" class="searchbar-style"></div>
          <div id="map"></div>
        </div>
      </div>
    </section>

    <div>
      <div class="flex justify-content-center">
        <div class="col-md-7">
          <input type="hidden" v-model="latitude" name="latitude" />
          <input type="hidden" v-model="longitude" name="longitude" />
          <input type="hidden" v-model="address" name="address" />

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
                    <input class="checkbox" type="checkbox" v-model="selectedServices" name="services[]"
                      :id="`service-${service.id}`" :value="service.id" />
                    <span class="checkmark"></span>
                  </label>
                  <label :for="service.name">{{ service.name }}</label>
                </li>
              </ul>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-auto text-center">
              <button @click="submitForm(1, 0)" id="form-submit" type="submit" class="btn btn-warning mt-3">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <button class="btn btn-primary d-none" @click="console.log(apartments)">
      Test Apartments
    </button> -->

    <section class="container-search" v-if="apartments.length > 0 || pastSearches || isSearching">
      <!-- La ricerca e' finita e abbiamo dei risultati -->
      <div class="container-search-results" v-if="apartments.length > 0 && !isSearching">
        <h1>Your results:</h1>

        <!-- Singolo apartamento ciclato -->
        <div v-for="(apartment, i) in apartments" :id="`result${i}`">
          <router-link :to="{
            path: '/apartments/' + apartment.id, query: {
              queryLatitude: latitude,
              queryLongitude: longitude,
              queryAddress: address,
              queryBeds: beds,
              queryRooms: rooms,
              queryServices: selectedServices,
              queryDistance: distance,
              queryPage: currentPage,
              querySource: 'search',
              queryPosition: i
            }
          }" class="search-apartment-detail-card">

            <!-- IMMAGINE SINISTRA -->
            <div>
              <img class="search-image-container" :src="getImageUrl(apartment.image)" alt="" />
              <div v-if="apartment.sponsors[0]">
                <div class="sponsor-badge">
                  <p>&#9733; Sponsored!</p>
                </div>
              </div>
            </div>
            <!-- DATI DESTRA -->
            <div class="search-data-container">
              <div>
                <h3>{{ apartment.title }}</h3>
                <h6>{{ apartment.address }}</h6>
              </div>
              <div class="search-detail-container">
                <div class="search-detail-info">
                  <img class="search-icon-detail room" src="/public/img/icon_room_01.png" alt="" />
                  <span>Rooms</span>
                  <span>{{ apartment.rooms }}</span>
                </div>
                <div class="search-icon-divider"></div>
                <div class="search-detail-info">
                  <img class="search-icon-detail space" src="/public/img/icon_space_01.png" alt="" />
                  <span>m ^2</span>
                  <span>{{ apartment.sqr_mt }}</span>
                </div>
                <div class="search-icon-divider"></div>
                <div class="search-detail-info">
                  <img class="search-icon-detail bed" src="/public/img/icon_bed_01.png" alt="" />
                  <span>Beds</span>
                  <span>{{ apartment.beds }}</span>
                </div>
                <div class="search-icon-divider"></div>
                <div class="search-detail-info">
                  <img class="search-icon-detail bathroom" src="/public/img/icon_bathroom_01.png" alt="" />
                  <span>Bathroom</span>
                  <span>{{ apartment.bathrooms }}</span>
                </div>
              </div>
              <div class="service-apartment-card">
                <p>Services:</p>
                <div class="service-badges">
                  <div class="service-apartment-badge" v-for="service in apartment.services">
                    {{ service.name }}
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Paginazione -->

        <!-- <div class="container-paginator">
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

        </div> -->
        <div class="container-paginator">
          <p v-for="n in lastPage" :key="n" @click="changePage(n)"
            :class="n === currentPage ? 'bg-orange' : 'bg-lightblue'">
            {{ n }}
          </p>
        </div>
      </div>

      <!-- La ricerca e' finita ma NON ci sono risultati -->
      <div class="container-no-result" v-if="apartments.length === 0 && pastSearches && !isSearching">
        <div class="row justify-content-center aling-items-center align-content-center h-100">
          <div class="col-auto">
            <h3>No results... try again!</h3>
          </div>
        </div>
      </div>

      <!-- La ricerca e' in corso -->
      <div class="container-article" v-if="isSearching">
        <div class="row justify-content-center aling-items-center align-content-center h-100">
          <div class="col-auto center-loader">
            <div class="loader"></div>
          </div>
        </div>
      </div>
    </section>
  </main>
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

.scroll-my {
  width: 100%;
  height: 10px;
  background-color: var(--light--orange);

  position: fixed;
  z-index: 1000;
  bottom: 0;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.4s ease-out;
}

.container-paginator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.container-paginator p {
  padding: 20px;
  font-size: 25px;
  font-weight: 800;
  cursor: pointer;
}

.container-paginator>p {
  position: relative;
}

.container-paginator>p::before {
  content: "";
  position: absolute;
  top: 67%;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--orange);
  transition: 0.3s;
}

.container-paginator>p:hover::before {
  width: 50%;
  margin-left: 15px;
}

.bg-orange {
  color: var(--orange);
}

.bg-lightblue {
  color: var(--blue);
}

.center-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}
</style>
