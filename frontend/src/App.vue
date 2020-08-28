<template>
  <div id="app">
      <Header />
      <router-link to="/">Home</router-link>
      <!-- <router-link to="/about">About</router-link> -->
      <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  components: {
    Header
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
</style>
