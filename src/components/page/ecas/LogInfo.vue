<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 日志查询
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
               <el-date-picker
                    size="mini"
                    v-model="date1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="handle-date-select mr10">
                </el-date-picker>
                
                <el-select v-model="query.optionType" size="mini" placeholder="操作类型" class="handle-select mr10">
                    <el-option key="1" label="用户登陆" value="用户登陆"></el-option>
                    <el-option key="2" label="添加用户" value="添加用户"></el-option>
                    <el-option key="3" label="重置密码" value="重置密码"></el-option>
                    <el-option key="4" label="用户分配权限" value="用户分配权限"></el-option>
                </el-select>
                <el-input v-model="query.operatorName" size="mini" placeholder="操作柜员" class="handle-input mr10"></el-input>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="350px"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="日志编号" align="center"></el-table-column>
                <el-table-column prop="who" label="操作柜员" align="center"></el-table-column>
                <el-table-column prop="term" label="记录地址"></el-table-column>
                <el-table-column prop="whatDisplay" label="操作类型"></el-table-column>
                <el-table-column prop="when" label="操作时间"></el-table-column>
                <el-table-column prop="how" label="结果"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchLogData } from '../../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                productName: '',
                name: '',
                state: '',
                operatorName:'',
                pageIndex: 1,
                pageSize: 2
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            date1:'',
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            imageUrl: ''
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchLogData(this.query).then(res => {
                console.log(res);
                this.tableData = res.datals;
                this.pageTotal = res.pageTotal || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 15px;
}

.handle-select {
    width: 120px;
}

.handle-date-select {
    width: 220px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 12px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
