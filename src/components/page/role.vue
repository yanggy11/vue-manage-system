<template>
    <div class="table">
        <div class="crumbs">

        </div>

        <div class="container">
            <div ></div>
        </div>
    </div>

</template>

<script>

    import {getData, postData, deleteData} from '../../js/baseHttp'

    export default {
        data() {
            return {
                page: {
                    cur_page: 1,
                    cur_size: 20,
                    totalRecord: 0
                }
            }
        },
        created() {
        },
        methods: {
            getRoles() {
                postData()
            }
        }
    }
</script>

<style scoped>

</style>
