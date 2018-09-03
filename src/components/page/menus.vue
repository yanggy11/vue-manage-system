<template>
    <div class="table">
        <div>
            <el-form :inline="true" class="demo-form-inline" style="display:flex; justify-content: space-between;">
                <el-form-item>
                    <el-button type="primary">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

import { formatDate } from '../../js/date.js'
export default {
    data() {
        return {
            menus: [],
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
            console.log(currentPage);
            console.log(currentSize)
            let self = this;
            self.$http.post('http://localhost:1987' + '/users/menu/getAllMenus',
                { page: currentPage, pageSize: currentSize },
                { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                then(function(data) {
                    let pageData = data.body;
                    self.total = pageData.totalRecord;
                    self.menus = data.body.data;
                    self.loading = false;

                    this.$message.success("成功加载菜单列表！");
                }, function(data) {
                    this.$$message.error("加载失败!");
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
            console.log(dynamicId);
            let self = this;
            self.$http.post('http://localhost:1987' + '/users/route/disableRoute', { routeId: dynamicId, enabled: enabled }, { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).then(function(data) {
                this.$message.success("操作成功！");
                this.getData(this.cur_page, this.cur_size);
            }, function(data) {
                this.$$message.error("操作失败!");
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
    height: 30;
    padding: 20px 20px 0;
    text-align: left;
    background-color: lightblue;
}
</style>
