<script>
import axios from "axios";
import { getImageUrl } from "../functions.js";

export default {
  data() {
    return {
      key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
      apartments: [],
      firstLat: "",
      firstLon: "",
      secondLat: "",
      secondLon: "",
      currentPage: 1,
      lastPage: null,
      password: null,
      email: null,
      userToken: null,
      typeToken: null,
    };
  },
  methods: {
    changePage(n) {
      if (n === this.currentPage) return;
      this.currentPage = n;
      this.fetchApartments(this.currentPage);
    },
    getImageUrl,
    fetchApartments(n) {
      axios
        .get("http://127.0.0.1:8000/api/apartments", {
          params: {
            page: n,
          },
        })
        .then((response) => {
          let results = response.data.apartments;
          this.apartments = results.data;
          this.currentPage = results.current_page;
          this.lastPage = results.last_page;
          console.log(results);
        });
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      axios
        .get(
          `https://api.tomtom.com/routing/1/calculateRoute/${lat1},${lon1}:${lat2},${lon2}/json`,
          {
            params: {
              key: this.key,
            },
          }
        )
        .then((res) => {
          console.log(res.data.routes[0].summary.lengthInMeters / 1000);
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
  },
  created() {
    this.fetchApartments(1);
  },
};
</script>

<template>
  <main>
    <div class="scroll-my"></div>

    <section class="section-title">
      <div class="container-title">
        <div>
          <p>The best way</p>
          <p class="to-book">to book your next vacay</p>
        </div>
      </div>
    </section>
    <section id="articles">
      <div class="container container-article">
        <h1>Our top choices:</h1>
        <div class="row row-article">
          <article v-for="apartment in apartments" class="col-lg-4 col-article" :key="apartment.id">

            <router-link :to="{
              path: '/apartments/' + apartment.id, query: {
                querySource: 'home'
              }
            }">
              <img :src="getImageUrl(apartment.image)" alt="" />
              <p>{{ apartment.title }}</p>
              <div class="container-article-info">
                <div class="article-info">
                  <img class="icon-info room" src="/public/img/icon_room_01.png" alt="" />
                  <span class="span-info">Rooms</span>
                  <span>{{ apartment.rooms }}</span>
                </div>
                <div class="divider-home"></div>
                <div class="article-info">
                  <img class="icon-info space" src="/public/img/icon_space_01.png" alt="" />
                  <span class="span-info">m ^2</span>
                  <span>{{ apartment.sqr_mt }}</span>
                </div>
                <div class="divider-home"></div>
                <div class="article-info">
                  <img class="icon-info bed" src="/public/img/icon_bed_01.png" alt="" />
                  <span class="span-info">Beds</span>
                  <span>{{ apartment.beds }}</span>
                </div>
                <div class="divider-home"></div>
                <div class="article-info">
                  <img class="icon-info bathroom" src="/public/img/icon_bathroom_01.png" alt="" />
                  <span class="span-info">Bathroom</span>
                  <span>{{ apartment.bathrooms }}</span>
                </div>
              </div>
            </router-link>
          </article>
        </div>
      </div>

      <!-- <div class="container nav-menu">
        <div class="row py-3 justify-content-center align-items-baseline">
          <div class="col-auto">
            <font-awesome-icon :class="currentPage === 1 ? 'nav-btn-disabled' : ''" class="fs-5 nav-btn"
              :icon="['fas', 'angles-left']" @click="fetchApartments(1)" />
          </div>
          <div class="col-auto" @click="">
            <font-awesome-icon :class="currentPage - 1 <= 0 ? 'nav-btn-disabled' : ''" class="fs-5 nav-btn"
              :icon="['fas', 'angle-left']" @click="fetchApartments(currentPage - 1)" />
          </div>
          <div class="col-auto">
            <span class="fs-4 nav-number">{{ currentPage }}</span>
          </div>
          <div class="col-auto">
            <font-awesome-icon :class="currentPage + 1 > lastPage ? 'nav-btn-disabled' : ''" class="fs-5 nav-btn"
              :icon="['fas', 'angle-right']" @click="fetchApartments(currentPage + 1)" />
          </div>
          <div class="col-auto">
            <font-awesome-icon :class="currentPage === lastPage ? 'nav-btn-disabled' : ''" class="fs-5 nav-btn"
              :icon="['fas', 'angles-right']" @click="fetchApartments(lastPage)" />
          </div>
        </div>
      </div> -->
      <div class="container-paginator">
        <p v-for="n in lastPage" :key="n" @click="changePage(n)"
          :class="n === currentPage ? 'bg-orange' : 'bg-lightblue'">
          {{ n }}
        </p>
      </div>
    </section>
  </main>

</template>

<style scoped>
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
</style>
