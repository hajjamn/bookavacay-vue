<script>
export default {
  components: {},
  data() {
    return {
      apartments: [],
    };
  },
  methods: {
    fetchApartments() {
      axios.get("http://127.0.0.1:8000/api/apartments").then((res) => {
        this.apartments = res.data;
        console.log(this.apartments);
      });
    },
  },
  created() {
    this.fetchApartments();
  },
};
</script>

<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div
          class="row aling-items-center flex-column justify-content-center h-100"
        >
          <div class="col-auto text-center">
            <h1>Hello Vue <font-awesome-icon :icon="['fab', 'vuejs']" /></h1>
            <p v-for="apartment in apartments">{{ apartment.title }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style></style>
