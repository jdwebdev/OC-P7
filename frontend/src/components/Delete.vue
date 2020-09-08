<template>
    <div class="deletePanel">
        <div class="deletePanel__content">
            <h2 class="deletePanel__title">Êtes-vous sûr de vous ? Il ne sera pas possible de revenir en arrière ...</h2>
            <div class="deletePanel__btns">
                <button type="button" class="cancel__btn" @click="closePanel()">Annuler</button>   
                <button type="button" class="validate__btn" @click="confirmDelete()">Confirmer la suppression</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    Name: 'Delete',
    props: {
        panelType: {
            type: String,
            required: true
        },
        postId: {
            type: Number, 
            required: false
        },
        commentId: {
            type: Number, 
            required: false
        }
    },
    methods: {
        closePanel() {
            this.$emit('closePanelEvent')
        },
        confirmDelete() {
            switch(this.panelType) {
                case 'comment' :
                    this.deleteComment()
                    break;

                case 'post' : 
                    console.log('panelType : post !!!')
                    this.deletePost()
                    break;

                case 'user' :
                    this.deleteUser()
                    break;

                default:
                    console.log('Erreur, mauvais panelType')

            }
        },
        deleteUser() {
            console.log('deleteUser !')

            const userId = this.userId
            const data = JSON.stringify({
                userId
            })
            console.log('deleteUser')
            console.log(`userId : ${userId}`)

            fetch(`http://localhost:3000/api/auth/user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                mode:'cors',
                body: data
            }).then((response) => {
                return response.json()
            }).then(() => {
                console.log('delete user fini')
                this.$emit('closePanelEvent')
                this.$emit('refreshWallEvent')
            }).catch(() => console.log('error avec FETCH ?'))

        },
        deletePost() {
            const postId = this.postId
            const data = JSON.stringify({
                postId
            })
            console.log('deletePost')
            console.log(`postId : ${postId}`)

            fetch(`http://localhost:3000/api/post`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                mode:'cors',
                body: data
            }).then((response) => {
                return response.json()
            }).then(() => {
                console.log('delete post fini')
                this.$emit('closePanelEvent')
                this.$emit('refreshWallEvent')
            }).catch(() => console.log('error avec FETCH ?'))
        },
        deleteComment() {

            const commentId = this.commentId
            const data = JSON.stringify({
                commentId
            })
            
            fetch(`http://localhost:3000/api/comments`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                mode:'cors',
                body: data
            }).then((response) => {
                return response.json()
            }).then(() => {
                console.log('delete comment fini')
                this.$emit('closePanelEvent')
                this.$emit('refreshWallEvent')
            }).catch(() => console.log('error avec FETCH ?'))
        }
        
        
    },
    computed: {
        ...mapState([
            'userId',
            'token'
        ])
    },
}
</script>

<style>
    .deletePanel {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(50,50,50, 0.5);
    }

    .deletePanel__content {
        width: 30%;
        background-color: #fff;
        margin: 20% auto;
        padding: 1rem;
    }

    .deletePanel__btns {
        margin: 1rem auto 0 auto;
        text-align: center;
    }

    .cancel__btn, .validate__btn {
        background-color: #aaa;
        padding: 0.5rem;
        margin: 0.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
    }
</style>