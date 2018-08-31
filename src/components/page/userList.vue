<template>
    <div class="table">
        <div>
            <el-form :inline="true" :model="criteria" class="demo-form-inline" style="display:flex; justify-content: space-between;">
                <div>
                    <el-form-item>
                        <el-button type="primary" @click="openUserInfo(0,undefined)">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="deleteAll">批量删除</el-button>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="姓名">
                        <el-input v-model="criteria.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select v-model="criteria.sex" placeholder="请选择">
                            <el-option v-for="item in genders" :label="item.label" :value="item.value" :key="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryData">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <el-table v-loading.body="loading" :data="tableData" border style="width: 100%" @selection-change="selectRows">
            <el-table-column type="selection" width="50"/>
            <el-table-column prop="name" label="姓名" align="center" width="120" />
            <el-table-column prop="age" label="年龄" align="center" width="80" />
            <el-table-column prop="sex" label="性别" align="center" :formatter="sexFormatter" width="60" />
            <el-table-column prop="phone" label="手机号" align="center" width="110"  />
            <el-table-column prop="email" label="邮箱" align="center" width="200"/>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormatter" width="180" />
            <el-table-column prop="deleteFlag" label="是否删除" align="center" :formatter="deleteFlagFormatter" width="100" />
            <el-table-column label="操作" align="center" width="160">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="openUserInfo(1, scope.row.id)" icon="delete">编辑</el-button>

                    <el-button :disabled="scope.row.deleteFlag != 0" size="small" type="danger" @click="deleteUser(scope.row.id)" icon="delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="foot_pagination">
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes,total, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 30]" :total="total" :page-size="cur_size">
                </el-pagination>
            </div>
        </div>
        <div style="width:30%;">
            <el-dialog title="用户信息" :visible.sync="userInfoDialog"  :modal="true" center>
                <el-form ref="userForm" :model="userInfo" :rules="rules">
                    <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="userInfo.name" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
                        <el-input v-model="userInfo.age" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                        <el-input v-model="userInfo.phone" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                        <el-input v-model="userInfo.email" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" v-if="userInfo.id == undefined">
                        <el-input type="password" v-model="userInfo.password" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-radio v-model="userInfo.sex" class="radio" :label="1">女</el-radio>
                        <el-radio v-model="userInfo.sex" class="radio" :label="0">男</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="userInfoDialog = false">取 消</el-button>
                    <el-button type="primary" :disabled="userFormDisabled" @click="saveUserInfo('userForm')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { formatDate } from '../../js/date.js'
import {getData, postData,deleteData} from '../../js/baseHttp'
export default {
    data() {
        var checkAge = (rule, value, callback) => {

            if (!value) {
                return callback(new Error('年龄不能为空'));
            }

            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
            }

        };
        return {
            tableData: [],
            cur_page: 1,
            cur_size: 15,
            total: 1,
            loading: true,
            userInfoDialog: false,
            formLabelWidth: '80px',
            userInfo: {
                name:'',
                age:0,
                phone:'',
                email:'',
                sex:'1'
            },
            userFormDisabled: false,
            genders: [{
                value: "0",
                label: "男"
            }, {
                value: "1",
                label: "女"
            }],
            criteria: {
                gender: ''
            },
            rules:{
                name:[{ required: true, message: '姓名不能为空',trigger: 'blur'},
                    { min:3, max: 10, message: '长度在3-10个字符之间',trigger: 'change'}
                ],
                age:[{ required: true, message: '年龄不能为空'}],

                phone: [
                    {required: true, message:'请输入手机号', trigger:'blur'},
                    {max: 12, message:'长度不能大于12',trigger: 'change'}
                ],
                email: [
                    {required: true, message:'请输入邮箱', trigger:'blur'},{
                        type:'email',message:'请输入格式正确的邮箱'
                    }
                ]
            },
            selectedItems:[]
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
        selectRows(selection) {
            this.selectedItems = selection;
        },
        queryData() {
          this.getData(this.cur_page, this.cur_size);
        },

        getData(currentPage, currentSize) {
            let self = this;
            let data = { page: currentPage, pageSize: currentSize ,name: this.criteria.name, sex: this.criteria.sex};

            postData('users/api/user/userList', data).
                then(function(data) {

                    self.total = data.totalRecord;
                    self.tableData = data.data;
                    self.loading = false;

                }, function(data) {

                    self.$message({message: data,
                        type:'error',
                        center:true
                    });
                });

        },
        sexFormatter(row) {
            if (row.sex === 0) {
                return "男";
            }
            return "女";
        },
        deleteFlagFormatter(row) {
            if (row.deleteFlag === 0) {
                return "否";
            }
            return "是";
        },
        dateFormatter(row) {
            return formatDate(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss");
        },
        openUserInfo(flag, userId) {
            let self = this;
            self.userInfoDialog = true;
            self.userFormDisabled = false;
            if (flag == 1) {
                postData('user/getUserById', { userId: userId }).
                    then(function(data) {
                        self.userInfo = data.body.data;
                    }, function(data) {
                        this.$message({message:'加载失败！',
                            type:'error',
                            center:true
                        });
                    });
            } else {
                self.userInfo = { sex: 1 };
            }
        },
        saveUserInfo(userForm) {
            this.userFormDisabled = true;
            this.$refs[userForm].validate((valid)=>{
                if(valid) {
                    if (this.userInfo.id == undefined) {
                        this.addUser();
                    } else {
                        this.updateUser();
                    }
                }else {
                    this.userFormDisabled = false;
                    return false;
                }
            });

        },
        updateUser() {
            let self = this;
            postData('users/api/user/updateUserInfo', self.userInfo).
                then(function(data) {
                    self.userInfoDialog = false;
                    self.getData(self.cur_page, self.cur_size);
                }, function(data) {
                    self.userFormDisabled = false;
                    self.$message({message:'操作失败！',
                        type:'error',
                        center:true
                    });
                });
        },
        addUser() {

            let self = this;
            postData('users/api/user/register', self.userInfo,
                { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                then(function(data) {
                    self.userInfoDialog = false;
                    self.$message({
                        type: 'success',
                        message: '保存成功!',
                        center: true
                    });
                self.getData(self.cur_page, self.cur_size);
                }, function(data) {
                    self.userFormDisabled = false;
                    self.$message({message:'加载失败！',
                        type:'error',
                        center:true
                    });
                });
        },
        deleteUser(userId) {

            let self = this;
            self.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                postData('users/api/user/delete', { userId: userId }).
                    then(function(data) {
                        self.$message({
                            type: 'success',
                            message: '删除成功!',
                            center: true
                        });
                        self.getData(self.cur_page, self.cur_size);
                    }, function(data) {
                        self.$message({message:'加载失败！',
                            type:'error',
                            center:true
                        });
                    });
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除',
                    center:true
                });
            });
        },
        deleteAll() {

            let self = this;
            var userIdsarr = [];
            for(var i =0, len = self.selectedItems.length; i < len; i++) {
                userIdsarr.push(self.selectedItems[i].id);
            }

            var data = {userIds: userIdsarr};

            if(userIdsarr.length <= 0) {
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
                deleteData('users/api/user/deleteAll',data).then((res)=>{
                        self.$message({
                            type: 'success',
                            message: '删除成功!',
                            center: true
                        });
                        self.getData(this.cur_page, this.cur_size);
                    },
                    (res)=>{
                        self.$message({
                            type: 'error',
                            message: '操作失败!',
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
        handleSelectionChange(val) {
            this.selectedItems = val;
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

.el-table th, .el-table tr {
    background-color: #fff;
    font-size: 14;
}

.el-table td, .el-table th {
    padding: 0 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
}

.table .el-dialog--small {
    width: 40%;
}

.table .el-dialog {
    width: 40%;
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
.content {
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 200px;
    right: 0;
    top: 70px;
    bottom: 0;
    width: auto;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: scroll;
}
.el-form-item {
    margin-bottom: 22px;
    margin-top: 10px;
}
.foot_pagination {
    display: flex;
    justify-content: space-between;
    background-color: #F2F6FC;
}
</style>
