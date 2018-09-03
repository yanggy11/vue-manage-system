<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
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
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormatter"/>
            <el-table-column prop="avater" label="头像" align="center" width="60">
                <template  slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <img :src="scope.row.avater" v-show="scope.row.avater" height="400" width="400"/>
                        <img v-show="scope.row.avater" slot="reference" :src="scope.row.avater" height="20" width="20"/>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="deleteFlag" label="状态" align="center" :formatter="deleteFlagFormatter" width="100"/>
            <el-table-column label="操作" align="center" width="160">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="openUserInfo(1, scope.row)" icon="delete">编辑</el-button>

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
                    <el-form-item label="头像" :label-width="formLabelWidth">
                        <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            accept="image/*"
                            :on-success="handleAvatarSuccess"
                            :auto-upload="false"
                            :on-change="setImage"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="userInfo.avater" :src="userInfo.avater" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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

import { formatDate, processUrl } from '../../js/date.js'
import {getData, postData,deleteData} from '../../js/baseHttp.js'

export default {
    data() {
        var checkAge = (rule, value, callback) => {

            if (!value) {
                return callback(new Error('年龄不能为空'));
            }

            if (!/^\d+$/.test(value)) {
                callback(new Error('请输入整数值'));
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
                sex:'1',
                avater:''
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
                age:[{required:true,message:'请输入年龄'},{ validator: checkAge}],

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
        setImage(e, fileList) {
            let self = this;

            let data = new FormData();
            data.append('file', e.raw);
            //上传图片
            postData(processUrl(self.env,'users/api/user/uploa'), data).then(function(data){
                self.userInfo.avater = data.imgUrl;
            }, function (data) {
                self.$message({
                    message:'上传错误',
                    type:'error',
                    center: true
                })
            });

        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
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

            postData(processUrl(self.env,'users/api/user/userList'), data).
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
                return "未删除";
            }
            return "已删除";
        },
        dateFormatter(row) {
            return formatDate(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss");
        },
        openUserInfo(flag, row) {
            let self = this;
            self.userInfoDialog = true;
            self.userFormDisabled = false;
            self.userInfo = row;
        },
        saveUserInfo(userForm) {

            let self = this;

//            self.userFormDisabled = true;
//            self.$refs.userForm.validate(valid => {
//
//                console.log(valid);
//                if(valid) {
                if (this.userInfo.id == undefined) {
                    this.addUser();
                } else {
                    this.updateUser();
                }
//                }else {
//                    self.userFormDisabled = false;
//                }
//            });
        },
        updateUser() {

            console.log(this.userInfo);
            let self = this;
            postData(processUrl(self.env,'users/api/user/updateUserInfo'), self.userInfo).
                then(function(data) {
                    self.userInfoDialog = false;
                    self.getData(self.cur_page, self.cur_size);
                    self.$message({message:'操作成功！',
                        type:'success',
                        center:true
                    });
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
            postData(processUrl(self.env,'users/api/user/register'), self.userInfo,
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
                postData(processUrl(self.env,'users/api/user/delete'), { userId: userId }).
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
                deleteData(processUrl(self.env,'users/api/user/deleteAll'),data).then((res)=>{
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
    .el-upload--text {
        background-color: #fff;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 180px;
        height: 180px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
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
</style>

<style>
    .container {
        padding: 15px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
</style>
