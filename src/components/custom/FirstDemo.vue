<template>
    <div class="firstDemo">
        <a href="javascript:void(0)" @click="clickMe">{{content}}--{{propse}}</a>
    </div>
</template>

<script>
    export default {
        props:['clickMe','content','propse']
    }
</script>

<style scoped>
    .firstDemo {
        width: 100px;
        height: 100px;
        background: #3a8ee6;
    }

    .firstDemo a {
        color: white;
        text-decoration: none;
    }
</style>
