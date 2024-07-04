<script>
import axios from "axios";
import { calculateDistance } from "../functions.js"; // Ensure this function is defined in your `functions.js`

export default {
  data() {
    return {
      apartments: [],
      latitude: 0,
      longitude: 0,
      secondLat: 44.2838767133773,
      secondLon: 11.326890902470534,
      distance: 0,
      prevLatitude: 0,
      prevLongitude: 0,
    };
  },
  methods: {
    fetchApartments(perPage) {
      axios
        .get("http://127.0.0.1:8000/api/apartments", {
          params: { perPage },
        })
        .then((res) => {
          this.apartments = res.data.apartments.data;
        })
        .catch((error) => {
          console.error("Error fetching apartments:", error);
        });
    },
    async testDistance() {
      try {
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${this.latitude},${this.longitude}:${this.secondLat},${this.secondLon}/json?key=YOUR_API_KEY`;
        const response = await axios.get(url);
        const distance = response.data.routes[0].summary.lengthInMeters;
        console.log("Route distance:", distance);
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    },
    initializeMap() {
      if (typeof tt !== "undefined" && tt.map && tt.services) {
        const map = tt.map({
          key: "YOUR_API_KEY",
          container: "map",
          center: [this.longitude, this.latitude],
          zoom: 15,
        });

        const marker = new tt.Marker({ draggable: true })
          .setLngLat([this.longitude, this.latitude])
          .addTo(map);

        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          this.latitude = lngLat.lat;
          this.longitude = lngLat.lng;

          tt.services
            .reverseGeocode({
              key: "YOUR_API_KEY",
              position: lngLat,
            })
            .then((response) => {
              const address = response.addresses[0].address.freeformAddress;
              document.getElementById("address").value = address;
            })
            .catch((error) => {
              console.error("Reverse geocode error:", error);
            });
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = [
                position.coords.longitude,
                position.coords.latitude,
              ];
              map.setCenter(userLocation);
              marker.setLngLat(userLocation);
              this.latitude = userLocation[1];
              this.longitude = userLocation[0];

              tt.services
                .reverseGeocode({
                  key: "YOUR_API_KEY",
                  position: userLocation,
                })
                .then((response) => {
                  const address = response.addresses[0].address.freeformAddress;
                  document.getElementById("address").value = address;
                })
                .catch((error) => {
                  console.error("Reverse geocode error:", error);
                });
            },
            (error) => {
              console.error("Geolocation error:", error);
            }
          );
        }

        const searchBoxOptions = {
          searchOptions: {
            key: "YOUR_API_KEY",
            language: "en-GB",
            limit: 5,
          },
          autocompleteOptions: {
            key: "YOUR_API_KEY",
            language: "en-GB",
          },
          noResultsMessage: "No results found.",
        };

        const ttSearchBox = new tt.plugins.SearchBox(
          tt.services,
          searchBoxOptions
        );
        const searchBoxHTML = ttSearchBox.getSearchBoxHTML();
        document.getElementById("searchbar").appendChild(searchBoxHTML);

        ttSearchBox.on("tomtom.searchbox.resultselected", (data) => {
          const result = data.data.result;
          const lngLat = result.position;
          map.setCenter(lngLat);
          marker.setLngLat(lngLat);
          this.latitude = lngLat.lat;
          this.longitude = lngLat.lng;
          document.getElementById("address").value =
            result.address.freeformAddress;
        });

        document
          .getElementById("search-input")
          .addEventListener("input", (event) => {
            const query = event.target.value;
            tt.services
              .fuzzySearch({
                key: "YOUR_API_KEY",
                query,
                language: "en-GB",
              })
              .then((response) => {
                if (response.results && response.results.length > 0) {
                  const result = response.results[0];
                  const lngLat = result.position;
                  map.setCenter(lngLat);
                  marker.setLngLat(lngLat);
                  this.latitude = lngLat.lat;
                  this.longitude = lngLat.lng;
                  document.getElementById("address").value =
                    result.address.freeformAddress;
                }
              });
          });
      } else {
        console.error("TomTom SDK not loaded properly.");
      }
    },
  },
  updated() {
    if (
      this.latitude !== this.prevLatitude ||
      this.longitude !== this.prevLongitude
    ) {
      this.prevLatitude = this.latitude;
      this.prevLongitude = this.longitude;
      this.testDistance();
    }
  },
  mounted() {
    this.initializeMap();
  },
};
</script>
