<template>
    <div class="table">
        <div>
            <el-form :inline="true" class="demo-form-inline" style="display:flex; justify-content: space-between;">
                <el-form-item>
                    <el-button size="small" type="primary">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table v-loading.body="loading" :data="routes" border style="width: 100%">
            <el-table-column type="selection" width="50" fixed></el-table-column>
            <el-table-column prop="id" label="网关id" align="center" width="100" fixed>
            </el-table-column>
            <el-table-column prop="path" label="网关路径" align="center" width="150" fixed>
            </el-table-column>
            <el-table-column prop="serviceId" label="转发服务" align="center" fixed>
            </el-table-column>
            <el-table-column prop="stripPrefix" label="前缀" align="center" :formatter="prefixFormatter" width="60"
                             fixed/>
            <el-table-column prop="retryable" label="重试" align="center" :formatter="retryableFormatter" width="60"
                             fixed/>
            <el-table-column prop="enabled" label="启用" align="center" :formatter="enabledFormatter" width="60" fixed/>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormatter" fixed/>
            <el-table-column label="操作" align="center" fixed>
                <template slot-scope="scope">
                    <el-button size="small" icon="delete">编辑</el-button>
                    <el-button size="small" type="danger" @click="enableOrDisable(scope.row.dynamicId, true)"
                               icon="delete" v-if="scope.row.enabled == false">启用
                    </el-button>
                    <el-button size="small" type="danger" @click="enableOrDisable(scope.row.dynamicId, false)"
                               icon="delete" v-if="scope.row.enabled">关闭
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="foot_pagination">
            <el-form>
                <el-form-item>
                    <el-button size="small" type="primary">批量删除</el-button>
                </el-form-item>
            </el-form>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               layout="sizes,total, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 30]"
                               :total="total" :page-size="cur_size" :current-page="cur_page">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {formatDate} from '../../js/date.js'
    import {postData, deleteData, getData} from '../../js/baseHttp'

    export default {
        data() {
            return {
                routes: [],
                cur_page: 1,
                cur_size: 15,
                total: 1,
                loading: true,
                formLabelWidth: '80px',
            }
        },
        created() {
            this.getData(this.cur_page, this.cur_size);
        },
        methods: {
            handleSizeChange(val) {
                this.cur_size = val;
                this.getData(1, val);
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val, this.cur_size);
            },
            getData(currentPage, currentSize) {
                let self = this;
                postData(self.$config.routes_url.get_routes_url, {
                    page: currentPage,
                    pageSize: currentSize
                }).then(function (data) {
                    if (undefined != data) {
                        self.total = data.totalRecord;
                        self.routes = data.data;
                        self.loading = false;

                        self.$message({
                            message: '加载成功！',
                            type: 'success',
                            center: true
                        });
                    }
                })
            },
            dateFormatter(row) {
                return formatDate(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss");
            },
            enabledFormatter(row) {
                if (row.enabled === false) {
                    return "否";
                }
                return "是";
            },
            retryableFormatter(row) {
                if (row.retryable === false) {
                    return "否";
                }
                return "是";
            },
            prefixFormatter(row) {
                if (row.stripPrefix === false) {
                    return "否";
                }
                return "是";
            },
            enableOrDisable(dynamicId, enabled) {
                let self = this;
                postData(self.$config.routes_url.routes_disable_url, {
                    routeId: dynamicId,
                    enabled: enabled
                }).then(function (data) {
                    if (undefined != data) {
                        self.$message({
                            message: '加载成功！',
                            type: 'success',
                            center: true
                        });
                        self.getData(this.cur_page, this.cur_size);
                    }
                });
            }
        }
    }
</script>

<style scope>
    .el-dialog__wrapper .el-input__inner {
        width: 70%;
    }

    .el-dialog__wrapper .input {
        width: 70%;
    }

    .criteria {
        text-align: right;
        display: flex;
    }

    .table .el-dialog--small {
        width: 50%;
    }

    .table .el-dialog {
        width: 50%;
    }

    .table .el-button {
        margin-bottom: 0px;
    }

    .table .criteria {
        text-align: right;
    }

    .foot_pagination {
        display: flex;
        justify-content: space-between;
    }

    .foot_pagination .el-button {
        margin-bottom: 0px;
        margin-top: 15px;
    }

    .el-dialog__header {
        height: 30px;
        padding: 20px 20px 0;
        text-align: left;
        background-color: lightblue;
    }
</style>
