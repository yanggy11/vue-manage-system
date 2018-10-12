<template>
    <div class="table">
        <div class="container">
            <el-tabs v-model="isRecived" @tab-click="handleClick">
                <el-tab-pane :label="`接收到的消息`" name="sended_message">
                    <el-tabs v-model="isHandled" @tab-click="handleClick">
                        <el-tab-pane :label="`未处理`" name="unhandled_message">
                            <el-table :data="messages" border style="width: 100%">
                                <el-table-column type="selection" width="50" align="center"/>
                                <el-table-column
                                    label="id"
                                    prop="messageId">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClickInfo(scope.row)" type="text" size="small">
                                            {{scope.row.messageId}}
                                        </el-button>
                                    </template>
                                </el-table-column>

                                <el-table-column label="交换机" prop="exchange" align="center"/>
                                <el-table-column label="队列" prop="routingKey" align="center"/>
                                <el-table-column label="发送时间" prop="createTime" width="160px" :formatter="dateFormater"
                                                 align="center"/>
                                <el-table-column label="操作" width="100" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="small">发送</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="foot_pagination">
                                <div class="pagination">
                                    <el-pagination>
                                    </el-pagination>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="`已处理`" name="handled_message">
                            <el-table :data="messages" style="width: 100%">
                                <el-table-column type="selection" width="50" align="center"/>
                                <el-table-column label="ID" prop="messageId" align="center"/>
                                <el-table-column label="交换机" prop="exchange" align="center"/>
                                <el-table-column label="队列" prop="routingKey" align="center"/>
                                <el-table-column label="发送时间" prop="createTime" :formatter="dateFormater"
                                                 align="center"/>
                            </el-table>
                            <div class="foot_pagination">
                                <el-form>
                                    <el-form-item>
                                        <el-button size="small" type="danger">删除全部</el-button>
                                    </el-form-item>
                                </el-form>
                                <div class="pagination">
                                    <el-pagination>
                                    </el-pagination>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-tab-pane>
                <el-tab-pane :label="`接收到的消息`" name="recieved_message">
                    <el-table :data="messages" style="width: 100%">
                        <el-table-column type="selection" width="50" align="center"/>
                        <el-table-column label="ID" prop="messageId" align="center"/>
                        <el-table-column label="交换机" prop="exchange" align="center"/>
                        <el-table-column label="队列" prop="routingKey" align="center"/>
                        <el-table-column label="发送时间" prop="createTime" :formatter="dateFormater" align="center"/>
                    </el-table>
                    <div class="foot_pagination">
                        <el-form>
                            <el-form-item>
                                <el-button size="small" type="primary">删除全部</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="pagination">
                            <el-pagination>
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div>
            <el-dialog title="消息内容" :visible.sync="messageDialogInfo" center>
                <div text-align="center">
                    <tree-view :data="message" :options="{maxDepth: 4}"></tree-view>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="messageDialogInfo = false">取 消</el-button>
                    <el-button>重新发送</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {postData} from '../../js/baseHttp'
    import {formatDate} from '../../js/date'

    export default {
        name: 'tabs',
        data() {
            return {
                isRecived: 'sended_message',
                isHandled: 'unhandled_message',
                showHeader: false,
                messages: [],
                message: {},
                messageDialogInfo: false,
                handled: [],
                page: {
                    cur_page: 1,
                    cur_size: 20,
                    totalRecord: 0
                },
            }
        },
        methods: {
            handleClick() {
                let self = this;
                self.messages = [];
                self.getData(self.isRecived, self.isHandled);

            },
            dateFormater(row) {
                let self = this;
                return formatDate(new Date(row.createTime), self.$config.time_format.date_time_format);
            },
            async getData(isRecived, isHandled) {
                let self = this;
                let isProcessed = 0;
                let type = 1;
                if (self.$config.sended_message === isRecived) {
                    if (self.$config.unhandled_message === isHandled) {
                        isProcessed = 0;
                    } else if (self.$config.handled_message === isHandled) {
                        isProcessed = 1;
                    }
                } else {
                    isProcessed = 0;
                    type = 0;
                }

                let data = {
                    isProcessed: isProcessed,
                    page: self.page.cur_page,
                    pageSize: self.page.cur_size,
                    type: type
                };

                postData(self.$config.rabbit_msg_url.get_msg_url, data).then(res => {
                    self.messages = res.data;

                    self.message = JSON.parse(self.messages[0].message)
                }, res => {

                });

            },
            handleClickInfo(row) {
                let self = this;
                self.messageDialogInfo = true;
                self.message = JSON.parse(row.message);
            }
        },
        created() {
            this.getData(this.isRecived, this.isHandled);
        }
    }

</script>

<style>
</style>

