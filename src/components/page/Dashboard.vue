<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img :src="avater" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{name}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">上次登录时间：<span>2018-01-01</span></div>
                            <div class="user-info-list">上次登录地点：<span>青岛</span></div>
                        </el-card>
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>语言详情</span>
                            </div>
                            Vue
                            <el-progress :percentage="57.2" color="#42b983"></el-progress>
                            JavaScript
                            <el-progress :percentage="29.8" color="#f1e05a"></el-progress>
                            CSS
                            <el-progress :percentage="11.9"></el-progress>
                            HTML
                            <el-progress :percentage="1.1" color="#f56c6c"></el-progress>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" :body-style="{ height: '304px'}">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="openTodoDialog(undefined)">添加
                        </el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status == 1"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status == 1}">
                                    {{scope.row.content}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="180px" align="right">
                            <template slot-scope="scope">
                                <el-button v-show="scope.row.status == 0" type="text" size="small" class="el-icon-check" @click="finishItem(scope.row)"></el-button>
                                <el-button type="text" size="small" class="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <div>
            <el-dialog title="代办事项" :visible.sync="todoDialogVisible" center>
                <el-form ref="todoForm" :model="todoItem" :rules="rules" :inline="true">
                    <el-form-item label="代办事项" prop="content">
                        <el-input type="textarea" style="width: 350px" :row="8" v-model="todoItem.content"></el-input>
                    </el-form-item>
                </el-form>

                <div class="dialog-footer" slot="footer">
                    <el-button size="small" @click="saveItem">保存</el-button>
                    <el-button size="small" @click="todoDialogVisible = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {postData} from "../../js/baseHttp";
    import {formatDate} from "../../js/date";

    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('username'),
                avater: localStorage.getItem('avater'),
                todoList: [],
                todoDialogVisible: false,
                todoItem: {},
                rules: {
                    content: [{
                        required: true, message: '请输入待办事项'
                    }, {
                        min: 1, max: 100, message: '请输入1-100个字符'
                    }]
                }
            }
        },
        computed: {
            role() {

                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created() {
            this.getTodos();
        },
        methods: {
            finishItem(row) {
              let self = this;
              self.$confirm('确定完成代办事项, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  let data = {
                      id: row.id
                  };
                  postData(self.$config.web_request_url.todo_finish_url,data).then(res => {
                      self.$message({
                          type: 'success',
                          message: '操作成功!'
                      });

                      self.getTodos();
                  }, res => {
                  });
              }).catch(() => {
                  self.$message({
                      type: 'info',
                      message: '已取消操作'
                  });
              });
            },
            deleteItem(row) {
                let self = this;
                self.$confirm('确定删除代办事项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id: row.id
                    };
                    postData(self.$config.web_request_url.todo_delete_url,data).then(res => {
                        self.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        self.getTodos();
                    }, res => {

                    });

                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getTodos() {
                let self = this;
                let data = {
                    beginTime: formatDate(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
                    endTime: formatDate(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
                    userId: localStorage.getItem("userId")
                };
                postData(self.$config.web_request_url.todo_get_url, data).then(res => {
                    console.log(res);
                    self.todoList = res.data;
                }, res => {

                })
            },
            openTodoDialog(row) {
                let self = this;
                self.todoDialogVisible = true;
                if(undefined != row) {
                    self.todoItem = row;
                }else {
                    self.todoItem = {
                        userId: localStorage.getItem("userId")
                    };
                }
            },
            saveItem() {
                let self = this;

                self.$refs.todoForm.validate(valid => {
                    if (valid) {
                        postData(this.$config.web_request_url.todo_add_url, self.todoItem).then(res => {
                            if (res.status === self.$config.OK) {
                                self.$message({
                                    message: res.msg,
                                    type: 'success',
                                    center: true
                                });
                                self.getTodos();
                                self.todoDialogVisible = false;
                            } else {
                                self.$message({
                                    message: res.msg,
                                    type: 'error',
                                    center: true
                                });
                            }
                        }, res => {
                        });
                    }
                });
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

</style>
