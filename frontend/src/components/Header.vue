<template>
    <header>
        <div class="header__div">
            <img class="header__img" src='../assets/icon90.png' />
            <h1 class="header__title">Groupomania</h1>
        </div>
    </header>
</template>

<script>
export default {
    nom: 'Header'
}
</script>

<style>
    header {
        height: 100px;
        background-color: #354c6e;
        padding: 1rem;
        font-family: 'Lato', sans-serif;
    }
    .navbar {
        height: 100%;
    }
    
    .header__div {
        height: 100%;
        display:flex;
        align-items: center;
        justify-content: center;
    } 
    .header__img {
        width: 50px;
        height: 50px;
        border-radius: 3rem;
        
    }
    .header__title {
        font-size: 2rem;
        font-weight: bolder;
        color: #d1515a;
        margin-left: 2rem;
    }

    @media screen and (max-width: 450px) {
        .header__div {
            justify-content: space-around;
        }

        .header__img {
            margin-right: 0px; 
        }
        .header__title {
            flex:0 !important;
            margin-left: 0px;
        }
    }
</style>