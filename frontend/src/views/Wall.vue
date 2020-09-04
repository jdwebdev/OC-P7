<template>
    <div class="wall">
        <h2>Bienvenue {{ username }}</h2>
        <form v-if="requestOk" class="post__form">
            <label for="post">Postez ce que vous voulez :)</label>
            <textarea id="post" type="text" />
            <div class="postBtns">
                <label for="insertImg">Insérer une image :</label>
                <input class="insertFile" id="insertImg" type="file" />
                <button class="postBtn" @click="submitPost($event)">Poster</button>     
            </div>
        </form>

        <Posts 
            v-for="post in posts" 
            :username="post.User.username"
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

export default {
    name: 'Wall',
    data () {
        return {
            posts: null,
            requestOk: false
        }
    },
    components: {
        Posts
    },
    methods: {
        submitPost(e) {
            e.preventDefault();
            const id = this.userId
            let input = document.getElementById('post')
            let imgInput = document.getElementById('insertImg')
            
            const content = input.value
            const file = imgInput.files[0]

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
            }).then((r) => {
                console.log(r)
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
            'token'
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
        margin: 0 auto;
    }
    .wall label {
        font-size: 1rem;
        margin: 0.5rem auto;
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
        background-color: #777;
        width: 80%;
    }
    .postBtns label {
        font-size: 0.8rem;
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
</style>