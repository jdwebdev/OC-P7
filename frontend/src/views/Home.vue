<template>
  <div class="home">
    <nav class="navBtn">
      <ul>
        <li><button class="logBtns" @click="toggleForm('signup')">Inscription</button></li>
        <li><button class="logBtns" @click="toggleForm('login')">Connexion</button></li>
      </ul>
    </nav>
    <SignupForm 
      v-if="!toggleLog"
      @toggleEvent="toggleForm"
    />
    <LoginForm 
      v-if="toggleLog" 
      :userId="userId"
      :firstLogin="firstLogin"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import SignupForm from '@/components/SignupForm.vue'
import LoginForm from '@/components/LoginForm.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    SignupForm,
    LoginForm
  },
  data() {
    return {
      toggleLog: true,
      firstLogin: false
    }
  },
  methods: {
    toggleForm(btnType) {
      if (btnType === 'signup' && this.toggleLog) {
        this.toggleLog = false
      } else if (btnType === 'login' && !this.toggleLog) {
        this.firstLogin = false
        this.toggleLog = true
      } else if (!btnType) {
        this.firstLogin = true
        this.toggleLog = true
      }
    }
  },
  computed: {
    ...mapState([
      'userId'
    ])
  }
}
</script>

<style>
  
  .navBtn {
    margin: 0 auto;
    width: 50vw;
  }
  .navBtn ul{
    margin: 0 auto;
    display:flex;
    justify-content: flex-end;
    list-style: none;
  }
  .logBtns {
    margin: 1rem;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #aaa;
  }
  .logBtns:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    .navBtn ul{
      justify-content: center;
    }
  }
  
</style>