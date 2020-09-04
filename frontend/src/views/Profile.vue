<template>
    <div class="profile">
        <h2>"""Username""" : Mon Profil</h2>
        <div>
            <img src=""/>
            <p>Description : </p>
            <p>"""description"""</p>
        </div>
        <div v-if="toggle"> <!-- v-if="userId = userId" -->
            <button>Modifier</button>
            <button>Supprimer</button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Profile',
    data () {
        return {
            toggle: true
        }
    },
    computed: {
        ...mapState([
            'userId',
            'username',
            'token'
        ])
    },
    methods: {

    },
    created () {
        // this.getProfile()
    }
}
</script>

<style>
    .profile {
        width: 50vw;
        margin: 0 auto;
        background-color: #aaa;
    }
</style>