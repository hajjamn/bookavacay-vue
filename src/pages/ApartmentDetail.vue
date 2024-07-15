<script>
import axios from "axios";
import { getImageUrl } from "../functions.js";

export default {
  props: [
    "id",
    "currentUser",
  ],
  data() {
    return {
      apartment: {},
      latitude: null,
      longitude: null,
      message: {
        sender_email: sessionStorage.getItem("sessionUserEmail"),
        content: "",
      },
      messageSentSuccessfully: false,
    };
  },
  methods: {
    getImageUrl,
    fetchApartment() {
      axios
        .get(`http://127.0.0.1:8000/api/apartments/${this.id}`)
        .then((res) => {
          this.apartment = res.data.apartment;
          this.latitude = this.apartment.latitude;
          this.longitude = this.apartment.longitude;
          this.initializeMap();
        })
        .catch((error) => {
          console.error("Error fetching apartment:", error);
        });
    },
    getUser() {
      axios
        .post(
          `http://127.0.0.1:8000/api/auth/login?email=${this.email}&password=${this.password}`
        )
        .then((res) => {
          this.userToken = res.data.accessToken;
          this.typeToken = res.data.token_type;
        });
      axios
        .get(`http://127.0.0.1:8000/api/auth/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `${this.typeToken} ${this.userToken}`,
          },
        })
        .then((res) => {
          console.log(res);
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
          zoom: 15,
        });

        let marker = new tt.Marker({
          draggable: false,
        })
          .setLngLat([this.longitude, this.latitude])
          .addTo(map);
      } else {
        console.error("TomTom SDK not loaded properly.");
      }
    },
    sendMessage() {
      axios
        .post("http://127.0.0.1:8000/api/apartments/message", {
          apartment_id: this.apartment.id,
          sender_email: this.message.sender_email,
          content: this.message.content,
        })
        .then((response) => {
          console.log("Message sent successfully");
          this.messageSentSuccessfully = true;
        })
        .catch((error) => {
          console.error("Error sending message:", error.response.data);
        });
    },
  },
  created() {
    this.fetchApartment();
  },
  mounted() {
    // Access route query parameters
    console.log('Query Params:', this.$route.query);
    document.getElementById('back-btn').scrollIntoView({ behavior: 'smooth' })
    console.log(this.apartment)
  }
};
</script>

<template>


  <router-link v-if="this.$route.query.querySource === 'search'" :to="{
    path: '/search', query: {
      queryLatitude: this.$route.query.queryLatitude,
      queryLongitude: this.$route.query.queryLongitude,
      queryAddress: this.$route.query.queryAddress,
      queryBeds: this.$route.query.queryBeds,
      queryRooms: this.$route.query.queryRooms,
      queryServices: this.$route.query.queryServices,
      queryDistance: this.$route.query.queryDistance,
      queryPage: this.$route.query.queryPage,
      queryBack: true,
      queryPosition: this.$route.query.queryPosition
    }
  }" class="search-apartment-detail-card m-4">
    <button id="back-btn" class="btn btn-warning">Back to Search</button>
  </router-link>

  <div class="back-button-div container-sm">
    <router-link v-if="this.$route.query.querySource === 'home'" :to="{
      path: '/', query: {
      }
    }" class="search-apartment-detail-card m-4">
      <button id="back-btn" class="btn btn-advanced">Back to Home</button>
    </router-link>
  </div>


  <div class="container-no-result" :class="apartment.title === undefined ? '' : 'd-none'">
    <div class="row justify-content-center aling-items-center align-content-center h-100">
      <div class="col-auto ">
        <h3 style="max-width: 400px;">No results... try again!</h3>
      </div>
    </div>
  </div>

  <div class="detail-section" :class="apartment.title === undefined ? 'invisible' : ''">
    <section class="container-sm">
      <!-- CONTAINER CARD APARTMENT -->
      <div class="apartment-detail-card">
        <!-- IMMAGINE SINISTRA -->
        <div>
          <img class="image-container" :src="getImageUrl(apartment.image)" alt="" />
        </div>
        <!-- DATI DESTRA -->
        <div class="data-container">
          <div>
            <h1>{{ apartment.title }}</h1>
            <h4>{{ apartment.address }}</h4>
          </div>
          <div class="detail-container">
            <div class="detail-info">
              <img class="icon-detail" src="/public/img/icon_room_01.png" alt="" />
              <span>Rooms</span>
              <span>{{ apartment.rooms }}</span>
            </div>
            <div class="icon-divider"></div>
            <div class="detail-info">
              <img class="icon-detail" src="/public/img/icon_space_01.png" alt="" />
              <span>m ^2</span>
              <span>{{ apartment.sqr_mt }}</span>
            </div>
            <div class="icon-divider"></div>
            <div class="detail-info">
              <img class="icon-detail" src="/public/img/icon_bed_01.png" alt="" />
              <span>Beds</span>
              <span>{{ apartment.beds }}</span>
            </div>
            <div class="icon-divider"></div>
            <div class="detail-info">
              <img class="icon-detail" src="/public/img/icon_bathroom_01.png" alt="" />
              <span>Bathroom</span>
              <span>{{ apartment.bathrooms }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="container-service-detail">
        <div class="service-detail">
          <p>Services:</p>
          <ul class="detail-service-list">
            <li v-for="service in apartment.services" :key="service.id">
              {{ service.name }}
            </li>
          </ul>
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
      <form class="container-message" @submit.prevent="sendMessage">
        <p class=" msg-sent" v-if="messageSentSuccessfully === true">
          Message sent successfully!
        </p>
        <label class="message-label">
          <p>Send a message to the owner:</p>
        </label>
        <textarea class="message-box" name="content" id="content" v-model="message.content" cols="30" rows="5"
          placeholder="Hi! Is the apartment still available?" required></textarea>
        <div class="message-leg"></div>
        <div>
          <p class="message-mail-label">
            Enter your e-mail to send the message:
          </p>
          <input class="message-mail-box" type="sender_email" name="sender_email" id="sender_email"
            v-model="message.sender_email" required placeholder="name@email.com" />
        </div>
        <button class="message-send" type="submit">Send</button>
      </form>
    </section>
  </div>


</template>

<style scoped>
.msg-sent {
  background-color: transparent;
  color: white;
  padding: 4px 12px;
  margin-bottom: 15px !important;
  border: 1px solid white;
  border-radius: 10px;
  font-size: 15px;
}

.detail-section {
  animation: opacityEaseInTransition 1.5s ease-in;
}

@keyframes opacityEaseInTransition {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.container-no-result {
  animation: colorEaseInTransition 1.5s ease-in
}

@keyframes colorEaseInTransition {
  0% {
    color: var(--light--blue);
    border-color: var(--light--blue);
  }

  100% {
    color: var(--blue);
    border-color: var(--blue);
  }
}


.back-button-div {
  display: flex;
  justify-content: start;
}

.btn-advanced {
  background-color: var(--blue);
  color: white;
}
</style>
