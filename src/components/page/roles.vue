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
                        <el-button type="primary" @click="openRoleInfoDialog">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="deleteRole">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="container">
                <el-tree
                    style="border: 1px lightgray"
                    :data="roles"
                    show-checkbox
                    node-key="id"
                    @check="nodeCheck">
                </el-tree>
            </div>
        </div>

        <div style="width:30%;">
        <el-dialog title="权限信息" :visible.sync="roleInfoDialog" :modal="true" @close="">
            <el-form>
                <el-form-item label="父节点" :label-width="formLabelWidth">
                        <el-cascader
                            placeholder="试试搜索：指南"
                            :options="roles"
                            :props="props"
                            change-on-select
                        ></el-cascader>
                </el-form-item>
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
    import { formatDate, processUrl } from '../../js/date.js'
    import {getData, postData,deleteData} from '../../js/baseHttp.js'
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
            role: {},
            selectedItems:[],//被选中的节点的id
            selected:[],
            props:{
                value :'id',
                label: 'label'
            }
        }
    },
    created() {
        this.getData(this.cur_page, this.cur_size);
    },
    methods: {
        deleteRole(){
            let self = this;
            if(undefined == self.selectedItems || self.selectedItems.length <= 0) {
                self.$alert('请选择需要删除的数据!!!', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                });

                return false;
            }
            self.$confirm('是否继续操作？','',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                postData(processUrl(self.$env,'users/roles/deleteRole'), { roleIds: self.selectedItems }).then(function(data) {
                    self.$message({message:'已删除！',
                        type:'success',
                        center:true
                    });
                    self.getData(self.cur_page, self.cur_size);
                }, function(data) {
                    this.$message({message:'操作失败！',
                        type:'error',
                        center:true
                    });
                });
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        traverseTree(node){
            if (!node) {
                return;
            }
            //判断子节点是否为空，若不为空继续遍历，否则删除子节点
            if (node.children && node.children.length > 0) {
                var i = 0;
                for (i = 0; i < node.children.length; i++) {
                    this.traverseTree(node.children[i]);
                }
            }else {
                delete node.children;
            }
        },
        nodeCheck(node, selected){
            let self = this;
            self.selectedItems = selected.checkedKeys;
        },
        handleSizeChange(val) {
            let self = this;
            self.cur_size = val;
            self.getData(1, val);
        },
        handleCurrentChange(val) {
            let self = this;
            self.cur_page = val;
            self.getData(val, this.cur_size);
        },
        getData(currentPage, currentSize) {
            let self = this;
            postData(processUrl(self.$env,'users/roles/getRoleTrees'), {},).then(function(data) {
                self.roles = data.data;
                self.selected = data.data;
                self.loading = false;
                self.$message({message:'加载成功！',
                    type:'success',
                    center:true
                });
            }, function(data) {
                self.$message({message:'操作失败！',
                    type:'error',
                    center:true
                });
            })
        },
        openRoleInfoDialog() {
            let self = this;
            self.roleInfoDialog = true;

            for(let i in self.selected) {
                let role = self.selected[i];
                self.traverseTree(role);
            }

            console.log(self.selected)
            console.log(self.roles)
        },
        saveRole() {
            let self = this
            if (self.role.id == undefined) {
                postData(processUrl(self.$env,'users/roles/addRole'), this.role).then(function(data) {
                    self.$message({message:'加载成功！',
                        type:'success',
                        center:true
                    });
                    self.getData(self.cur_page, self.cur_size);
                    self.roleInfoDialog = false;
                }, function(data) {
                    self.$message({message:'操作失败！',
                        type:'error',
                        center:true
                    });
                });
            } else {
                postData(processUrl(self.$env,'users/roles/editRole'), self.role).then(function(data) {
                    self.$message({message:'加载成功！',
                        type:'success',
                        center:true
                    });
                    self.getData(self.cur_page, self.cur_size);
                    self.roleInfoDialog = false;
                }, function(data) {
                    self.$message({message:'操作失败！',
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
