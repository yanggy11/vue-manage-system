
<template>
    <span class="tree-expand">
        <span class="tree-label" v-show="DATA.isEdit">
            <el-input class="edit" size="mini"
                      :ref="'treeInput1'+DATA.id"
                      v-model="DATA.resourceName"></el-input>
            <el-input class="edit" size="mini"
                      :ref="'treeInput2'+DATA.id"
                      v-model="DATA.resource"></el-input>
        </span>
        <template>
            <span class="tree-expand">
                <span class="tree-label">
                    <span>{{DATA.resourceName}}</span>
                </span>
                <span class="tree-btn">
                    <i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
                    <i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
                    <i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
                </span>
            </span>
        </template>
    </span>
</template>

<script>
    export default{
        props: ['NODE', 'DATA', 'STORE'],
        methods: {
            nodeAdd(s,d,n){//新增
                this.$emit('nodeAdd',s,d,n)
            },
            nodeEdit(s,d,n){//编辑
                this.$emit('nodeEdit',s,d,n)
                console.log(s,d,n)
            },
            nodeDel(s,d,n){//删除
                this.$emit('nodeDel',s,d,n)
            }
        }
    }
</script>
