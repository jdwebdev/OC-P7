<template>
    <header>
        <div class="header__div">
            <img class="header__img" src='../assets/icon90.png' />
            <h1 class="header__title">Groupomania</h1>
            <button class="header__btn" @click="collapse">
                <i v-show="navCollapse" class="fas fa-chevron-up"></i>
                <i v-show="!navCollapse" class="fas fa-chevron-down"></i>
            </button>
            
        </div>
        <div v-show="navCollapse" class="header__navcollapse">
            <nav class="header__nav">
                <ul>
                    <li><a>Accueil</a></li>
                    <li><a>link 1</a></li>
                    <li><a>link 1</a></li>
                    <!-- <router-link to="/">Home</router-link> -->
                </ul>
            </nav>
        </div>
    </header>
</template>

<script>
export default {
    nom: 'Header',
    data() {
        return {
            navCollapse: false
        }
    },
    methods: {
        collapse() {
            this.navCollapse = !this.navCollapse
        }
    }
}
</script>

<style>
    header {
        height: 100px;
        background-color: #444;
        padding: 1rem;
        font-family: 'Lato', sans-serif;
    }
    .navbar {
        height: 100%;
    }
    .header__img {
        width: 50px;
        height: 50px;
        border-radius: 3rem;
    }
    .header__div {
        height: 100%;
        display:flex;
        align-items: center;
        justify-content: space-between;
    } 
    .header__title {
        font-size: 2rem;
        font-weight: bolder;
        color: #fd2d01;
    }
    .header__btn {
        width: 60px;
        height: 60px;
        background-color: #555;
        border-style: none;
        border-radius: 0.8rem;
        padding: 0.8rem;

        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
    .header__btn .fas {
        color: white;
        font-size: 2rem;
    }
    .header__navcollapse {
        background-color: #444;
        position: relative;
        left:-1rem;
        width: 100vw;
        height: 100vh;
        padding-top: 1rem;
        /*border: 1px solid black;*/
    }
    .header__navcollapse li {
        list-style: none;
        margin: 1rem;
        font-size: 2rem;
        text-align: center;
        
    }
    .header__nav a{
        display: inline-block;
        /*margin: 2px;*/
        height: 50px;
        width: 95%;
        background-color: white;
        border-radius: 1rem;
    }

    @media screen and (min-width: 768px) {

    }
</style>