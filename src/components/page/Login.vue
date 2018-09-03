<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="user" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="user.name" placeholder="username"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="user.password" />
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>

    import {postData} from '../../js/baseHttp.js'
    import {processUrl} from '../../js/date'

    export default {
        data: function(){
            return {
                user: {
                    name: '',
                    password: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                attr: {
                    loginButtonClick: true
                }
            }
        },
        methods: {
            login(formName) {

                const self = this;
                self.loginButtonClick = false;//点击登陆后，禁用登录按钮，
                postData(processUrl(self.$env,'auth/login'),self.user)
                    .then(function(data) {

                        console.log(data)
                        let user = data.data.user;
                        localStorage.setItem("AuthenticationToken",data.data.token);
                        localStorage.setItem("username",user.username);
                        localStorage.setItem("userId",user.userId);
                        localStorage.setItem("avater",user.avater);
                        self.$router.push('/dashboard');

                        self.loginButtonClick = true;//登录成功后放开登录按钮
                    },function(data) {
                        console.log(data);
                        self.$message({
                            message: '登录失败',
                            type: 'error',
                            center: true
                        });

                        self.loginButtonClick = true;//登录失败放开登录按钮
                    });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
