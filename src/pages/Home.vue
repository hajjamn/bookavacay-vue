<script>
import axios from 'axios';
import { getImageUrl } from "../functions.js";
import { RouterLink } from 'vue-router';




export default {
    data() {
        return {
            key: 'VtdGJcQDaomboK5S3kbxFvhtbupZjoK0',
            apartments: [],
            firstLat: '',
            firstLon: '',
            secondLat: '',
            secondLon: '',
            latitude: 0,
            longitude: 0,
            address: '',
            query: ''
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
                    // console.log(res.data.apartments.data)
                    this.apartments = res.data.apartments.data
                    // console.log(this.apartments)
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

            this.$router.push({ name: 'search', query: { lat: this.latitude, lng: this.longitude, add: this.address } });

        },
        initializeMap() {

            // tt è l'oggetto con tutte le info di tomtom,
            // tt.map ha le info della mappa 
            // tt.services ha tutte le informazioni aggiuntive (ricerca, distanza, ecc...) 

            // Se tt, tt.map, tt.services NON sono undefined => crea la mappa
            if (
                typeof tt !== "undefined" &&
                typeof tt.map !== "undefined" &&
                typeof tt.services !== "undefined"
            ) {
                // Inizializza la mappa con TomTom Key, indicazione di dove inserirla nel HTML, dove centrarla e zoom
                let map = tt.map({
                    key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                    container: "map",
                    center: [0, 0],
                    zoom: 15,
                });

                // inizializza il marker
                let marker = new tt.Marker({
                    draggable: true,
                })
                    // setta LAT e LON del marker e aggiungilo alla mappa
                    .setLngLat([0, 0])
                    .addTo(map);

                // Quando il marker viene spostato cambia la LAT e LON che vengono salvate
                marker.on("dragend", () => {
                    let lngLat = marker.getLngLat();
                    this.latitude = lngLat.lat;
                    this.longitude = lngLat.lng;

                    // Servizi di TomTom (ricerca, distanza, ecc...)
                    tt.services
                        // Chiama la funzione reverseGeocode() passando Key e coordinate salvate
                        .reverseGeocode({
                            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                            position: lngLat,
                        })
                        // Imposta l'indirizzo (userAddress) e salvalo in this.address
                        .then((response) => {
                            let userAddress = response.addresses[0].address.freeformAddress;
                            this.address = userAddress;
                        })
                        .catch((error) => {
                            console.error("Reverse geocode error:", error);
                        });
                });

                // Se necessaria la geolocalizzazione dello user
                if (navigator.geolocation) {
                    // Imposta la localizzazione dello user recuperando la sua posizione attuale
                    navigator.geolocation.getCurrentPosition((position) => {
                        let userLocation = [
                            position.coords.longitude,
                            position.coords.latitude,
                        ];
                        // Fai coincidere il centro della mappa e il marker con la posizione dello user (userPosition è un array con LAT e LON, è definita solo qui dentro)
                        map.setCenter(userLocation);
                        marker.setLngLat(userLocation);
                        this.latitude = userLocation[1];
                        this.longitude = userLocation[0];
                        // console.log("Initial user location loaded.");
                        // console.log("latitude:" + this.latitude);
                        // console.log("longitude:" + this.longitude);

                        // Servizi di TomTom (ricerca, distanza, ecc...)
                        tt.services
                            // Chiama la funzione reverseGeocode() passando Key e coordinate salvate
                            .reverseGeocode({
                                key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                                position: userLocation,
                            })
                            // Imposta l'indirizzo (userAddress) e salvalo in this.address
                            .then((response) => {
                                let address = response.addresses[0].address.freeformAddress;
                                this.address = address;
                                // console.log("Address:" + this.address);
                            })
                            .catch((error) => {
                                console.error("Reverse geocode error:", error);
                            });
                    });
                }

                // Inizializzazione searchbox 
                let searchBoxOptions = {
                    // Opzioni necessarie per la fuzzy search (Key, lingua, limite(?))
                    searchOptions: {
                        key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                        language: "it-IT",
                        limit: 5,
                    },
                    // Opzioni necessarie per l'autocompletamento (Key, lingua)
                    autocompleteOptions: {
                        key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                        language: "it-IT",
                    },
                    noResultsMessage: "No results found.",
                };

                // Se non esiste già un elemento con id 'search-input'
                if (!document.getElementById("search-input")) {
                    // Inizializza una searchBox tramite plugin di TomTom, passando i tt.services e le opzioni per Fuzzy search e autocompletamento
                    let ttSearchBox = new tt.plugins.SearchBox(
                        tt.services,
                        searchBoxOptions
                    );
                    // Rendi la searchbox inizializzata un elemento HTML e inseriscilo come 'figlio' di #searchbar
                    let searchBoxHTML = ttSearchBox.getSearchBoxHTML();
                    document.getElementById("searchbar").appendChild(searchBoxHTML);
                    searchBoxHTML.id = "search-input";

                    // Avvia search() quando viene rilasciato il tasto Enter 
                    searchBoxHTML.addEventListener('keyup', (event) => {
                        if (event.key === 'Enter') {
                            this.search();
                        }
                    });

                    // Prendi le informazioni passate dalla searchbar e impostale come coordinate salvate, centratura della mappa e del marker
                    ttSearchBox.on("tomtom.searchbox.resultselected", (data) => {
                        let result = data.data.result;
                        let lngLat = result.position;
                        map.setCenter(lngLat);
                        marker.setLngLat(lngLat);
                        this.latitude = lngLat.lat;
                        this.longitude = lngLat.lng;
                        this.address = result.address.freeformAddress;
                    });

                    // Quando viene inserito un input nella searchbar 
                    searchBoxHTML.addEventListener("input", (event) => {
                        // Imposta query come il valore inserito nell'input
                        let query = event.target.value;
                        tt.services
                            // effettua fuzzy search
                            .fuzzySearch({
                                key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                                query: query,
                                language: "en-GB",
                            })
                            // In base alla risposta della fuzzy search setta le coordinate, centratura mappa, marker e indirizzo
                            .then((response) => {
                                if (response.results && response.results.length > 0) {
                                    let result = response.results[0];
                                    let lngLat = result.position;
                                    map.setCenter(lngLat);
                                    marker.setLngLat(lngLat);
                                    this.latitude = lngLat.lat;
                                    this.longitude = lngLat.lng;
                                    this.address = result.address.freeformAddress;
                                    // console.log("Searchbox used.");
                                    // console.log("latitude:" + this.latitude);
                                    // console.log("longitude:" + this.longitude);
                                }
                            });


                    });
                }


            } else {
                console.error("TomTom SDK not loaded properly.");
            }
        }
    },
    created() {
        this.fetchApartments(6)
    },
    mounted() {
        this.initializeMap();
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
        <section class="m-5">
            <div class="container">
                <div id="search-map">
                    <div id="searchbar"></div>
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
}

#search-map {
    position: relative;
}
</style>