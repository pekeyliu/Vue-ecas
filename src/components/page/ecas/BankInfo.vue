<template class="font">
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 机构信息维护
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    size="mini"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.bankId" size="mini" placeholder="机构编号" class="handle-input mr10"></el-input>
                <el-select v-model="options.label" size="mini" placeholder="请选择机构" class="handle-select mr10">
                     <el-option :value="options.value" :label="options.label"  style="height: auto">
                        <el-tree
                            :data="treeDate"
                            default-expand-all
                            @node-click="handleNodeClick"
                            ref="tree">
                        </el-tree>
                    </el-option>
                </el-select>
                
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height=350px
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="bankId" label="机构编号"  align="center"></el-table-column>
                <el-table-column prop="name" label="机构名称" align="center"></el-table-column>
                <el-table-column prop="headName" label="所属机构" align="center"></el-table-column>
                <el-table-column prop="levelDisplay" label="机构级别" align="center"></el-table-column>
                <el-table-column label="机构状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.enabledDisplay==='正常'?'success':(scope.row.enabledDisplay==='撤销'?'danger':'')"
                        >{{scope.row.enabledDisplay}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="typeDisplay" label="机构类型"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="机构名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="所属机构">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchBankData , getBankTree} from '../../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                bankId: '',
                name: '',
                pageIndex: 1,
                pageSize: 5
            },
            options:{
                value:'',
                label:''
            },
            tableData: [],
            treeDate: [],
           
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
        this.getTreeData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchBankData(this.query).then(res => {
                console.log(res);
                this.tableData = res.datals;
                this.pageTotal = res.pageSize || 50;
            });
        },
         getTreeData() {
            getBankTree().then(res => {
                console.log(res);
                this.treeDate = res.data;
               
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleNodeClick(data) {
            console.log(data);
            this.options.value=data.id;
            this.options.label=data.label;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style>
.font{
    font-size: 10px;
}
.handle-box {
    margin-bottom: 15px;
}

.handle-select {
    width: 170px;
}

.handle-input {
    width: 120px;
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
