<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色信息维护管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" size="mini" placeholder="角色名称" class="handle-input mr10"></el-input>
                <el-select v-model="query.state" size="mini" placeholder="角色状态" class="handle-select mr10">
                    <el-option key="1" label="启用" value="启用"></el-option>
                    <el-option key="2" label="禁用" value="禁用"></el-option>
                </el-select>
                <el-select v-model="query.productName" size="mini" placeholder="产品名称" class="handle-select mr10">
                    <el-option key="1" label="交易管理" value="交易管理"></el-option>
                    <el-option key="2" label="结算管理" value="结算管理"></el-option>
                    <el-option key="3" label="系统管理" value="系统管理"></el-option>
                    <el-option key="4" label="风控管理" value="风控管理"></el-option>
                </el-select>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <div class="handle-box">
                <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addUser">新增</el-button>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleSearch">修改</el-button>
                <el-button type="danger" size="mini" icon="el-icon-refresh-righ" @click="handleSearch">禁用</el-button>
                <el-button type="warning" size="mini" icon="el-icon-s-check" @click="openAuthorityList">权限分配</el-button>
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
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="roleId" label="用户编号" align="center"></el-table-column>
                <el-table-column prop="code" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column label="角色状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.enabledDisplay==='启用'?'success':(scope.row.enabledDisplay==='禁用'?'danger':'')"
                        >{{scope.row.enabledDisplay}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="typeDisplay"
                    label="角色类型"
                    width="100"
                    :filters="[{ text: '柜员端', value: '柜员端' }, { text: '客户经理端', value: '客户经理端' },{ text: '分行端', value: '分行端' },{ text: '总行端', value: '总行端' }]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                        :type="scope.row.typeDisplay === '柜员端' ? 'primary' : 'success'"
                        disable-transitions>{{scope.row.typeDisplay}}</el-tag>
                    </template>
                </el-table-column>
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
                <el-form-item label="用户名" size="mini">
                    <el-input v-model="form.name" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="地址" size="mini">
                    <el-input v-model="form.address" size="mini"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="saveEdit" size="mini">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增权限" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名" size="mini"> 
                    <el-input v-model="form.name" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="地址" size="mini">
                    <el-input v-model="form.address" size="mini"></el-input>
                </el-form-item>
                 <el-form-item label="状态" size="mini">
                    <el-switch v-model="form.state" ></el-switch>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="saveEdit" size="mini">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 权限列表弹出框 -->
        <el-dialog title="权限列表" :visible.sync="authorVisible" width="30%" >
            <el-form ref="form" :model="form" label-width="70px">
                <ul class="infinite-list" style="overflow:auto">
                    <el-tree
                        :data="authorityList"
                        show-checkbox
                        node-key="description"
                        default-expand-all
                        :props="defaultProps"
                        :default-checked-keys="checkedArr"
                        ref="tree">
                    </el-tree>
                </ul>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="authorVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="saveEdit" size="mini">确 定</el-button>
            </span>
            
        </el-dialog>

    </div>
</template>

<script>
import { fetchRoleData,getAuthorityList } from '../../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                productName: '',
                name: '',
                state: '',
                pageIndex: 1,
                pageSize: 2
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible:false,
            authorVisible:false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            imageUrl: '',
            authorityList:[],
            defaultProps: {
                children: 'children',
                label: 'description'
            },
            checkedArr:[]
        };
    },
    created() {
        this.getData();
        this.getAuthoList();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchRoleData(this.query).then(res => {
                console.log(res);
                this.tableData = res.datals;
                this.pageTotal = res.pageTotal || 50;
            });
        },
        getAuthoList(){
            getAuthorityList().then(res => {
                console.log(res);
                this.authorityList = res.rights;

            });
        },
        
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
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
        addUser(){
            this.addVisible=true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        //打开权限列表
        openAuthorityList(){
            
            for (const data of this.authorityList) {
                if (data.children) {
                    console.log(data.children);
                    for (const child of data.children) {
                        const checked = child.checked;
                        if(checked){
                            // this.$refs.tree.setChecked(child, true, false)  //设置选择                         
                            this.checkedArr.push(child.description);
                        }
                    } 
                }
            }
            
            
            this.authorVisible = true;
        },
        filterTag(value, row) {
            return row.tag === value;
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
