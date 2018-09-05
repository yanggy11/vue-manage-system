<template>

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
