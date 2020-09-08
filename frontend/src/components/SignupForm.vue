<template>
    <div class="signupDiv">
        <h2>Formulaire d'inscription</h2>
        <form class="signupForm" action="">
            <label for="username">Nom d'utilisateur :</label>
            <input v-model="username" type="text" id="username" placeholder="Exemple: Supercodeur">
            <label for="email">Mail :</label>
            <input v-model="email" type="email" id="email" placeholder="exemple@mail.com">
            <label for="password">Mot de passe :</label>
            <input v-model="password" type="password" id="password" placeholder="Votre mot de passe">
            <button class="formBtn" @click="signup()">S'inscrire</button>
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
        signup() {
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
            }).then((r) => {
                console.log(r)
            }).catch((e) => console.log(e))
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
    }

    .formBtn {
        margin-top: 1rem;
        padding: 0.5rem;
        cursor: pointer;
    }
</style>