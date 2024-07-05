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
    };
  },
  methods: {
    getImageUrl,
    async fetchResults() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/apartments/search?q=${this.searchQuery}`);
        this.apartments = response.data.filtered_apartments;
        console.log("Fetch results successful:", response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    },
    submitForm() {
      this.isSearching = true; // Set isSearching to true before API call
      axios.post("http://127.0.0.1:8000/api/apartments/search", {
        latitude: this.latitude,
        longitude: this.longitude,
        address: this.address,
        beds: this.beds,
        rooms: this.rooms,
        services: this.services,
        distance: this.distance
      }).then(response => {
        this.apartments = response.data.apartments;
        console.log("Form submitted successfully:", response.data);
      }).catch(error => {
        console.error("Error submitting form:", error);
      }).finally(() => {
        this.isSearching = false; // Reset isSearching after API call completes
        this.pastSearches = true;
      });
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
  mounted() {
    this.$nextTick(() => {
      this.initializeMap();
    });
    this.searchQuery = this.$route.query.q;
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
          <form @submit.prevent="submitForm">
            <input type="hidden" v-model="latitude" name="latitude">
            <input type="hidden" v-model="longitude" name="longitude">
            <input type="hidden" v-model="address" name="address">

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
            <div class="filter-box">
              <div class="filter-container">
                <img src="/public/img/icon_filter_01.png" alt="">
                <p>More filters</p>
                <span><font-awesome-icon :icon="['fas', 'sort-down']" /></span>
              </div>
            </div>
            <!-- filter body -->
            <div class="filter-box">
              <div class="all-filter-container">
                <div class="numeric-filters">
                  <div class="filter-num">
                    <p>Min beds:</p>
                    <input class="input-num" v-model="beds" name="beds" placeholder="0">
                  </div>
                  <div class="filter-num">
                    <p>Min rooms:</p>
                    <input class="input-num" type="number" v-model="rooms" name="rooms" placeholder="0">
                  </div>
                  <div class="filter-num">
                    <p>Search km radius:</p>
                    <input class="input-num" type="number" v-model="distance" name="distance" placeholder="20">
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
                <input type="number" v-model="services" name="services">
              </div>
              <div class="col-auto text-center">
                <button @click="submitForm" id="form-submit" type="submit" class="btn btn-warning">
                  Search
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>

  </main>

  <button class="btn btn-primary d-none" @click="console.log(apartments)">Test Apartments</button>

  <section id="articles" v-if="apartments.length > 0 || pastSearches || isSearching">

    <!-- La ricerca e' finita e abbiamo dei risultati -->
    <div class="container-article" v-if="apartments.length > 0 && !isSearching">
      <h1>Your results!:</h1>
      <div class="row-article">
        <article v-for="apartment in apartments" class="col-article">
          <img :src="getImageUrl(apartment.image)" alt="">
          <p>{{ apartment.title }}</p>
          <div class="container-article-info">
            <div class="article-info primo">
              <img class="icon-info" src="/public/img/icon_room_01.png" alt="">
              <span>Rooms</span>
              <span>{{ apartment.rooms }}</span>
            </div>
            <div class="article-info secondo">
              <img class="icon-info" src="/public/img/icon_space_01.png" alt="">
              <span>m ^2</span>
              <span>{{ apartment.sqr_mt }}</span>
            </div>
            <div class="article-info terzo">
              <img class="icon-info" src="/public/img/icon_room_01.png" alt="">
              <span>Beds</span>
              <span>{{ apartment.beds }}</span>
            </div>
            <div class="article-info">
              <img class="icon-info" src="/public/img/icon_bathroom_01.png" alt="">
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
    transform: rotate(1turn)
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
