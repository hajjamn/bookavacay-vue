<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      apartment: {}
    };
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
    },
    async checkLoginStatus() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/check-login', {
          withCredentials: true
        });
        if (response.data.loggedIn) {
          console.log('User is logged in', response);
        } else {
          console.log('User is not logged in', response);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    }
  },
  mounted() {
    this.fetchApartment();
    this.checkLoginStatus();
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