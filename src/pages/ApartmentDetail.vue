<script>
import axios from 'axios';

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
  <div>
    <h1>Apartment Detail Page</h1>
    <p>Apartment ID: {{ id }}</p>
    <p>Title: {{ apartment.title }}</p>
  </div>
</template>