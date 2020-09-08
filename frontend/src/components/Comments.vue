<template>
    <div class="singleComment">
        <div class="singleComment__userInfo">
            <img class="singleComment__profileImg" :src="userImgUrl" />
            <h3 class="singleComment__username">{{ username }}</h3>
        </div>

        <!-- TODO :   || isAdmin = 1 !!!!  -->
        <div v-if="username == currentUser" class="singleComment__editDeleteBtns">
            <div class="singleComment__edit" @click="toggleModal()" title="Éditer le commentaire"><i class="fas fa-edit"></i></div>
            <div class="singleComment__delete" @click="toggleDeletePanel()" title="Supprimer le commentaire"><i class="fas fa-trash-alt"></i></div>
        </div>
        <p class="singleComment__content">{{ content }}</p>
        <Modal 
            v-if="showCommentModal"
            @toggleModalEvent="toggleModal"
            @refreshWallEvent="refreshWall"
            :modalType="'commentaire'"
            :contentValue="content"
            :imageUrl="imageUrl"
            :postId="postId"
            :commentId="commentId"
        />
        <Delete 
            v-if="deletePanel" 
            :panelType="'comment'"
            @closePanelEvent="toggleDeletePanel"
            @refreshWallEvent="refreshWall"
            :commentId="commentId"
        />

    </div>
</template>

<script>
import Modal from './Modal.vue'
import Delete from './Delete.vue'

export default {
    name: 'Comment',
    data () {
        return {
            userImgUrl: '/user-icon.png',
            showCommentModal: false,
            deletePanel: false
        }
    },
    components: {
        Modal,
        Delete
    },
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
        currentUser: {
            type: String, 
            required: true
        },
        postId: {
            type: Number,
            required: false
        },
        commentId: {
            type: Number,
            required: true
        }
    },
    methods: {
        refreshWall() {
            this.$emit('refreshWallEvent')
        },
        toggleModal() {
            this.showCommentModal = !this.showCommentModal
        },
        toggleDeletePanel() {
            this.deletePanel = !this.deletePanel
        }
    },
    created () {
        if (this.imageUrl) {
            this.userImgUrl = this.imageUrl
        } else {
            this.userImgUrl = '/user-icon.png'
        }
    }
}
</script>

<style>
    .singleComment {
        position: relative;
        background-color: #fff;
        text-align: left;
        margin: 0.5rem auto;
        padding: 0.4rem;
        width: 90%;
    }
    .singleComment__userInfo {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .singleComment__profileImg {
        width: 30px;
        height: 30px;
        margin-bottom: 0.5rem;
        border-radius: 50%;
        margin-right: 1rem;
    }
    
    .singleComment__username {
        font-size: 1rem;
    }

    .singleComment__editDeleteBtns {
        font-size: 1.3rem;
        color: #444;
        width: 65px;
        position: absolute;
        margin-right: 0.5rem;
        right: -10px;
        top: 10px;
    }
    .singleComment__edit, .singleComment__delete {
        display: inline-block;
        margin-top: 0.2rem;
        margin-right: 0.7rem;
        cursor: pointer;
    }
    .singleComment__edit:hover {
        color: blue;
    }
    .singleComment__delete:hover {
        color: red;
    }
    .singleComment__content {
        font-size: 1rem;
    }
</style>