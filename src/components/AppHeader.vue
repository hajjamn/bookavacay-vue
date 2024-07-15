<script>
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import { computed } from "vue";

export default {
  setup() {
    const route = useRoute();

    const headerClass = computed(() => {
      const path = route.path;
      if (path === "/") {
        return "home-header";
      } else if (
        path === "/search" ||
        path === "/login" ||
        /^\/apartments\/\d+$/.test(path)
      ) {
        return "secondary-header";
      }
    });
    return { headerClass };
  },
  data() {
    return {
      userName: sessionStorage.getItem("sessionUserName"),
      myQuery: {
        latitude: "",
        longitude: "",
        address: "",
        token: undefined,
      },
      ttSearchBox: null,
    };
  },
  computed: {
    isLoggedIn() {
      return !!sessionStorage.getItem("sessionUserToken");
    },
  },
  methods: {
    search() {
      if (this.myQuery) {
        this.$router.push({
          name: "AdvancedSearch",
          query: {
            queryLatitude: this.myQuery.latitude,
            queryLongitude: this.myQuery.longitude,
            queryAddress: this.myQuery.address,
            queryHomeSearch: true,
          },
        });
      }
    },
    initializeSearchBox() {
      // Check if tt and tt.services are defined
      if (typeof tt !== "undefined" && typeof tt.services !== "undefined") {
        console.log(
          "SearchBox initialization begun. tt and tt.services not undefined"
        );

        // Initialize the search box
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
          this.ttSearchBox = new tt.plugins.SearchBox(
            tt.services,
            searchBoxOptions
          );
          let searchBoxHTML = this.ttSearchBox.getSearchBoxHTML();
          document
            .getElementById("header-searchbar")
            .appendChild(searchBoxHTML);
          searchBoxHTML.id = "search-input";
        }

        this.ttSearchBox.on("tomtom.searchbox.resultselected", (data) => {
          let result = data.data.result;
          let lngLat = result.position;
          this.myQuery.latitude = lngLat.lat;
          this.myQuery.longitude = lngLat.lng;
          this.myQuery.address = result.address.freeformAddress;
          console.log("myQuery: ", this.myQuery);
        });

        document
          .getElementById("search-input")
          .addEventListener("input", (event) => {
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
                  this.myQuery.latitude = lngLat.lat;
                  this.myQuery.longitude = lngLat.lng;
                  this.myQuery.address = result.address.freeformAddress;
                  console.log("Updated myQuery: ", this.myQuery);
                }
              });
          });
      } else {
        console.error("tt or tt.services undefined");
      }
    },
    logout() {
      console.log("object");
      sessionStorage.removeItem("sessionUserToken");
      sessionStorage.removeItem("sessionUserEmail");
      sessionStorage.removeItem("sessionUserName");
      location.reload();
    },
  },
  mounted() {
    this.initializeSearchBox();
    console.log(sessionStorage.getItem("sessionUserName"));
  },
};
</script>

<template>
  <header :class="headerClass" class="header-container">
    <div class="container header-row">
      <div class="logo-input d-flex justify-content-between align-items-center">
        <!-- logo -->
        <div>
          <img class="logo-home" src="/public/img/BookaVacay_01.png" />
          <RouterLink to="/" class="back-home">
            <img class="logo" src="/public/img/BookaVacay_02.png" />
          </RouterLink>
        </div>
        <!-- searchbar -->
        <div>
          <form action="" class="search-home">
            <div
              @keyup.enter="search"
              placeholder="Search..."
              id="header-searchbar"
              :key="myQuery"
            ></div>
            <RouterLink to="/search">
              <button @click="search">
                <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
              </button>
            </RouterLink>
          </form>
        </div>

        <!-- hamburger menu -->
        <div class="hamburger-container">
          <input type="checkbox" id="breadcrumb" />
          <label for="breadcrumb" class="menu-icons">
            <font-awesome-icon id="menu-icon" :icon="['fas', 'bars']" />
            <font-awesome-icon id="close-menu" :icon="['fas', 'xmark']" />
          </label>
          <!-- log in/register -->
          <div class="nav">
            <a v-if="!isLoggedIn" href="http://127.0.0.1:8000/register"
              ><span class="register-btn register-btn-one">Register</span></a
            >

            <RouterLink v-if="!isLoggedIn" to="/login"
              ><span class="login-btn login-btn-one">Log in</span></RouterLink
            >

            <div v-if="isLoggedIn" class="dropdown-sm">
              <span class="username">{{ userName }}</span>
              <ul class="dropdown-menu-sm">
                <li>
                  <a class="dropdown-item" href="http://localhost:8000"
                    >Dashboard</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" @click="logout" href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <!-- //logged in -->
          <div v-if="isLoggedIn" class="dropdown">
            <button
              class="profile-btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>{{ userName }}</span>
              <font-awesome-icon
                class="dropdown-arrow"
                :icon="['fas', 'caret-down']"
              />
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="http://localhost:8000"
                  >Dashboard</a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="logout" href="#">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style>
#header-searchbar .tt-search-box-input-container,
#header-searchbar .-focus,
#header-searchbar .-focused {
  border: 0 !important;
  transition: none !important;
  border-color: white !important;
}

#header-searchbar svg {
  display: none;
}
</style>
