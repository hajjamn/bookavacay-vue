<script>
import axios from 'axios';
import { getImageUrl } from "../functions.js";

export default {
  props: ['id'],
  data() {
    return {
      apartment: {}
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
        })
        .catch(error => {
          console.error('Error fetching apartment:', error);
        });
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
        <h1>{{ apartment.title }}</h1>
        <h4>Indirizzo appartamento</h4>
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

</template>

<style scoped></style>