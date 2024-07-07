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
        }
    },
    methods: {
        getImageUrl,
        fetchApartments(perPage) {
            axios.get('http://127.0.0.1:8000/api/apartments', {
                params: {
                    perPage
                }
            })
                .then(res => {
                    console.log(res.data.apartments.data)
                    this.apartments = res.data.apartments.data
                    console.log(this.apartments)
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
        this.fetchApartments(6)
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
</style>