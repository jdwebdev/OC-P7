<template>
    <div class="wall">
        <h2>Bienvenue {{ username }}<span v-if="isAdmin == 1"> ADMIN</span></h2>
        <router-link class="wall__router" :to="`/Profile/${userId}`">Mon profil</router-link>
        <button class="wall__logout" @click="logout($event)">Se déconnecter</button>
        <form v-if="requestOk" class="post__form">
            <label for="post">Postez ce que vous voulez :)</label>
            <textarea id="post" type="text" />
            <div class="postBtns">
                <p class="wall__imgError" v-if="imgFormatError">Mauvais format ! Formats acceptés jpg, jpeg, png ou gif</p>
                <label for="insertImg">Insérer une image : </label>
                <input class="insertFile" id="insertImg" type="file" />
                <button class="postBtn" @click="submitPost($event)">Poster</button>     
            </div>
        </form>

        <Posts 
            v-for="post in posts" 
            :postUserId="post.User.id"
            :postUsername="post.User.username"
            :userImg="post.User.imageUrl"
            :content="post.content"
            :imageUrl="post.imageUrl"
            :likes="post.likes"
            :dislikes="post.dislikes"
            :createdAt="post.createdAt"
            :comments="post.commentPost"
            :postId="post.id"
            :key="post.id"
            @refreshWallEvent="getAllPosts" 
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Posts from '@/components/Posts.vue'
import router from '@/router/index.js'

export default {
    name: 'Wall',
    data () {
        return {
            posts: null,
            requestOk: false,
            imgFormatError: false
        }
    },
    components: {
        Posts
    },
    methods: {
        logout(e) {
            e.preventDefault()
            window.localStorage.removeItem('token')
            const user = {
                userId: 0,
                username:'',
                token: '',
                isAdmin: 0
            }
            this.$store.commit('SAVE_USER', user)

            router.push('/')
        },
        submitPost(e) {
            e.preventDefault()
            const id = this.userId
            let input = document.getElementById('post')
            let imgInput = document.getElementById('insertImg')
            
            const content = input.value
            const file = imgInput.files[0]

            if (file) {
                if (file.type && file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'image/gif') {
                    this.imgFormatError = true
                    return console.log('erreur de format !!')
                } else {
                    this.imgFormatError = false
                }
            }
            
            const formData = new FormData()
            formData.append('id', id)
            formData.append('content', content)
            formData.append('image', file)

            fetch('http://localhost:3000/api/post/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                mode:'cors',
                body: formData
            }).then((response) => {
                return response.json()
            }).then(() => {
                input.value = ''
                imgInput.value = null
                this.getAllPosts()
            }).catch((e) => console.log(e))
        },

        getAllPosts() {

            fetch('http://localhost:3000/api/post', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }}
            )
            .then((response) => response.json())
            .then((posts) => {
                this.posts = Object.keys(posts).map(k => posts[k])[0]
                this.requestOk = true
                
            }).catch((e) => {
                console.log(e)
            })
        }
    },
    computed: {
        ...mapState([
            'userId',
            'username',
            'token',
            'isAdmin'
        ])
    },
    created () {
        this.getAllPosts()
    }
}
</script>

<style>
    .wall {
        background-color: #aaa;
        width: 60vw;
        margin: 1rem auto;
        padding-top: 1rem;
        padding-bottom: 1rem;
        text-align: center;
    }
    .wall label {
        font-size: 1rem;
        margin: 0.5rem auto;
    }

    .wall__logout {
        padding: 0.5rem;
        border: none;
        border-radius: 0.5rem;
        background-color: #D1515A;
        margin-left: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        cursor: pointer;
        color: #fff;
    }

    .wall__router {
        font-size: 0.8rem;
        text-decoration: none;
        background-color: #3c557c;
        padding: 0.5rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        color: #fff;
    }

    .wall__imgError {
        color: red;
        font-size: 1rem;
    }

    .post__form {
        display:flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .post__form textarea {
        min-width: 80%;
        max-width: 80%;
        margin: 0 auto;
        padding: 0.5rem;
        height: 4rem;
    }
    .postBtns {
        background-color: #3c557c;
        width: 80%;
        padding: 1rem;
    }
    .postBtns label {
        font-size: 0.8rem;
        color: #fff;
    }
    .postBtn {
        padding: 0.5rem;
        margin: 0.5rem;
        border-radius: 0.5rem;
        border: none;
        width: 5rem;
        cursor: pointer;
    }
    .insertFile {
        width: 300px;
        margin-right: 1rem;
        cursor: pointer;
    }

    @media screen and (max-width: 768px) {
        .wall {
            width: 95vw;
        }
        .post__form {
            width: 100%;
        }
        .post__form textarea {
            min-width: 95%;
            max-width: 95%;
        }
        .postBtns {
            width: 95%;
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .insertFile {
            width: 90%;
            margin: 0;
        }
    }
</style>