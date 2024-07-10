<script>

export default {
  components: {
  },
  data() {
    return {
    }
  }
}

</script>

<template>
  
  <section class="svg-wave"></section>
  <footer>
    <section>
      <div class="container-footer">
        <div class="row-footer">

          <!-- Logo boolean -->
          <div class="footer-boolean"><a href="https://boolean.careers/">
            <img src="/public/img/logo_boolean.png" alt="">
          </a></div>

          <div class="divider-footer"></div>

          <!-- Testo presentazione -->
          <div class="footer-text">
            <h4>Welcome to Bookavacay!</h4>
            <p>Bookavacay is the ideal platform for those looking to rent out their homes or find the perfect vacation rental. Created as the final project for the Full Stack Web Developer course at Boolean, Bookavacay offers a simple and intuitive solution to connect homeowners and travelers.</p>
            <p>Homeowners can easily sign up and list their properties, while travelers can explore a wide range of options, find their ideal vacation home, and book with just a few clicks.</p>
          </div>

          <div class="divider-footer"></div>

          <!-- Membri team -->
          <ul class="footer-programmers">

            <li class="member">
              <a href="https://www.linkedin.com/in/enrico-clementi/">
                <h4>Enrico
                  <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
                </h4>
                <p>Graphic Designer & FrontEnd Developer</p>
              </a>
            </li>

            <div class="divider-member"></div>

            <li class="member">
              <a href="https://www.linkedin.com/in/ianis-cozlov/">
                <h4>Ianis
                  <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
                </h4>
                <p>BackEnd Developer</p>
              </a>
            </li>

            <div class="divider-member"></div>

            <li class="member">
              <a href="https://www.linkedin.com/in/mattia-bologna-aa9963314/">
                <h4>Mattia
                  <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
                </h4>
                <p>BackEnd Developer</p>
              </a>
            </li>

            <div class="divider-member"></div>

            <li class="member">
              <a href="https://www.linkedin.com/in/hajjamn/">
                <h4>Nicola
                  <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
                </h4>
                <p>BackEnd Developer</p>
              </a>
            </li>

            <div class="divider-member"></div>

            <li class="member">
              <a href="https://www.linkedin.com/in/riccardo-marino-149115315/">
                <h4>Riccardo
                  <font-awesome-icon class="linkedin-link" :icon="['fab', 'linkedin-in']" />
                </h4>
                <p>FrontEnd Developer</p>
              </a>
            </li>
            
          </ul>
        </div>
      </div>
    </section>
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