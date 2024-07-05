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
            myQuery: {
                latitude: 0,
                longitude: 0
            }
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
        },
        search() {
            if (this.myQuery) {
                this.$router.push({ name: 'search', query: { q: this.myQuery } });
            }
        },
        initializeMap() {
            return new Promise((resolve, reject) => {
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
                        console.log("Marker dragged.");
                        console.log("latitude:" + this.latitude);
                        console.log("longitude:" + this.longitude);

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
                                console.error("Reverse geocode error:", error);
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
                            console.log("Initial user location loaded.");
                            console.log("latitude:" + this.latitude);
                            console.log("longitude:" + this.longitude);

                            tt.services
                                .reverseGeocode({
                                    key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                                    position: userLocation,
                                })
                                .then((response) => {
                                    let address = response.addresses[0].address.freeformAddress;
                                    this.address = address;
                                    console.log("Address:" + this.address);
                                })
                                .catch((error) => {
                                    console.error("Reverse geocode error:", error);
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
                        let ttSearchBox = new tt.plugins.SearchBox(
                            tt.services,
                            searchBoxOptions
                        );
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
                                        this.myQuery.latitude = lngLat.lat;
                                        this.myQuery.longitude = lngLat.lng;
                                        console.log("Searchbox used.");
                                        console.log("latitude:" + this.latitude);
                                        console.log("longitude:" + this.longitude);
                                    }
                                });
                        });
                    }
                } else {
                    console.error("TomTom SDK not loaded properly.");
                }
                if (this.myQuery != undefined) {
                    document.getElementsByClassName('tt-search-box-input')[0].value = this.myQuery
                }
                resolve();
            });
        },
    },
    created() {
        this.fetchApartments(6)
    },
    mounted() {
        this.$nextTick(() => {
            this.initializeMap()
        });
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
        <section>
            <div class="container">
                <div id="search-map">
                    <div id="searchbar" @keyup.enter="search">

                    </div>
                    <div id="map"></div>
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

#map {
    width: 100%;
    height: 500px;
    display: none;
}

#searchbar {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
    width: 80%;
    max-width: 500px;
    display: flex;

}

#search-map {
    position: relative;
}
</style>