<template>
    <div class="table">
        <div class="crumbs" align="center">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="criteria" class="demo-form-inline form"
                         style="display:flex; justify-content: space-between;">
                    <div>
                        <el-form-item v-has-resource="'P_USER_ADD'">
                            <el-button type="primary" size="small" @click="openUserInfo(0,undefined)">新增</el-button>
                        </el-form-item>
                        <el-form-item v-has-resource="'P_USER_BATCH_DELETE'">
                            <el-button type="primary" size="small" @click="deleteAll">批量删除</el-button>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="姓名" :label-width="labelWidth">
                            <el-input v-model="criteria.name" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" :label-width="labelWidth">
                            <el-select v-model="criteria.sex" placeholder="请选择">
                                <el-option v-for="item in genders" :label="item.label" :value="item.value"
                                           :key="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-has-resource="'P_USER_QUERY'">
                            <el-button type="primary" size="small" @click="queryData">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <el-table v-loading.body="loading" :data="tableData" border style="width: 100%"
                      @selection-change="selectRows">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column prop="name" label="姓名" align="center" width="120"/>
                <el-table-column prop="age" label="年龄" align="center" width="80"/>
                <el-table-column prop="sex" label="性别" align="center" :formatter="sexFormatter" width="60"/>
                <el-table-column prop="phone" label="手机号" align="center" width="110"/>
                <el-table-column prop="email" label="邮箱" align="center" width="200"/>
                <el-table-column prop="createTime" label="创建时间" width="180px" align="center"
                                 :formatter="dateFormatter"/>
                <el-table-column prop="avater" label="头像" align="center" width="60">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <img :src="scope.row.avater" v-show="scope.row.avater" height="400" width="400"/>
                            <img v-show="scope.row.avater" slot="reference" :src="scope.row.avater" height="20"
                                 width="20"/>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="deleteFlag" label="状态" align="center" :formatter="deleteFlagFormatter"
                                 width="100"/>
                <el-table-column label="操作" align="center" width="160"
                                 v-has-any-resources="['P_USER_EDIT','P_USER_DELETE']">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="openUserInfo(1, scope.row)" icon="delete"
                                   v-has-resource="'P_USER_EDIT'">编辑
                        </el-button>

                        <el-button :disabled="scope.row.deleteFlag != 0" size="small" type="danger"
                                   @click="deleteUser(scope.row.id)" icon="delete" v-has-resource="'P_USER_DELETE'">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="foot_pagination">
                <div class="pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   layout="sizes,total, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 30]"
                                   :total="total" :page-size="cur_size">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div style="width:1000px;">
            <el-dialog title="用户信息" :visible.sync="userInfoDialog" center>
                <el-form ref="userForm" :model="userInfo" :rules="rules" class="form">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                                <el-input v-model="userInfo.name" auto-complete="off"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
                                <el-input v-model="userInfo.age" auto-complete="off"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                                <el-input v-model="userInfo.phone" auto-complete="off"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                                <el-input v-model="userInfo.email" auto-complete="off"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-radio v-model="userInfo.sex" class="radio" :label="1">女</el-radio>
                        <el-radio v-model="userInfo.sex" class="radio" :label="0">男</el-radio>
                    </el-form-item>
                    <el-form-item label="角色列表" :label-width="formLabelWidth">
                        <el-transfer class="transfer"
                                     v-model="selectedRoles"
                                     :titles="['全部角色', '用户角色']"
                                     :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"
                                     :props="transferProps"
                                     :data="all_roles">
                        </el-transfer>
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
                            <img v-if="userInfo.avater" :src="userInfo.avater" class="avatar"/>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div>

                    <first-demo :clickMe="clickMe" :propse="1" content="点击我"></first-demo>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="userInfoDialog = false">取 消</el-button>
                    <el-button type="primary" :disabled="userFormDisabled" @click="saveUserInfo">确 定
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import {formatDate} from '../../js/date.js'
    import {postData, deleteData} from '../../js/baseHttp.js'
    import FirstDemo from '@/components/custom/FirstDemo'

    export default {
        data() {
            var checkAge = (rule, value, callback) => {
                if (!/^\d+$/.test(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
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
                labelWidth: '60px',
                userInfo: {
                    name: '',
                    age: 0,
                    phone: '',
                    email: '',
                    sex: '0',
                    avater: ''
                },
                roles: [],
                image: '',
                userFormDisabled: false,
                genders: [{
                    value: "0",
                    label: "男"
                }, {
                    value: "1",
                    label: "女"
                }],
                criteria: {
                    gender: '0'
                },
                sex: '1',
                rules: {
                    name: [{required: true, message: '姓名不能为空', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在3-10个字符之间', trigger: 'change'}
                    ],
                    age: [{required: true, message: '请输入年龄'}, {validator: checkAge, trigger: 'change'}],

                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {max: 12, message: '长度不能大于12', trigger: 'change'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'}, {
                            type: 'email', message: '请输入格式正确的邮箱'
                        }
                    ]
                },
                selectedItems: [],
                all_roles: [],
                selectedRoles: [],
                transferProps: {
                    key: 'id',
                    label: 'role',
                    disabled: 'disabled'
                },
                allRoles: []
            }
        },
        created() {
            this.getData(this.cur_page, this.cur_size);
            this.getRoles();
        },
        components:{
            FirstDemo
        },
        methods: {
            clickMe() {
              this.$message.success('click me');
            },
            setImage(e, fileList) {
                let self = this;

                let data = new FormData();
                data.append('file', e.raw);
                data.append('name', 'derrick');
                //上传图片
                postData(self.$config.web_request_url.file_upload_url, data).then(function (data) {
                    self.userInfo.avater = data.data;
                }, function (data) {
                    self.$message({
                        message: '上传错误',
                        type: 'error',
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

                let data = {page: currentPage, pageSize: currentSize, name: this.criteria.name, sex: this.criteria.sex};

                postData(self.$config.user_url.user_list_url, data).then(function (data) {

                    self.total = data.totalRecord;
                    self.tableData = data.data;
                    self.loading = false;
                }, function (data) {

                    self.$message({
                        message: data,
                        type: 'error',
                        center: true
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

                postData(self.$config.role_url.get_all_roles_url, {}).then(res => {
                    res.data.forEach(value => {
                        value.disabled = false;
                    });

                    if (0 === flag) {
                        self.userInfo = {
                            name: '',
                            age: 0,
                            phone: '',
                            email: '',
                            sex: 0,
                            avater: ''
                        };
                        self.selectedRoles = [];
                        return;
                    }

                    if (1 === flag) {
                        self.userInfo = row;
                        self.selectedRoles = row.roleIds;
                        self.all_roles = res.data;

                        return;
                    }
                }, res => {

                });
            },
            saveUserInfo() {
                let self = this;
                self.userFormDisabled = true;
                self.$refs.userForm.validate(valid => {
                    if (valid) {
                        self.userInfo.roleIds = self.selectedRoles;
                        if (this.userInfo.id == undefined) {
                            this.addUser();
                        } else {
                            this.updateUser();
                        }
                    } else {
                        self.userFormDisabled = false;
                    }
                });
            },
            updateUser() {
                let self = this;
                postData(self.$config.user_url.user_edit_url, self.userInfo).then(function (data) {
                    self.userInfoDialog = false;
                    self.getData(self.cur_page, self.cur_size);
                    self.$message({
                        message: '操作成功！',
                        type: 'success',
                        center: true
                    });
                }, function (data) {
                    self.userFormDisabled = false;
                    self.$message({
                        message: '操作失败！',
                        type: 'error',
                        center: true
                    });
                });
            },
            addUser() {
                let self = this;
                postData(self.$config.user_url.user_add_url, self.userInfo).then(function (data) {
                    self.userInfoDialog = false;
                    self.$message({
                        type: 'success',
                        message: '保存成功!',
                        center: true
                    });
                    self.getData(self.cur_page, self.cur_size);
                }, function (data) {
                    self.userFormDisabled = false;
                    self.$message({
                        message: '加载失败！',
                        type: 'error',
                        center: true
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
                    postData(self.$config.user_url.user_delete_url, {userId: userId}).then(function (data) {
                        self.$message({
                            type: 'success',
                            message: '删除成功!',
                            center: true
                        });
                        self.getData(self.cur_page, self.cur_size);
                    }, function (data) {
                        self.$message({
                            message: '加载失败！',
                            type: 'error',
                            center: true
                        });
                    });
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除',
                        center: true
                    });
                });
            },
            deleteAll() {
                let self = this;
                var userIdsarr = [];
                for (var i = 0, len = self.selectedItems.length; i < len; i++) {
                    userIdsarr.push(self.selectedItems[i].id);
                }

                var data = {userIds: userIdsarr};

                if (userIdsarr.length <= 0) {
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
                    deleteData(self.$config.user_url.user_delete_all_url, data).then((res) => {
                            self.$message({
                                type: 'success',
                                message: '删除成功!',
                                center: true
                            });
                            self.getData(this.cur_page, this.cur_size);
                        },
                        (res) => {
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
            },
            getRoles() {
                let self = this;
                postData(self.$config.role_url.get_all_roles_url, {}).then(res => {
                    self.all_roles = res.data;
                    self.all_roles.forEach(value => {
                        value.disabled = false;
                    })
                }, res => {
                    self.$message({
                        message: '发生未知错误',
                        type: 'error',
                        center: true
                    })
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

<style>
    .el-input__inner {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 35px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        -o-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
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

    .container {
        padding: 15px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .form /deep/ .el-form-item__label {
        text-align: right;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .transfer /deep/ .el-transfer-panel__body {
        height: 200px;
    }

    .transfer /deep/ .el-transfer__buttons {
        display: inline-block;
        vertical-align: middle;
        padding: 0 5px;
    }
</style>
