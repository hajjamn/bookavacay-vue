<script>
import axios from 'axios';
import { getImageUrl } from "../functions.js";



export default {
    data() {
        return {
            key: 'VtdGJcQDaomboK5S3kbxFvhtbupZjoK0',
            apartments: [],
            firstLat: '',
            firstLon: '',
            secondLat: '',
            secondLon: '',
            currentPage: 1,
            lastPage: null,
        }
    },
    methods: {
        getImageUrl,
        fetchApartments(n) {
            axios.get('http://127.0.0.1:8000/api/apartments', {
                params: {
                    page: n
                }
            })
                .then(response => {
                    let results = response.data.apartments
                    this.apartments = results.data
                    this.currentPage = results.current_page
                    this.lastPage = results.last_page
                    console.log(results)
                })
        },
        calculateDistance(lat1, lon1, lat2, lon2) {
            axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${lat1},${lon1}:${lat2},${lon2}/json`, {
                params: {
                    key: this.key
                }
            }).then(res => {
                console.log(res.data.routes[0].summary.lengthInMeters / 1000)
            })
        },
        showApartment(apartmentId) {
            //My code here
        }
    },
    created() {
        this.fetchApartments(1)
    }
}

</script>

<template>
    <main>
        <section class="section-title">
            <div class="container-title">
                <div>
                    <p>The best way</p>
                    <p class="to-book">to book your next vacay</p>
                </div>
            </div>
        </section>
        <section id="articles">
            <div class="container-article">
                <h1>Our top choices:</h1>
                <div class="row-article">
                    <article v-for="apartment in apartments" class="col-article" :key="apartment.id">
                        <router-link :to="'/apartments/' + apartment.id">
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
                        </router-link>
                    </article>


                </div>
            </div>

            <div class="container nav-menu">
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
                        <font-awesome-icon :class="currentPage + 1 > lastPage ? 'nav-btn-disabled' : ''"
                            class="fs-5 nav-btn" :icon="['fas', 'angle-right']"
                            @click="fetchApartments(currentPage + 1)" />
                    </div>
                    <div class="col-auto">
                        <font-awesome-icon :class="currentPage === lastPage ? 'nav-btn-disabled' : ''"
                            class="fs-5 nav-btn" :icon="['fas', 'angles-right']" @click="fetchApartments(lastPage)" />
                    </div>
                </div>
            </div>
        </section>
    </main>
    <!-- <img class="svg-wave" src="/public/img/wave.svg" alt=""> -->
    <section class="svg-wave">

    </section>



</template>




<style scoped>
.svg-wave {
    background-image: url('/public/img/wave.svg');
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