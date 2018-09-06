<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="criteria" class="demo-form-inline"
                         style="display:flex; justify-content: space-between;">
                    <div>
                        <el-form-item>
                            <el-button @click="openRoleInfo(2)" type="primary">新增</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="deleteRole([])" type="primary">批量删除</el-button>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="角色名称" :label-width="labelWidth">
                            <el-input v-model="criteria.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色" :label-width="labelWidth">
                            <el-input v-model="criteria.role"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getRoles">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <el-table :data="roles" border style="width: 100%" @selection-change="selectRows">
                <el-table-column type="selection" width="50"/>
                <el-table-column prop="id" label="id" align="center"/>
                <el-table-column prop="role" label="角色" align="center"/>
                <el-table-column prop="roleName" label="角色名称" align="center"/>
                <el-table-column prop="remark" label="备注" align="center"/>
                <el-table-column label="操作" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="openRoleInfo(1, scope.row)" icon="delete">编辑
                        </el-button>

                        <el-button size="small" type="danger" @click="deleteRole([scope.row.id])" icon="delete">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination></el-pagination>
            </div>
        </div>

        <div style="width:30%;">
            <el-dialog title="角色信息" :visible.sync="roleInfoDialog" :modal="true" center>
                <el-form ref="roleForm" :model="roleInfo" :rules="rules">
                    <el-form-item label="角色" :label-width="labelWidth" prop="role">
                        <el-input v-model="roleInfo.role" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="角色名称" :label-width="labelWidth" prop="roleName">
                        <el-input v-model="roleInfo.roleName" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="labelWidth" prop="remark">
                        <el-input v-model="roleInfo.remark" auto-complete="off"/>
                    </el-form-item>

                    <el-form-item label="资源列表">
                        <el-tree
                            style="border: 1px lightgray"
                            :data="resources"
                            :props="props"
                            show-checkbox
                            node-key="id"
                            ref="tree"
                            :default-expanded-keys="[1]"
                            :expand-on-click-node="false">
                        </el-tree>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelDialog">取 消</el-button>
                    <el-button type="primary" :disabled="roleFormDisabled" @click="saveRoleInfo">确 定
                    </el-button>
                </div>
            </el-dialog>
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
                },
                props: {
                    value: 'id',
                    label: 'resourceName'
                },
                resources: [],
                labelWidth: '80px',
                criteria: {
                    roleName: '',
                    role: '',
                },
                selected: [],
                roles: [],
                rules: {
                    role: [{
                        required: true, message: '请输入角色', trigger: 'change'
                    }, {
                        min: 3, max: 20, message: '长度在3-20字符之间', trigger: 'change'
                    }],
                    roleName: [{
                        required: true, message: '请输入角色名称', trigger: 'change'
                    }, {
                        min: 3, max: 20, message: '长度在3-20字符之间', trigger: 'change'
                    }],

                    remark: [{
                        max: 50, message: '长度在0-50字符之间', trigger: 'change'
                    }]

                },
                roleInfo: {
                    role: '',
                    roleName: '',
                    remark: ''
                },
                selectedItems: [],
                roleInfoDialog: false,
                roleFormDisabled: false
            }
        },

        created() {
            this.getRoles();
        },
        methods: {
            getRoles() {
                let self = this;
                let criteria = self.criteria;
                criteria.page = this.page.cur_page;
                criteria.pageSize = this.page.cur_size;

                postData(self.$config.role_url.get_roles_by_page, criteria).then(response => {
                    if (self.$config.OK == response.status) {
                        console.log(response.data);
                        self.roles = response.data;
                        // self.selected =

                        let len = self.roles.resources;

                        for (let i = 0; i < len; i++) {
                            self.selected.push(self.roles.resources[i].id);
                        }

                        console.log(self.selected);
                    } else {
                        self.$message.error(response.msg);
                    }
                }, response => {

                })
            },
            openRoleInfo(flag, row) {
                let self = this;
                self.roleInfoDialog = true;
                self.getResources();

                if (1 === flag) {
                    self.roleInfo = row;

                    return;
                }

                if (2 === flag) {
                    self.roleInfo = {};

                    return;
                }
            },
            getResources() {
                let self = this;
                postData('users/resources/getResourceTrees', {},).then(function (data) {

                    console.log(self.resources)
                    self.resources = data.data;
                    self.selected = self.selected;
                }, function (data) {

                    console.log(data)
                    self.$message({
                        message: data,
                        type: 'error',
                        center: true
                    });
                })
            },
            selectRows(selection) {

                let self = this;
                self.selectedItems = [];
                let len = selection.length;
                for (let i = 0; i < len; i++) {
                    self.selectedItems.push(selection[i].id);
                }
            },
            cancelDialog() {
                let self = this;
                self.roleInfoDialog = false;
                self.$refs.roleForm.resetFields();
            },
            saveRoleInfo() {
                let self = this;
                self.$refs.roleForm.validate(valid => {
                    if (valid) {
                        if (undefined == self.roleInfo.id) {
                            postData(self.$config.role_url.add_role_url, self.roleInfo).then(response => {
                                self.$message({
                                    message: response.msg,
                                    type: 'success',
                                    center: true
                                });

                                self.roleInfoDialog = false;

                                self.getRoles();
                            }, response => {

                            });
                        } else {
                            postData(self.$config.role_url.edit_role_url, self.roleInfo).then(response => {
                                self.$message({
                                    message: response.msg,
                                    type: 'success',
                                    center: true
                                });

                                self.roleInfoDialog = false;

                                self.getRoles();
                            }, response => {

                            });
                        }
                    }
                })
            },

            deleteRole(ids) {
                console.log(ids)
                let self = this;

                if (0 === ids.length) {
                    ids = self.selectedItems;
                }

                if (ids.length <= 0) {
                    self.$alert('请选择要删除的数据', {
                        confirmButtonText: '确定'
                    });

                    return;
                }

                self.$confirm('是否删除数据', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    deleteData(self.$config.role_url.delete_role_url, {roleIds: ids}).then(res => {

                            console.log(res)
                            self.$message({
                                type: 'success',
                                message: res.msg,
                                center: true
                            });
                            self.getRoles();
                        },
                        res => {
                            self.$message({
                                type: 'error',
                                message: res.msg,
                                center: true
                            });
                        });

                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style>
    .el-table td, .el-table th {
        padding: 2px 0;
        min-width: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
    }

    .el-dialog__header {
        padding: 10px 10px 10px;
        background-color: aliceblue;
    }
</style>
