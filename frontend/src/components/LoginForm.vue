<template>
    <div class="loginDiv">
        <h2>Déjà inscrit ? Connectez-vous :</h2>
        <form class="loginForm" action="">
            <label for="email">Mail</label>
            <input v-model="email" type="email" id="email">
            <label for="password">Mot de passe</label>
            <input v-model="password" type="password" id="password">
            <button class="formBtn" @click="login()">Se connecter</button>
        </form>
    </div>
</template>

<script>
import router from '@/router/index.js'

export default {
    name: 'LoginForm',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            const email = this.email
            const password = this.password

            const loginData = JSON.stringify({
                email,
                password
            })

            fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode:'cors',
                body: loginData
            }).then((response) => {
                return response.json()
            }).then((user) => {
                this.saveUser(user)
            }).catch((e) => console.log(e))
        },
        saveUser(user){
            this.$store.commit('SAVE_USER', user)
            router.push( 'Wall' )
        }
    }
}
</script>

<style> 
    .loginDiv {
        margin: 0 auto;
        width: 50vw;
    }

    .loginForm {
        display:flex;
        margin: 0 auto;
        margin-top: 1rem;
        flex-direction: column;
    }

    .loginForm label {
        font-size: 1rem;
    }
    
    .loginForm input {
        padding: 0.2rem;
        margin-bottom: 0.5rem;
    }
</style>