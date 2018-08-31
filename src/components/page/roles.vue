<template>
    <div class="table">
        <div>
            <el-form :inline="true" class="demo-form-inline" style="display:flex; justify-content: space-between;">
                <el-form-item>
                    <el-button type="primary" @click="openRoleInfoDialog(undefined)">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table v-loading.body="loading" :data="roles" border style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="role" label="权限" align="center"  />
            <el-table-column prop="roleName" label="权限名称" align="center"/>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormatter" width="180" />
            <el-table-column prop="deleteFlag" label="是否删除" align="center" :formatter="deleteFlagFormatter" width="100" />
            <el-table-column label="操作" align="center" width="180">
                <template scope="scope">
                    <el-button size="small" :disabled="scope.row.deleteFlag==1" @click="openRoleInfoDialog(scope.row.id)" icon="edit">编辑</el-button>
                    <el-button size="small" :disabled="scope.row.deleteFlag==1" v-if="scope.row.deleteFlag == 0" type="danger" icon="delete" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="foot_pagination">
            <el-form>
                <el-form-item>
                    <el-button type="primary">批量删除</el-button>
                </el-form-item>
            </el-form>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes,total, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 30]" :total="total" :page-size="cur_size" :current-page="cur_page">
                </el-pagination>
            </div>
        </div>
        <div style="width:30%;">
            <el-dialog title="权限信息" :visible.sync="roleInfoDialog" :modal="true">
                <el-form>
                    <el-form-item label="权限" :label-width="formLabelWidth">
                        <el-input v-model="role.role" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="role.roleName" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="roleInfoDialog = false">取 消</el-button>
                    <el-button type="primary" @click="saveRole">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { formatDate } from '../../js/date.js'
export default {
    data() {
        return {
            roles: [],
            cur_page: 1,
            cur_size: 15,
            total: 1,
            loading: true,
            formLabelWidth: '80px',
            roleInfoDialog: false,
            role: {}
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
            self.$http.post('users/roles/getAllRolesInPage',
                { page: currentPage, pageSize: currentSize },
                { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                then(function(data) {
                    let pageData = data.body;
                    self.total = pageData.totalRecord;
                    self.roles = data.body.data;
                    self.loading = false;
                    this.$message({message:'加载成功！',
                        type:'success',
                        center:true
                    });
                }, function(data) {
                    this.$message({message:'操作失败！',
                        type:'error',
                        center:true
                    });
                })
        },
        dateFormatter(row) {
            return formatDate(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss");
        },
        deleteFlagFormatter(row) {
            if (row.deleteFlag === 0) {
                return "否";
            }
            return "是";
        },
        deleteRole(roleId) {
            console.log(roleId);
            let self = this;
            self.$http.post('users/roles/deleteRole', { roleId: roleId }, { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).then(function(data) {
                this.$message({message:'加载成功！',
                    type:'success',
                    center:true
                });
                this.getData(this.cur_page, this.cur_size);
            }, function(data) {
                this.$message({message:'操作失败！',
                    type:'error',
                    center:true
                });
            });
        },
        openRoleInfoDialog(roleId) {
            this.roleInfoDialog = true;
            if (roleId != undefined) {
                this.$http.post('users/roles/getRoleById', { roleId: roleId }, { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                    then(function(data) {
                        this.role = data.body.data;
                    }, function(data) {
                        this.$message({message:'操作失败！',
                            type:'error',
                            center:true
                        });
                    });
            } else {
                this.role = {};
            }
        },
        saveRole() {
            if (this.role.id == undefined) {
                this.$http.post('users/roles/addRole', this.role, { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).then(function(data) {
                    this.$message({message:'加载成功！',
                        type:'success',
                        center:true
                    });
                    this.getData(this.cur_page, this.cur_size);
                    this.roleInfoDialog = false;
                }, function(data) {
                    this.$message({message:'操作失败！',
                        type:'error',
                        center:true
                    });
                });
            } else {
                this.$http.post('users/roles/editRole', this.role, { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).then(function(data) {
                    this.$message({message:'加载成功！',
                        type:'success',
                        center:true
                    });
                    this.getData(this.cur_page, this.cur_size);
                    this.roleInfoDialog = false;
                }, function(data) {
                    this.$message({message:'操作失败！',
                        type:'error',
                        center:true
                    });
                });
            }
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
    width: 30%;
}

.table .el-dialog {
    width: 30%;
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
