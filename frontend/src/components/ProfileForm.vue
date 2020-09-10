<template>
    <form class="profileForm">
        <label for="username">Nom d'utilisateur :</label>
        <input id="username" type="text" :value="`${username}`" />

        <label for="profileImg">Image de profil :</label>
        <p class="imgError" v-if="imgFormatError">Mauvais format ! Formats acceptés jpg, jpeg, ou png</p>
        <input id="profileImg" type="file" />

        <label for="aboutMe">À propos de moi :</label>
        <textarea id="aboutMe" type="text" :value="`${aboutMe}`"/>

        <button class="profileForm__btn" @click="updateProfile($event)">Confirmer</button>
    </form>
</template>

<script>

export default {
    name: 'ProfileForm',
    data () {
        return {
            imgFormatError: false
        }
    },
    props: {
        userId: {
            type: Number,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        aboutMe: {
            type: String,
            required: false
        },
        token: {
            type: String, 
            required: true
        }
    },
    methods: {
        updateProfile(e) {
            e.preventDefault()
            
            const usernameInput = document.getElementById('username')
            const imgInput = document.getElementById('profileImg')
            const aboutInput = document.getElementById('aboutMe')

            const id = this.userId
            const username = usernameInput.value
            const file = imgInput.files[0]
            const aboutMe = aboutInput.value

            if (file) {
                if (file.type != 'image/jpeg' && file.type != 'image/png') {
                    this.imgFormatError = true
                    return console.log('erreur de format !!')
                } else {
                    this.imgFormatError = false
                }
            }
            
            const formData  = new FormData()
            formData.append('id', id)
            formData.append('username', username)
            formData.append('image', file)
            formData.append('aboutMe', aboutMe)

            fetch(`http://localhost:3000/api/auth/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                mode:'cors',
                body: formData
            }).then((response) => {
                return response.json()
            }).then((r) => {
                console.log(r)
                console.log('req fini')
                this.$emit('updateBtnEvent')
                this.$emit('getProfileEvent')
                
            }).catch((e) => console.log(e))
        }
    }
}
</script>

<style>
    .profileForm {
        display: flex;
        flex-direction: column;
    }

    .profileForm label {
        font-size: 0.8rem;
        font-weight: bold;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }

    .profileForm input {
        width: 60%;
        margin: 0 auto;
        padding: 0.5rem;
        height: 2rem;
    }

    .imgError {
        color: red;
    }

    #aboutMe {
        min-width: 60%;
        max-width: 60%;
        margin: 0 auto;
        padding: 0.5rem;
        height: 5rem;
    }

    .profileForm__btn {
        width: 20%;
        padding: 0.8rem;
        margin: 1rem auto;
        border: none;
        border-radius: 0.5rem;
    }
    .profileForm__btn:hover {
        cursor: pointer;
    }

    @media screen and (max-width: 768px) {
        .profileForm input {
            width: 100%;
            
        }
        #aboutMe {
            min-width: 100%;
            max-width: 100%;
        }
        .profileForm__btn {
            width: 150px;
        }
    }
</style>