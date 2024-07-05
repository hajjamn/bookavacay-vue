<script>
import axios from 'axios';
import { getImageUrl } from "../functions.js";

export default {
  props: ['id', 'currentUser'],
  data() {
    return {
      apartment: {},
      latitude: null,
      longitude: null
    };
  },
  created() {
    this.fetchApartment();
  },
  methods: {
    getImageUrl,
    fetchApartment() {
      axios.get(`http://127.0.0.1:8000/api/apartments/${this.id}`)
        .then(res => {
          this.apartment = res.data.apartment;
          this.latitude = this.apartment.latitude;
          this.longitude = this.apartment.longitude;
          this.initializeMap();
        })
        .catch(error => {
          console.error('Error fetching apartment:', error);
        });
    },
    initializeMap() {
      console.log("Initializing map..."); // Debug log
      if (
        typeof tt !== "undefined" &&
        typeof tt.map !== "undefined" &&
        typeof tt.services !== "undefined"
      ) {
        let map = tt.map({
          key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
          container: "map",
          center: [this.longitude, this.latitude],
          zoom: 15
        });

        let marker = new tt.Marker({
          draggable: false,
        })
          .setLngLat([this.longitude, this.latitude])
          .addTo(map);
      } else {
        console.error("TomTom SDK not loaded properly.");
      }
    }
  }
};
</script>

<template>

  <section class="container-sm">
    <!-- CONTAINER CARD APARTMENT -->
    <div class="apartment-detail-card">
      <!-- IMMAGINE SINISTRA -->
      <div>
        <img class="image-container" :src="getImageUrl(apartment.image)" alt="">
      </div>
      <!-- DATI DESTRA -->
      <div class="data-container">
        <div>
          <h1>{{ apartment.title }}</h1>
          <h4>{{ apartment.address }}</h4>
        </div>
        <div class="detail-container">
          <div class="detail-info">
              <img class="icon-detail" src="/public/img/icon_room_01.png" alt="">
              <span>Rooms</span>
              <span>{{ apartment.rooms }}</span>
          </div>
          <div class="icon-divider"></div>
          <div class="detail-info">
              <img class="icon-detail" src="/public/img/icon_space_01.png" alt="">
              <span>m ^2</span>
              <span>{{ apartment.sqr_mt }}</span>
          </div>
          <div class="icon-divider"></div>
          <div class="detail-info">
              <img class="icon-detail" src="/public/img/icon_room_01.png" alt="">
              <span>Beds</span>
              <span>{{ apartment.beds }}</span>
          </div>
          <div class="icon-divider"></div>
          <div class="detail-info">
              <img class="icon-detail" src="/public/img/icon_bathroom_01.png" alt="">
              <span>Bathroom</span>
              <span>{{ apartment.bathrooms }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- MAPPA -->
  <section>
    <div class="container-sm container-map">
      <div id="search-map">
        <div id="searchbar"></div>
        <div id="map"></div>
      </div>
    </div>
  </section>

  <!-- MESSAGGIO -->
   <!--Da aggiungere a section qunado il login sarà lato client: v-if="apartment.user_id !== currentUser.id" -->
   <section>
    <form class="container-message">
      <label class="message-label">
        <p>Send a message to the owner:</p>
      </label>
      <textarea class="message-box" name="" id="" cols="30" rows="5" placeholder="Hi! Is the apartment still available?"></textarea>
      <div class="message-leg"></div>
      <div>
        <button class="message-send">
          <a href="">Send</a>
        </button>
      </div>
    </form>
   </section>

</template>

<style scoped>
</style>
