<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
    .el-table td {
        padding: 2px 0;
        min-width: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        font-size: 13px;
    }

    .el-table th {
        padding: 4px 0;
        min-width: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        font-size: 16px;
    }
</style>
