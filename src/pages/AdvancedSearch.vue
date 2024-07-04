<script>
import axios from "axios";
import { calculateDistance } from "../functions.js";

export default {
  data() {
    return {
      apartments: [],
      latitude: 0,
      longitude: 0,
      address: "",
      secondLat: 44.2838767133773,
      secondLon: 11.326890902470534,
      distance: 0,
      searchQuery: ""
    };
  },
  methods: {
    async fetchResults() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/apartments/search?q=${this.searchQuery}`);
        this.apartments = response.data.filtered_apartments;
        console.log("Fetch results successful:", response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    },
    fetchApartments(perPage) {
      axios
        .get("http://127.0.0.1:8000/api/apartments", {
          params: {
            perPage,
          },
        })
        .then((res) => {
          console.log(res.data.apartments.data);
          this.apartments = res.data.apartments.data;
          console.log(this.apartments);
        });
    },
    submitForm() {
      axios.post("http://127.0.0.1:8000/api/apartments/search", {
        latitude: this.latitude,
        longitude: this.longitude,
        address: this.address,
      }).then(response => {
        this.apartments = response.data.apartments;
        console.log("Form submitted successfully:", response.data);
      }).catch(error => {
        console.error("Error submitting form:", error);
      });
    },
    testDistance() {
      calculateDistance(this.latitude, this.longitude, this.secondLat, this.secondLon)
    },
    initializeMap() {
      if (
        typeof tt !== "undefined" &&
        typeof tt.map !== "undefined" &&
        typeof tt.services !== "undefined"
      ) {
        var map = tt.map({
          key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
          container: "map",
          center: [0, 0],
          zoom: 15,
        });

        var marker = new tt.Marker({
          draggable: true,
        })
          .setLngLat([0, 0])
          .addTo(map);

        marker.on("dragend", () => {
          var lngLat = marker.getLngLat();
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
              var userAddress = response.addresses[0].address.freeformAddress;
              this.address = userAddress;
            })
            .catch((error) => {
              console.error('Reverse geocode error:', error);
            });
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            var userLocation = [
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
                var address = response.addresses[0].address.freeformAddress;
                this.address = address;
                console.log('Address:' + this.address)
              })
              .catch((error) => {
                console.error('Reverse geocode error:', error);
              });
          });
        }

        var searchBoxOptions = {
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
          var ttSearchBox = new tt.plugins.SearchBox(tt.services, searchBoxOptions);
          var searchBoxHTML = ttSearchBox.getSearchBoxHTML();
          document.getElementById("searchbar").appendChild(searchBoxHTML);
          searchBoxHTML.id = "search-input";

          ttSearchBox.on("tomtom.searchbox.resultselected", (data) => {
            var result = data.data.result;
            var lngLat = result.position;
            map.setCenter(lngLat);
            marker.setLngLat(lngLat);
            this.latitude = lngLat.lat;
            this.longitude = lngLat.lng;
            this.address = result.address.freeformAddress;
          });

          searchBoxHTML.addEventListener("input", (event) => {
            var query = event.target.value;
            tt.services
              .fuzzySearch({
                key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                query: query,
                language: "en-GB",
              })
              .then((response) => {
                if (response.results && response.results.length > 0) {
                  var result = response.results[0];
                  var lngLat = result.position;
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

          <div class="d-none" id="distance-test">
            <div class="col-6 p-3">
              <input type="number" v-model="secondLat" name="secondLat" />
              <label for="secondLat">Second Lat</label>
            </div>
            <div class="col-6 p-3 mb-3">
              <input type="number" v-model="secondLon" name="secondLon" />
              <label for="secondLon">Second Lon</label>
            </div>
            <div class="col-3">
              <button id="submit-btn" class="btn btn-primary" @click="testDistance()">
                Test Distance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-3">
          <form @submit.prevent="submitForm">
            <input type="hidden" v-model="this.latitude" name="latitude">
            <input type="hidden" v-model="this.longitude" name="longitude">
            <input type="hidden" v-model="this.address" name="address">
            <button id="form-submit" type="submit" class="btn btn-warning">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>

  </main>

  <button class="btn btn-primary d-none" @click="console.log(this.apartments)">Test Apartments</button>

  <!--   <div v-for="apartment in apartments">
    <div v-if="calculateDistance(apartment.latitude, apartment.longitude, this.latitude, this.longitude) < 20">
      Appartamento
    </div>
  </div> -->

  <section class="svg-wave"></section>
</template>

<style scoped>
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
