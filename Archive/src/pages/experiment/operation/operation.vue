<template>
    <section>
        <el-row class="row-operation-head">操作记录</el-row>
        <el-row class="row-abt-list row-list-select-group">
            <el-col :span="8">
                <label>
                    <span class="label">操作人</span>
                    <staffSelector @selected="selectedStaff"></staffSelector>
                </label>
            </el-col>
            <el-col :span="8">
                <label>
                    <span class="label">操作类型</span>
                    <el-select v-model="typeVal" filterable placeholder="请选择" @change="initTableData">
                        <el-option
                            v-for="item in filterTypeList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </label>
            </el-col>
        </el-row>
        <el-row class="row-abt-list" id="row-list-content">
            <el-table
                :data="tableData.slice((curPage - 1) * pageSize, curPage * pageSize)"
                ref="table"
                stripe
                :default-sort="{ prop: 'modify_time', order: 'descending' }"
            >
                <!-- 操作人 操作时间 操作类型 详情 -->
                <el-table-column prop="modifier" label="操作人"></el-table-column>
                <el-table-column prop="modify_time" label="操作时间" sortable></el-table-column>
                <el-table-column prop="status" label="操作类型">
                    <template slot-scope="scope">
                        {{ typeMap[scope.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column prop="comments" label="详情" show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <el-pagination
                background
                class="pagination"
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="tableData.length"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            ></el-pagination>
        </el-row>
    </section>
</template>

<script>
import staffSelector from '../../../components/staff/staffSelector';
import API from './api';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            typeMap: {}, //操作类型映射
            rtxList: [], //操作人筛选条件
            filterTypeList: [], //操作类型筛选条件
            typeVal: '', //操作类型
            operatorVal: '', //操作人
            curPage: 1, //当前页数
            pageSize: 10, //每页展示的个数
            tableData: [] //表格数据
        };
    },
    components: {
        staffSelector
    },
    computed: {
        ...mapState({
            userName: state => state.user.name,
            activeBusinessName: state => state.business.activeName
        }),
        fexpId: {
            get: function() {
                return this.$route.params.fexp_id;
            }
        }
    },
    created() {
        this.initTypeFilter();
        this.initTableData();
    },
    mounted() {},
    methods: {
        async initTypeFilter() {
            let res = await API.getTypeList();
            res.data.businesss.map(item => {
                this.typeMap[item.code] = item.name;
            });
            this.filterTypeList = res.data.businesss;
        },
        async initTableData() {
            console.log(this.typeVal, this.operatorVal);
            let res = await API.getDataList({
                id: this.fexpId,
                modifier: this.operatorVal,
                status: this.typeVal
                // modifier: 'abwu',
                // status: 0
            });
            this.tableData = res.data.businesss;
        },
        selectedStaff(data) {
            this.operatorVal = data.en_name;
            return this.initTableData();
        },
        handleCurrentChange(cpage) {
            this.curPage = cpage;
        },
        handleSizeChange(psize) {
            this.pageSize = psize;
        }
    }
};
</script>
<style lang="scss" scope>
@import '../../../assets/scss/variables';
.row-operation-head {
    padding: 21px 24px;
    border-bottom: 1px solid #ebeef5;
}
.row-abt-list {
    padding: 24px 24px 0 24px;
    font-family: PingFangSC-Regular;
}
.row-list-select-group {
    .label {
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
        text-align: right;
        line-height: 24px;
        padding-right: 16px;
    }
    .el-select {
        width: 280px;
        height: 40px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
    }
}
.pagination {
    text-align: center;
    background-color: #fff;
    padding: 20px;
    button,
    li {
        background: #f0f2f5;
        border-radius: 2px;
    }
    li.active {
        background: #249ded;
    }
}
</style>
