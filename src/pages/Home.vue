<script>
import axios from 'axios'


export default {
    data() {
        return {
            apartments: []
        }
    },
    methods: {
        fetchApartments(perPage) {
            axios.get('http://127.0.0.1:8000/api/apartments', {
                params: {
                    perPage
                }
            })
                .then(res => {
                    console.log(res)
                    this.apartments = res.data.apartments.data
                    console.log(this.apartments)
                })
        }
    },
    created() {
        this.fetchApartments(6)
    }
}

</script>

<template>
    <RouterLink to="research">Research</RouterLink>
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
                    <article v-for="apartment in apartments" class="col-article">
                        <img src="https://picsum.photos/seed/picsum/300/200" alt="">
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