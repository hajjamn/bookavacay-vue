<script>
export default {
  data() {
    return {
      mybutton: null,
    };
  },
  mounted() {
    this.mybutton = document.getElementById("myBtn");
    window.onscroll = this.scrollFunction;
  },
  methods: {
    topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    scrollFunction() {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        this.mybutton.style.display = "block";
      } else {
        this.mybutton.style.display = "none";
      }
    },
  },
};
</script>

<template>
  <section class="svg-wave"></section>
  <footer>
    <div class="container-footer">
      <div class="row-footer">
        <!-- Logo boolean -->
        <div class="footer-boolean">
          <a href="https://boolean.careers/">
            <img src="/public/img/logo_boolean.png" alt="" />
          </a>
        </div>

        <div class="divider-footer"></div>

        <!-- Testo presentazione -->
        <div class="footer-text">
          <h4>Welcome to Bookavacay!</h4>
          <p>
            Bookavacay is the ideal platform for those looking to rent out their
            homes or find the perfect vacation rental. Created as the final
            project for the Full Stack Web Developer course at Boolean,
            Bookavacay offers a simple and intuitive solution to connect
            homeowners and travelers.
          </p>
          <p>
            Homeowners can easily sign up and list their properties, while
            travelers can explore a wide range of options, find their ideal
            vacation home, and book with just a few clicks.
          </p>
        </div>

        <div class="divider-footer"></div>

        <!-- Membri team -->
        <ul class="footer-programmers">
          <li class="member">
            <a href="https://www.linkedin.com/in/enrico-clementi/">
              <h4>
                Enrico
                <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
              </h4>
              <p>Graphic Designer & FrontEnd Developer</p>
            </a>
          </li>

          <div class="divider-member"></div>

          <li class="member">
            <a href="https://www.linkedin.com/in/ianis-cozlov/">
              <h4>
                Ianis
                <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
              </h4>
              <p>BackEnd Developer</p>
            </a>
          </li>

          <div class="divider-member"></div>

          <li class="member">
            <a href="https://www.linkedin.com/in/mattia-bologna-aa9963314/">
              <h4>
                Mattia
                <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
              </h4>
              <p>BackEnd Developer</p>
            </a>
          </li>

          <div class="divider-member"></div>

          <li class="member">
            <a href="https://www.linkedin.com/in/hajjamn/">
              <h4>
                Nicola
                <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
              </h4>
              <p>BackEnd Developer</p>
            </a>
          </li>

          <div class="divider-member"></div>

          <li class="member">
            <a href="https://www.linkedin.com/in/riccardo-marino-149115315/">
              <h4>
                Riccardo
                <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
              </h4>
              <p>FrontEnd Developer</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <button @click="topFunction" id="myBtn" title="Go to top">Top</button>
  </footer>
</template>

<style>
.svg-wave {
  background-image: url("/public/img/wave.svg");
  background-size: cover;
  background-repeat: repeat-x;
  background-position: bottom center;
  width: 100vw;
  height: 150px;
}

#myBtn {
  display: none;
  /* Hidden by default */
  position: fixed;
  /* Fixed/sticky position */
  bottom: 20px;
  /* Place the button at the bottom of the page */
  right: 30px;
  /* Place the button 30px from the right */
  z-index: 99;
  /* Make sure it does not overlap */
  border: none;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  border-radius: 100%;
  /* Remove borders */
  outline: none;
  /* Remove outline */
  background-color: var(--orange);
  /* Set a background color */
  color: white;
  /* Text color */
  cursor: pointer;
  /* Add a mouse pointer on hover */
  padding: 15px;
  /* Some padding */
  font-size: 18px;
  /* Increase font size */
}

#myBtn:hover {
  background-color: var(--light--orange);
  /* Add a dark-grey background on hover */
}

#myBtn:active {
  padding: 12px;
}

@media (max-width: 768px) {
  .svg-wave {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .svg-wave {
    height: 100px;
    background-size: contain;
  }
}
</style>
