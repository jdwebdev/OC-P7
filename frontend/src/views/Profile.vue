<template>
    <div class="profile">
        <router-link class="profile__router" :to="`/Wall`">Accueil</router-link>
        <h2 class="profile__title" v-if="requestOk">{{ user.username }}</h2>
        <div>
            <img class="profile__img" :src="userImg" /> 
            <p class="profile__pTitle">À propos de moi : </p>
            <p v-if="requestOk">{{ user.aboutMe }}</p>
        </div>
        <ProfileForm 
            v-if="displayForm" 
            :userId="user.id"
            :username="user.username"
            :aboutMe="user.aboutMe"
            :token="token"
            @updateBtnEvent="showForm"
            @getProfileEvent="getProfile"
        />
        <div class="profile__btns" v-if="requestOk && !displayForm && (userId == user.id || isAdmin == 1)"> 
            <button @click="showForm()">Modifier</button>
            <button @click="toggleDeletePanel()">Supprimer</button>
        </div>
        <Delete 
            v-if="deletePanel" 
            :panelType="'user'"
            @closePanelEvent="toggleDeletePanel"
            :displayedUserId="displayedUserId"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ProfileForm from '../components/ProfileForm.vue'
import Delete from '../components/Delete.vue'

export default {
    name: 'Profile',
    data () {
        return {
            displayForm: false,
            user: null,
            userImg: "/user-icon.png",
            deletePanel: false,
            requestOk: false,
            displayedUserId : this.$route.params.id
        }
    },
    components: {
        ProfileForm,
        Delete
    },
    computed: {
        ...mapState([
            'userId',
            'username',
            'token',
            'isAdmin'
        ])
    },
    methods: {
        getProfile() {

            let userId = 0
            if (this.$route.params.id == this.userId) {

                userId = this.userId
                this.displayedUserId = this.userId

                fetch(`http://localhost:3000/api/auth/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((response) => {
                    return response.json()
                }).then((user) => {
                    if (user.imageUrl) this.userImg = user.imageUrl
                    this.user = user
                    this.requestOk = true
                }).catch((e) => console.log(e))

            } else {
                userId = this.$route.params.id
                this.displayedUserId = this.$route.params.id

                fetch(`http://localhost:3000/api/auth/user/other/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((response) => {
                    return response.json()
                }).then((user) => {
                    if (user.imageUrl) this.userImg = user.imageUrl
                    this.user = user
                    this.requestOk = true
                }).catch((e) => console.log(e))
            }

        },
        showForm() {
            this.displayForm = !this.displayForm
        },
        toggleDeletePanel() {
            this.deletePanel = !this.deletePanel
        }
    },
    created () {
        this.getProfile()
    }
}
</script>

<style>
    .profile {
        width: 50vw;
        margin: 1rem auto;
        padding: 1rem;
        background-color: #aaa;
        text-align: center;
    }
    .profile__router {
        font-size: 1.5rem;
    }
    .profile__title {
        font-size: 1.5rem;
        margin-top: 1rem;
    }
    .profile__img {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    .profile__pTitle {
        font-weight: bold;
        margin-bottom: 1rem;
    }
    .profile p {
        font-size: 1rem;
    }
    .profile__btns {
        margin-top: 2rem;
    }
    .profile__btns button {
        padding: 0.5rem;
        margin: 0.5rem;
        border: none;
        border-radius: 0.5rem;
    }
    .profile__btns button:hover {
        cursor: pointer;
    }

    @media screen and (max-width: 768px) {
        .profile {
            width: 95vw;
        }
    }
</style>