<template>
    <div class="signupDiv">
        <h2>Formulaire d'inscription</h2>
        <form class="signupForm">
            <label for="username">Nom d'utilisateur : <span class="infos">(entre 4 et 10 caractères)</span></label>
            <input v-model="username" type="text" id="username" placeholder="Exemple: Supercodeur">
            <label for="email">Mail :</label>
            <input v-model="email" type="email" id="email" placeholder="exemple@mail.com">
            <label for="password">Mot de passe : <span class="infos">(entre 4 et 8 lettres sans caractère spécial, incluant au minimum un chiffre)</span></label>
            <input v-model="password" type="password" id="password" placeholder="Votre mot de passe">
            <button class="formBtn" @click="signup($event)">S'inscrire</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'SignupForm',
    data() {
        return {
            username: '',
            email: '',
            password: ''
        }
    },
    methods: {
        signup(e) {

            e.preventDefault()
            
            const username = this.username
            const email = this.email
            const password = this.password

            const signupData = JSON.stringify({
                username,
                email,
                password
            })

            fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode:'cors',
                body: signupData
            }).then((response) => {
                return response.json()
            }).then(() => {
                this.toLoginForm()
            }).catch((e) => console.log(e))
        },
        toLoginForm() {
            this.$emit('toggleEvent')
        }
    }
}
</script>

<style> 
    .signupDiv {
        margin: 0 auto;
        width: 50vw;
    }

    .signupForm {
        display:flex;
        margin: 0 auto;
        margin-top: 1rem;
        flex-direction: column;
    }

    .signupForm label {
        font-size: 1rem;
    }
    
    .signupForm input {
        padding: 0.2rem;
        margin-bottom: 0.5rem;
        height: 2.5rem;
    }
    .infos {
        font-size: 0.7rem;
        color: gray;
    }

    .formBtn {
        margin-top: 1rem;
        padding: 0.5rem;
        cursor: pointer;
    }

    @media screen and (max-width: 768px) {

        .signupDiv {
            width: 90vw;
        }
    }
</style>