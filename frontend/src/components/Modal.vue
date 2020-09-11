<template>
    <div class="modal">
        <div class="modal__content">
            <h2>Modifier mon {{ modalType }}</h2>
            <form class="modal__form">
                <label for="contentArea">Modifier le contenu : </label>
                <textarea :class="`content-${postId}`" id="contentArea" type="text" :value="contentValue" />
                <div class="modal__imgContainer" v-if="modalType == 'post'">
                    <label v-if="imageUrl">Image actuelle : </label>
                    <img v-if="imageUrl" class="modal__img" :src="imageUrl" />
                    <p class="modal__imgError" v-if="imgFormatError">Mauvais format ! Formats acceptés jpg, jpeg, ou png</p>
                    <label v-if="imageUrl" for="modal__insertImg">Modifier l'image : </label>
                    <label v-if="!imageUrl" for="modal__insertImg">Ajouter une image : </label>
                    <input class="modal__insertFile" id="modal__insertImg" type="file" />
                </div>
                <div class="modal__btns">
                    <button type="button" class="modal__btn" @click="closeModal()">Annuler</button>   
                    <button type="button" class="modal__btn" @click="updateContent()">Valider</button>   
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    Name: 'Modal',
    data () {
        return {
            imgFormatError: false
        }
    },
    props: {
        modalType: {
            type: String,
            required: true
        },
        contentValue: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: false
        },
        postId: {
            type: Number,
            required: true
        },
        commentId: {
            type: Number,
            required: false
        }
    },
    methods: {
        closeModal() {
            this.$emit('toggleModalEvent')
        },
        updateContent() {

            if (this.modalType == 'post') {

                const contentInput = document.querySelector(`.content-${this.postId}`)
                const imgInput = document.getElementById('modal__insertImg')

                const id = this.postId
                const content = contentInput.value
                const file = imgInput.files[0]

                if (file) {
                    if (file.type != 'image/jpeg' && file.type != 'image/png') {
                        this.imgFormatError = true
                        return console.log('erreur de format !!')
                    } else {
                        this.imgFormatError = false
                    }
                }

                // Si au clic, il n'y a pas de nouvelles images et que le contenu n'a pas changé, on ferme juste le modal
                if (!imgInput.files[0] && content == this.contentValue) {
                    this.$emit('toggleModalEvent')
                } else {

                    const formData = new FormData()
                    formData.append('id', id)
                    formData.append('content', content)
                    formData.append('image', file)

                    fetch(`http://localhost:3000/api/post`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        },
                        mode:'cors',
                        body: formData
                    }).then((response) => {
                        return response.json()
                    }).then(() => {
                        this.$emit('toggleModalEvent')
                        this.$emit('refreshWallEvent')
                    }).catch(() => console.log('error'))
                }
            } else if (this.modalType == 'commentaire') {

                const content = document.getElementById('contentArea').value
                const commentId = this.commentId

                const data = JSON.stringify({
                    content, 
                    commentId
                })

                fetch(`http://localhost:3000/api/comments`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    mode:'cors',
                    body: data
                }).then((response) => {
                    return response.json()
                }).then(() => {
                    this.$emit('toggleModalEvent')
                    this.$emit('refreshWallEvent')
                }).catch(() => console.log('error'))
            }
        }
    },
    computed: {
        ...mapState([
            'token'
        ])
    }
}
</script>

<style>
    .modal {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(50,50,50, 0.5);
        display:flex;
        justify-content: center;
        align-items: center;
    }

    .modal__form {
        display:flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .modal__content {
        width: 50%;
        background-color: #fff;
        margin: 20% auto;
        padding: 1rem;
    }

    #contentArea {
        min-width: 70%;
        max-width: 70%;
        height: 4rem;
        padding: 0.5rem;
        margin-bottom: 1rem;
    }

    .modal__imgContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal__img {
        width: 30%;
        margin-bottom: 0.5rem;
        border: 1px solid black;
        border-radius: 1rem;
    }

    .modal__imgError {
        color: red;
        font-size: 1rem;
    }

    .modal__btns {
        display: flex;
        margin-top: 1rem;
    }

    .modal__btn {
        background-color: #aaa;
        padding: 0.5rem;
        margin: 0.5rem;
        border-radius: 0.5rem;
        border: none;
        width: 5rem;
        cursor: pointer;
    }
    @media screen and (max-width: 768px) {
        .modal__content {
            width: 95%;
        }
        #contentArea {
            min-width: 100%;
            max-width:100%;
        }
    }
</style>