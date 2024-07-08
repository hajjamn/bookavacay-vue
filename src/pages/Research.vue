<template>

    <!-- Search bar principale -->
    <section>
        <div class="address-research">
            <form action="" class="flex">
                <div class="address-research-input">
                    <label for="input">Address:</label>
                    <input type="text" id="input" placeholder="Via Vittoria 1, Roma, 00140">
                </div>
                <button class="address-research-btn"><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
            </form>
        </div>
    </section>

    <!-- Filtri extra -->
    <section>
        <!-- filter head -->
        <div class="filter-box">
            <div class="filter-container">
                <img src="/public/img/icon_filter_01.png" alt="">
                <p>More filters</p>
                <span><font-awesome-icon :icon="['fas', 'sort-down']" /></span>
            </div>
        </div>

        <!-- filter body -->
        <div class="filter-box">
            <div class="all-filter-container">
                <div class="numeric-filters">
                    <div class="filter-num">
                        <p>Min beds:</p>
                        <input class="input-num" type="number" name="" id="" placeholder="1" min="1">
                    </div>
                    <div class="filter-num">
                        <p>Min rooms:</p>
                        <input class="input-num" type="number" name="" id="" placeholder="1" min="1">
                    </div>
                    <div class="filter-num">
                        <p>Search km radius:</p>
                        <input class="input-num" type="number" name="" id="" placeholder="1" min="0">
                    </div>
                </div>
                <div class="filters-divider"></div>

                <!-- SERVONO SERVICES API -->
                <!-- <div class="filter-service">
                    <div v-for="service in services">
                        <input type="checkbox" name="" id="">
                        <p>{{ service.name }}</p>
                    </div>
                </div> -->
            </div>
        </div>
    </section>
</template>

<script>
// import axios from 'axios';

// export default {
//     data() {
//         return {
//             services: []
//         }
//     },
//     created() {
//         this.fetchServices();
//     },
//     methods: {
//         fetchServices() {
//             axios.get('/api/services')
//                 .then(response => {
//                     this.services = response.data;
//                 })
//                 .catch(error => {
//                     console.error('Error fetching services:', error);
//                 });
//         }
//     }
// }
</script>

<style scoped></style>