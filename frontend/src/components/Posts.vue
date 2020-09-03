<template>
    <div class="postSection">
        <h3 class="postSection__username">{{ username }}</h3>
        <p class="postSection__date">{{ dateFormat('date') }} : {{ dateFormat('time') }}</p>
        <div class="separation"></div>
        <p class="postSection__content">{{ content }}</p>
        <img v-if="imageUrl" class="postSection__image" :src="imageUrl">
        <div class="likeDislike">
            <!--<span><i class="fas fa-thumbs-up"></i></span>-->
            <span><i class="far fa-thumbs-up"></i> {{ likes }}</span>
            <!--<span><i class="fas fa-thumbs-down"></i></span>-->
            <span><i class="far fa-thumbs-down"></i> {{ dislikes }}</span>
            
        </div>
        
        
        <div class="commentSection">
            <label>Ajouter un commentaire: </label>
            <textarea type="text" />
            <button class="commentBtn">Envoyer</button>
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
        }
    },
    components: {
        Comments
    },
    data () {
        return {
            
        }
    },
    methods: {
        dateFormat(format) {
            if (format === 'date') {
                return this.createdAt.split('T')[0];
            } else if (format === 'time') {
                const time = this.createdAt.split('T')[1]
                return time.split('.')[0];
            }
        }
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
    .postSection__image {
        margin: 1rem auto;
        width: 50%;
        
    }
    .postSection__content {
        font-size: 1rem;
        text-align: left;
        margin: 0.5rem 0 0.5rem 0;
    }
    .postSection__image {
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