<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <el-form :inline="true" class="demo-form-inline" style="justify-content: space-between;">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="deleteRole">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="container">
                <el-tree
                    style="border: 1px lightgray"
                    :data="resources"
                    :props="props"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="[1]"
                    @check="nodeCheck"
                    :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button
                          icon="el-icon-plus"
                          type="text"
                          size="mini"
                          @click="append(data)"/>
                      <el-button
                          v-if=" 1 !=data.id"
                          icon="el-icon-edit"
                          type="text"
                          size="mini"
                          @click="edit(data)"/>

                      <el-button v-if="1 !=data.id"
                                 icon="el-icon-delete"
                                 type="text"
                                 size="mini"
                                 @click="remove(node, data)"/>
                    </span>
                    </span>
                </el-tree>
            </div>
        </div>

        <div style="width:30%;">
            <el-dialog title="权限信息" :visible.sync="resourceInfoDialog" :modal="true">

                <el-form :model="resource" ref="resourcesForm" :rules="rules">
                    <el-form-item label="父节点" :label-width="formLabelWidth">
                        <el-input :value="resource.parentLabel" :disabled="true"/>
                    </el-form-item>
                    <el-form-item label="权限" :label-width="formLabelWidth" prop="resource">
                        <el-input v-model="resource.resource" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="resourceName">
                        <el-input v-model="resource.resourceName" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resourceInfoDialog = false">取 消</el-button>
                    <el-button type="primary" @click="saveResources">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {formatDate} from '../../js/date.js'
    import {getData, postData, deleteData} from '../../js/baseHttp.js'

    export default {
        data() {
            return {
                resources: [],
                total: 1,
                loading: true,
                formLabelWidth: '80px',
                resourceInfoDialog: false,
                resource: {},
                selectedItems: [],//被选中的节点的id
                selected: [],
                resource: {
                    resource: ''
                },
                props: {
                    value: 'id',
                    label: 'resourceName'
                },
                rules: {
                    resource: [
                        {required: true, message: '权限不能为空'},
                        {min: 3, max: 30, message: '长度在3-20个字符之间'}],
                    resourceName: [
                        {required: true, message: '权限名称不能为空'},
                        {min: 3, max: 30, message: '长度在3-20个字符之间'}
                    ]
                }
            }
        },
        created() {
            this.getData();
        },
        methods: {
            remove(node, data) {
                //删除按钮，刷新页面
            },
            append(data) {
                let self = this;
                self.resourceInfoDialog = true;
                self.resource = {
                    parentId: data.id,
                    parentLabel: data.resourceName
                };
            },
            edit(data) {
                let self = this;
                self.resourceInfoDialog = true;
                self.resource = data;
            },
            deleteRole() {
                let self = this;
                if (undefined == self.selectedItems || self.selectedItems.length <= 0) {
                    self.$alert('请选择需要删除的数据!!!', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    });

                    return false;
                }
                self.$confirm('是否继续操作？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    postData( 'users/resources/deleteResource', {resourceIds: self.selectedItems}).then(function (data) {
                        self.$message({
                            message: '已删除！',
                            type: 'success',
                            center: true
                        });
                        self.getData();
                    }, function (data) {
                        self.$message({
                            message: '操作失败！',
                            type: 'error',
                            center: true
                        });
                    });
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            traverseTree(node) {
                if (!node) {
                    return;
                }
                //判断子节点是否为空，若不为空继续遍历，否则删除子节点
                if (node.children && node.children.length > 0) {
                    var i = 0;
                    for (i = 0; i < node.children.length; i++) {
                        this.traverseTree(node.children[i]);
                    }
                } else {
                    delete node.children;
                }
            },
            nodeCheck(data, checked) {
                let self = this;
                self.selectedItems = checked.checkedKeys;
                if (-1 == data.parentId) {
                    self.selectedItems.splice(self.selectedItems.indexOf(data.id), 1);
                } else {
                    if (self.selectedItems.indexOf(data.parentId) >= 0) {
                        self.selectedItems.splice(self.selectedItems.indexOf(data.parentId), 1);
                    }
                }
            },
            getData() {
                let self = this;
                postData('users/resources/getResourceTrees', {},).then(function (data) {
                    self.resources = data.data;
                    self.selected = data.data;
                    self.loading = false;
                }, function (data) {

                    console.log(data)
                    self.$message({
                        message: data,
                        type: 'error',
                        center: true
                    });
                })
            },
            saveResources() {
                let self = this;

                self.$refs.resourcesForm.validate(valid => {
                    if (valid) {
                        if (self.resource.id == undefined) {
                            postData('users/resources/addResource', this.resource).then(function (data) {
                                self.$message({
                                    message: '加载成功！',
                                    type: 'success',
                                    center: true
                                });

                                self.resourceInfoDialog = false;
                                self.getData();
                            }, function (data) {
                                self.$message({
                                    message: data,
                                    type: 'error',
                                    center: true
                                });
                            });
                        } else {
                            postData('users/resources/editResource', self.resource).then(function (data) {
                                self.$message({
                                    message: '加载成功！',
                                    type: 'success',
                                    center: true
                                });

                                self.resourceInfoDialog = false;
                                self.getData();
                            }, function (data) {
                                self.$message({
                                    message: data,
                                    type: 'error',
                                    center: true
                                });
                            });
                        }
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

    .el-form-item label {
        text-align: right;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
        background-color: aliceblue;
    }

    .el-dialog__header {
        height: 30px;
        padding: 10px 10px 10px;
        text-align: center;
        background-color: aliceblue;
    }
</style>
