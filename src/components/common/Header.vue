<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/rabbitMsg">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator"><img :src="avater"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="hover" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                        <el-dropdown-item divided command="editPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">编辑资料</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

            <div class="dialog">
                <el-dialog :visible.sync="passwordEditDialog">
                    <el-form label-width="80px" :model="user" ref="passwordForm" :rules="rules">
                        <el-form-item label="姓名">
                            <el-input v-model="name" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="user.password"/>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="passwordConfirm">
                            <el-input type="password" v-model="user.passwordConfirm"/>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="passwordEditDialog = false">取 消</el-button>
                        <el-button type="primary" @click="editPassword">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.user.passwordConfirm.trim() != '') {
                        this.$refs.passwordForm.validateField('passwordConfirm');
                    }
                    callback();
                }
            };

            var validatePasswordConfirm = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error('请再次输入密码'));
                } else {
                    if (this.user.passwordConfirm != this.user.password) {
                        callback(new Error('两次输入的密码不一致'));
                    }
                    callback();
                }
            };
            return {
                collapse: false,
                fullscreen: false,
                name: '',
                avater: '',
                message: 2,
                passwordEditDialog: false,
                user: {
                    password: '',
                    passwordConfirm: ''
                },
                rules: {
                    password: [{validator: validatePass, trigger: 'blur'}],
                    passwordConfirm: [{validator: validatePasswordConfirm, trigger: 'blur'}]
                }
            }
        },
        computed: {
            username() {
                let username = localStorage.getItem('username');
                this.name = username;
                this.avater = localStorage.getItem('avater');
                return username;
            }
        },
        methods: {
            editPassword() {
                user.userId = localStorage.getItem('userId');
            },
            openPasswordDialog() {
                this.passwordEditDialog = true;
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == 'loginout') {
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                }
                switch (command) {
                    case 'loginout':
                        localStorage.removeItem('ms_username')
                        this.$router.push('/login');
                        break;
                    case 'editPassword':
                        this.openPasswordDialog();
                    case 'editPersonalInfo':
                        this.openPersonalInfoDialog();
                }
            },
            openPersonalInfoDialog() {
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage();
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .header-right {
        float: right;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 70px;
        align-items: center;
    }

    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .btn-bell, .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }

    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator {
        margin-left: 20px;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }

    .dialog /deep/ .el-dialog {
        position: relative;
        margin: 0 auto 50px;
        background: #fff;
        border-radius: 2px;
        -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 35%;
    }

    .dialog /deep/ .el-input__inner {
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
        width: 200px;
    }

    .dialog /deep/ .el-form-item__label {
        text-align: right;
        float: left;
        font-size: 14px;
        line-height: 40px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background-color: #f5f7fa;
    }
</style>
