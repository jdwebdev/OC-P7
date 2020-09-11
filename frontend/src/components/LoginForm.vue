<template>
    <div class="loginDiv">
        <h2 v-if="firstLogin">Vous êtes maintenant inscrit ! Connectez-vous !</h2>
        <h2 v-if="!firstLogin">Déjà inscrit ? Connectez-vous :</h2>
        <h3 v-if="userId" >{{ userId }}</h3>
        <form class="loginForm">
            <label for="email">Mail :</label>
            <input v-model="email" type="email" id="email" placeholder="exemple@mail.com">
            <label for="password">Mot de passe :</label>
            <input v-model="password" type="password" id="password" placeholder="Votre mot de passe">
            <span v-if="displayWrongPassword" class="wrongPassword">Mot de passe incorrect</span>
            <button class="formBtn" @click="login($event)">Se connecter</button>
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
            password: '',
            displayWrongPassword: false
        }
    },
    props: {
        userId: {
            type: Number,
            required: false
        },
        firstLogin: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        login(e) {
            e.preventDefault()
            
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
                if (!user.error) {
                    this.saveUser(user)
                } else if (user.error == 'Mot de passe incorrect'){
                    this.displayWrongPassword = true;
                }
            }).catch((e) => console.log(e))
        },
        saveUser(user){
            this.$store.commit('SAVE_USER', user)
            window.localStorage.setItem('token', user.token)
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
        height: 2.5rem;
    }

    .wrongPassword {
        color: red;
    }

    @media screen and (max-width: 768px) {

        .loginDiv {
            width: 90vw;
        }
        .loginForm input {
            padding: 0.2rem;
            margin-bottom: 0.5rem;
            height: 2.5rem;
        }
    }
</style>