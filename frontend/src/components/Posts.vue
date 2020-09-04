<template>
    <div class="postSection">
        <h3 class="postSection__username">{{ username }}</h3>
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
            <p class="comments">Commentaires :</p>
            <Comments 
                v-for="comment in comments"
                :username="comment.User.username"
                :content="comment.content"
                :key="comment.id"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Comments from '@/components/Comments'

export default {
    name: 'Posts',
    props: {
        username: {
            type: String,
            required: true
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
        Comments
    },
    computed: {
        ...mapState([
            'userId',
            'token'
        ])
    },
    methods: {
        dateFormat(format) {
            if (format === 'date') {
                return this.createdAt.split('T')[0]
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

            console.log(`userId: ${userId}`)
            console.log(`postId: ${postId}`)
            console.log(`content: ${content}`)

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
            }).then((r) => {
                console.log(r)
                input.value = ''
                this.$emit('refreshWallEvent')
            }).catch((e) => console.log(e))
        },
        checkLikes() {
            console.log('checklikes')
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
                        console.log('Like Trouvé !!!')
                        const thumb = document.querySelector(`.thumbUp-${postId}`)
                        thumb.style.color = 'green'
                        thumb.children[0].classList.remove('far')
                        thumb.children[0].classList.add('fas')
                    } else if (r.dislikeFound) {
                        console.log('Dislike trouvé !!!')
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
                }).then((r) => {
                    console.log(r)
                    this.$emit('refreshWallEvent')
                }).catch((e) => console.log(e))

            } else // Si le bouton est le bouton "dislike"
            {

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
                }).then((r) => {
                    console.log(r)
                    this.$emit('refreshWallEvent')
                }).catch((e) => console.log(e))

                // return console.log('stop function')
            }
        }
    },
    created() {
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
    .postSection__username {
        background-color: #aaa;
        width: 100px;
        border-radius: 1rem;
        text-align: center;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .postSection__date {
        text-align: left;
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
        padding: 1rem;
        border: 2px solid black;
        border-radius: 0.5rem;
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
        cursor: pointer;
    }

    .comments {
        color: #fff;
        font-size: 1rem;
        text-align: left;
    }
</style>