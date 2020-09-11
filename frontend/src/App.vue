<template>
  <div id="app">
      <Header />
      <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header.vue'
import router from '@/router/index.js'
import VueJwtDecode from 'vue-jwt-decode'

export default {
  components: {
    Header
  },
  methods: {
    checkLocalStorage() {
      if (window.localStorage.getItem('token')) {
        
        const tokenFromLocal = window.localStorage.getItem('token')
        const user = VueJwtDecode.decode(tokenFromLocal)
        user.token = tokenFromLocal
        user.isAdmin = user.isAdmin ? 1 : 0

        this.$store.commit('SAVE_USER', user)
      
        if (this.$router.currentRoute.path != '/Wall') {
          router.push('/Wall')
        }
        
      } else {
        if (this.$router.currentRoute.path != '/') {
          router.push('/')
        }
      }
    }
  },
  computed: {
    ...mapState([
        'userId',
        'username',
        'token',
        'isAdmin'
    ])
  },
  created() {
    this.checkLocalStorage()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 62.5%;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
a.router-link-exact-active {
  color: #42b983;
}
a {
  font-size: 2rem;
}
</style>
