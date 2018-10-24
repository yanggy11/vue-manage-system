<template>
    <div class="table">
        <div class="crumbs" align="center">
            <div class="container">
                <div class="handle-box">

                </div>
                <el-table v-loading:body="loading" :data="orders">
                    <el-table-column prop="id" label="id"/>
                </el-table>
            </div>
        </div>
    </div>

</template>

<script>

    import {formatDate} from '../../js/date.js'
    import {postData, deleteData} from '../../js/baseHttp.js'

    export default {
        data() {
            return {
                orders: [],
                loading: true
            }
        },
        created() {
            this.getOrders();
        },
        methods: {
            getOrders() {
                let self = this;
                let queryData = {};

                postData(self.$config.web_request_url.orders.url_get_orders, queryData).then(res => {
                    if (undefined != res) {
                        self.orders = res.data.orders;
                        self.loading = false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
