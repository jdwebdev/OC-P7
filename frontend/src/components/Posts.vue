<template>
    <div class="postSection">
        <div class="postSection__header">
            <img class="postSection__profileImg" :src="userImgUrl" />
            <h3 class="postSection__username"><router-link class="postSection__router" :to="`/Profile/${postUserId}`" title="Voir le profil">{{ postUsername }} Id: {{ postId }}</router-link></h3>
            <div v-if="username == postUsername || isAdmin == 1" class="postSection__editDeleteBtns">
                <div :class="`postSection__edit postEdit-${postId}`" @click="toggleModal()" title="Éditer le post"><i class="fas fa-edit"></i></div>
                <div :class="`postSection__delete postDelete-${postId}`" @click="toggleDeletePanel()" title="Supprimer le post"><i class="fas fa-trash-alt"></i></div>
            </div>
        </div>
        
        <p class="postSection__date">{{ dateFormat('date') }} : {{ dateFormat('time') }}</p>
        
        <div class="separation"></div>
        <p class="postSection__content">{{ content }}</p>
        <img v-if="imageUrl" class="postSection__image" :src="imageUrl">
        <div class="likeDislike">
            <span :class="`thumbUp-${postId}`" @click="likeDislike($event)"><i class="far fa-thumbs-up"></i> {{ likes }}</span>
            <span :class="`thumbDown-${postId}`" @click="likeDislike($event)"><i class="far fa-thumbs-down"></i> {{ dislikes }}</span>
        </div>
        
        <div class="commentSection">
            <label for="commentInput">Ajouter un commentaire: </label>
            <textarea :class="`com-${postId}`" id="commentInput" type="text" />
            <button class="commentBtn" @click="submitComment($event)">Envoyer</button>
            <p class="comments" v-if="comments[0]">Commentaires :</p>
            <Comments 
                v-for="comment in comments"
                :commentUserId="comment.User.id"
                :username="comment.User.username"
                :currentUser="username"
                :content="comment.content"
                :imageUrl="comment.User.imageUrl"
                :postId="postId"
                :commentId="comment.id"
                @refreshWallEvent="refreshWall"
                :key="comment.id"
            />
        </div>
        <Modal 
            v-if="showModal"
            @toggleModalEvent="toggleModal"
            @refreshWallEvent="refreshWall"
            :modalType="'post'"
            :contentValue="content"
            :imageUrl="imageUrl"
            :postId="postId"
        />
        <Delete 
            v-if="deletePanel" 
            :panelType="'post'"
            @closePanelEvent="toggleDeletePanel"
            @refreshWallEvent="refreshWall"
            :postId="postId"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Comments from '@/components/Comments'
import Modal from '@/components/Modal'
import Delete from './Delete.vue'


export default {
    name: 'Posts',
    data () {
        return {
            userImgUrl: '/user-icon.png',
            showModal: false,
            deletePanel: false
        }
    },
    props: {
        postUserId: {
            type: Number,
            required: true
        },
        postUsername: {
            type: String,
            required: true
        },
        userImg: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String, 
            required: false
        },
        likes: {
            type: Number,
            required: true
        },
        dislikes: {
            type: Number,
            required: true
        },
        createdAt: {
            type: String,
            required: true
        },
        comments: {
            type: Array,
            required: false
        },
        postId: {
            type: Number,
            required: true
        }
    },
    components: {
        Comments,
        Modal,
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
        dateFormat(format) {
            if (format === 'date') {
                const engFormat = this.createdAt.split('T')[0]
                const year = engFormat.split('-')[0]
                const month = engFormat.split('-')[1]
                const day = engFormat.split('-')[2]
                return `${day}-${month}-${year}`
            } else if (format === 'time') {
                const time = this.createdAt.split('T')[1]
                return time.split('.')[0]
            }
        },
        submitComment(e) {
            e.preventDefault();
            const userId = this.userId
            const postId = this.postId
            let input = document.querySelector(`.com-${postId}`)
            const content = input.value
            const data = JSON.stringify({
                content,
                userId,
                postId
            })

            fetch('http://localhost:3000/api/comments/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                mode:'cors',
                body: data
            }).then((response) => {
                return response.json()
            }).then(() => {
                input.value = ''
                this.refreshWall()
            }).catch((e) => console.log(e))
        },
        checkLikes() {
            if (this.likes > 0) {
                
                const userId = this.userId
                const postId = this.postId

                fetch(`http://localhost:3000/api/post/like/${userId}/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((response) => {
                    return response.json()
                }).then((r) => {
                    if (r.likeFound) {
                        const thumb = document.querySelector(`.thumbUp-${postId}`)
                        thumb.style.color = 'green'
                        thumb.children[0].classList.remove('far')
                        thumb.children[0].classList.add('fas')
                    } else if (r.dislikeFound) {
                        const thumb = document.querySelector(`.thumbDown-${postId}`)
                        thumb.style.color = 'red'
                        thumb.children[0].classList.remove('far')
                        thumb.children[0].classList.add('fas')
                    }
                }).catch((e) => console.log(e))
            }
        },
        likeDislike(e) {

            let thumb = e.currentTarget

            // Si le bouton est le bouton "like"
            if (thumb.classList[0].split('-')[0] == 'thumbUp') {

                const otherThumb = document.querySelector(`.thumbDown-${this.postId}`)
                if (otherThumb.style.color == 'red') {
                    return console.log('Ne peut liker pendant que l autre est actif')
                }

                // Changement de couleur et d'icône
                if (thumb.style.color == 'green') {
                    thumb.style.color = null
                    thumb.children[0].classList.remove('fas')
                    thumb.children[0].classList.add('far')
                } else if (thumb.style.color != 'green') {
                    thumb.style.color = 'green'
                    thumb.children[0].classList.remove('far')
                    thumb.children[0].classList.add('fas')
                }

                const userId = this.userId
                const postId = this.postId

                const data = JSON.stringify({
                    userId,
                    postId
                })

                fetch('http://localhost:3000/api/post/like/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    mode:'cors',
                    body: data
                }).then((response) => {
                    return response.json()
                }).then(() => {
                    this.refreshWall()
                }).catch((e) => console.log(e))

            } else { // Si le bouton est le bouton "dislike"
                const otherThumb = document.querySelector(`.thumbUp-${this.postId}`)
                if (otherThumb.style.color == 'green') {
                    return console.log('Ne peut disliker pendant que l autre est actif')
                }

                // Changement de couleur et d'icône
                if (thumb.style.color == 'red') {
                    thumb.style.color = null
                    thumb.children[0].classList.remove('fas')
                    thumb.children[0].classList.add('far')
                } else if (thumb.style.color != 'red') {
                    thumb.style.color = 'red'
                    thumb.children[0].classList.remove('far')
                    thumb.children[0].classList.add('fas')
                }

                const userId = this.userId
                const postId = this.postId

                const data = JSON.stringify({
                    userId,
                    postId
                })

                fetch('http://localhost:3000/api/post/dislike/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    mode:'cors',
                    body: data
                }).then((response) => {
                    return response.json()
                }).then(() => {
                    this.refreshWall()
                }).catch((e) => console.log(e))
            }
        },
        refreshWall() {
            this.$emit('refreshWallEvent')
        },
        toggleModal() {
            this.showModal = !this.showModal
        },
        toggleDeletePanel() {
            this.deletePanel = !this.deletePanel
        }
    },
    created() {
        if (this.userImg) {
            this.userImgUrl = this.userImg
        }
        this.checkLikes()
    }
}
</script>

<style>
    .postSection {
        width: 80%;
        margin: 2rem auto;
        padding: 1rem;
        background-color: #ddd;
        border-radius: 1rem;
        text-align: center;
    }
    .postSection__header {
        position: relative;
        display: flex;
        align-items: flex-start;
    }
    .postSection__profileImg {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 1rem;
    }
    .postSection__username {
        background-color: #aaa;
        border-radius: 1rem;
        text-align: center;
        padding: 0.5rem 0.7rem;
        
        margin-bottom: 0.5rem;
    }
    .postSection__router {
        text-decoration: none;
        font-size: 0.9rem;
    }

    .postSection__date {
        text-align: left;
    }
    .postSection__editDeleteBtns {
        font-size: 1.5rem;
        color: #444;
        position: absolute;
        right: 30px;
        top: 5px;
    }
    
    .postSection__edit, .postSection__delete {
        display: inline-block;
        position: relative;
        margin-right: 1rem;
        left: 40%;
        cursor: pointer;
    }
    

    .postSection__edit:hover {
        color: blue;
    }
    .postSection__delete:hover {
        color:red;
    }

    .postSection__content {
        font-size: 1rem;
        text-align: left;
        margin: 0.5rem 0 0.5rem 0;
    }
    
    .postSection__image {
        margin: 1rem auto;
        width: 70%;
        background-color: #fff;
        border-radius: 0.5rem;
        box-shadow: 0px 0px 10px black;
    }
    .separation {
        height: 2px;
        background-color: black;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .likeDislike {
        font-size: 2rem;
    }

    .likeDislike span {
        margin: 2rem;
        cursor: pointer;
    }

    .commentSection {
        background-color: #777;
        padding: 0.5rem;
        margin-top: 1rem;
        border-radius: 0 0 1rem 1rem
    }
    .commentSection label {
        display: block;
        color: #fff;
    }
    .commentSection textarea {
        display: block;
        min-width: 70%;
        max-width: 70%;
        margin: 0 auto;
        padding: 0.5rem;
        height: 4rem;
    }

    .commentBtn {
        padding: 0.5rem;
        margin: 1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
    }

    .comments {
        color: #fff;
        font-size: 1rem;
        text-align: left;
    }

    @media screen and (max-width: 768px) {
        .postSection {
            width: 95%;
        }
        .postSection__editDeleteBtns {
            font-size: 1.2rem;
            right: 20px;
        }

        .postSection__image {
            padding: 0;
            width: 100%;
        }
        .likeDislike {
            font-size: 1.5rem;
        }

        .commentSection textarea {
            min-width: 100%;
            max-width: 100%;
        }
    }
</style>