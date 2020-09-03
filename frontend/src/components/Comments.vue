<template>
    <div class="singleComment">
        <h3 class="singleComment__username">{{ username }}</h3>
        <p class="singleComment__content">{{ content }}</p>
    </div>
</template>

<script>
export default {
    name: 'Comment',
    props: {
        username: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }
}
</script>

<style>
    .singleComment {
        background-color: #fff;
        text-align: left;
        margin: 0.5rem auto;
        padding: 0.2rem;
        width: 90%;
    }
    .singleComment__username {
        font-size: 1rem;
    }

    .singleComment__content {
        font-size: 1rem;
    }
</style>