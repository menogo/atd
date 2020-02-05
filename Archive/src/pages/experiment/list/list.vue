<template>
    <section @click="handelDocumentClick">
        <el-row class="row-abt-list row-list-breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/experiment/business' }">全部业务</el-breadcrumb-item>
                <el-breadcrumb-item>{{ activeBusinessName }}</el-breadcrumb-item>
                <el-breadcrumb-item>实验列表</el-breadcrumb-item>
            </el-breadcrumb>
            <p class="experimentnum">
                进行中的实验:
                <span>{{ experimentnum }}</span>
            </p>
        </el-row>
        <el-row class="row-abt-list row-list-radio-group">
            <el-radio-group v-model="radio" @change="radioChange">
                <el-radio-button label="我的实验"></el-radio-button>
                <el-radio-button label="全部实验"></el-radio-button>
                <el-radio-button label="收藏实验"></el-radio-button>
            </el-radio-group>
            <el-button type="primary" class="createbtn" @click="handelCreatClick">创建新的实验</el-button>
        </el-row>
        <el-row class="row-abt-list row-list-select-group">
            <el-col :span="8">
                <label>
                    <span class="label">选择层级</span>
                    <el-select v-model="moduleVal" filterable placeholder="请选择" @change="initTableData">
                        <el-option
                            v-for="item in moduleList"
                            :key="item.id"
                            :label="item.code + '_' + item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </label>
            </el-col>
            <el-col :span="8">
                <label>
                    <span class="label">创建者</span>
                    <el-select v-model="creatorVal" filterable placeholder="请选择" @change="initTableData">
                        <el-option
                            v-for="item in creatorList"
                            :key="item.modifier"
                            :label="item.modifier"
                            :value="item.modifier"
                        ></el-option>
                    </el-select>
                </label>
            </el-col>
            <el-col :span="8">
                <label>
                    <span class="label">实验状态</span>
                    <el-select v-model="statusVal" filterable placeholder="请选择" @change="initTableData">
                        <el-option
                            v-for="item in statusList"
                            :key="item.code"
                            :label="item.text"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </label>
            </el-col>
        </el-row>
        <el-row class="row-abt-list" id="row-list-content">
            <el-table
                class="table-box"
                :data="tableData.slice((currPage - 1) * pagesSize, currPage * pagesSize)"
                ref="table"
                stripe
                :default-sort="{ prop: 'date', order: 'descending' }"
                @row-click="handelRowClick"
            >
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form
                            v-for="(item, index) in scope.row.grayStrategyList"
                            :key="index"
                            label-position="left"
                            inline
                            class="demo-table-expand"
                        >
                            <el-form-item :label="item.grayStrategyName + '(' + item.grayStrategyId + ')'">
                                <span>流量百分比（桶号）: {{ item.flowValue }} ({{ item.flowNumsStr }})</span>
                            </el-form-item>
                            <el-form-item label=" " class="model-params">
                                <span>
                                    参数值:
                                    <span
                                        v-for="(el, index) in item.modelParamsList"
                                        :key="index"
                                        @click="handelModuleParamsClick(el)"
                                        @mouseover="handelModuleParamsMouseover($event)"
                                        @mouseout="handelModuleParamsMouseout($event)"
                                        >{{ el }}/</span
                                    >
                                </span>
                            </el-form-item>
                            <el-form-item label=" ">
                                <span class="font-color">开关系统参数值: --</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="实验ID" sortable min-width="5.4%"></el-table-column>
                <el-table-column prop="name" label="名称" min-width="13.2%"></el-table-column>
                <el-table-column
                    v-if="radio === '全部实验'"
                    prop="creator"
                    label="创建者"
                    min-width="6.6%"
                ></el-table-column>
                <el-table-column prop="moduleName" label="实验层" min-width="4.6%"></el-table-column>
                <el-table-column prop="issueType" label="下发类型" min-width="6.8%"></el-table-column>
                <el-table-column prop="issueValue" label="大盘占比" sortable min-width="6.1%"></el-table-column>
                <el-table-column prop="startTime" label="开始时间" min-width="7.4%"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" min-width="7.4%"></el-table-column>
                <el-table-column prop="status" label="状态" min-width="5%">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 0">已下线</span>
                        <span v-else-if="scope.row.status === 1">已上线</span>
                        <span v-else-if="scope.row.status === 2" class="span-red">未过审</span>
                        <span v-else-if="scope.row.status === 3">审核中</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" min-width="7.4%"></el-table-column>
                <el-table-column prop="modify_time" label="修改时间" min-width="7.4%"></el-table-column>
                <el-table-column prop="icon1" label="操作" min-width="3.8%">
                    <template slot-scope="scope">
                        <div v-if="operatingObj[scope.row.id]" class="operating-box">
                            <ul>
                                <li
                                    v-for="item in scope.row.operatingList"
                                    :key="item.name"
                                    :class="item.class"
                                    @click.stop="handelOperaClick(scope.row, item.name)"
                                >
                                    {{ item.name }}
                                </li>
                                <!-- <li
                                    v-if="scope.row.status === '2' || scope.row.status === '3'"
                                    @click.stop="handelReviewClick(scope.row)"
                                >
                                    审核
                                </li>
                                <li @click.stop="handelEditClick(scope.row)">编辑</li>
                                <li @click.stop="handelCopyClick(scope.row)">复制</li>
                                <li
                                    @click.stop="handelFavoriteClick(scope.row)"
                                    v-if="radio !== '收藏实验'"
                                    class="li-blue"
                                >
                                    收藏
                                </li>
                                <li
                                    @click.stop="handelDelFavoriteClick(scope.row)"
                                    v-if="radio === '收藏实验'"
                                    class="li-red"
                                >
                                    取消收藏
                                </li>
                                <li @click.stop="handelRecordingClick(scope.row)">操作记录</li>
                                <li @click.stop="handelDelClick(scope.row)" class="li-red">删除</li> -->
                            </ul>
                        </div>
                        <img :src="editSvg" class="cell-svg" @click.stop="showOperating(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="icon2" label="分析" min-width="3.8%">
                    <template slot-scope="scope">
                        <div v-if="analysisObj[scope.row.id]" class="analysis-box">
                            <!-- <ul>
                                <li>信息流商业化实时分析</li>
                                <li>去异常用户分析</li>
                                <li>实时分析</li>
                                <li>后台试验实时分析</li>
                                <li>分策略实验分析</li>
                            </ul>-->
                        </div>
                        <img :src="analysisSvg" class="cell-svg" @click.stop="showAnalysis(scope.row.id)" />
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                background
                layout="prev, pager, next"
                :page-size="pagesSize"
                :total="tableData.length"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            ></el-pagination>
        </el-row>
    </section>
</template>

<script>
import editSvg from '@/assets/img/edit.svg';
import analysisSvg from '@/assets/img/analysis.svg';
import API from './api';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            radio: '我的实验',
            experimentnum: '',
            tableData: [],
            moduleVal: 'all',
            moduleList: [],
            creatorVal: '',
            creatorList: [],
            statusVal: 'all',
            statusList: [
                { code: 'all', text: '全部' },
                { code: '0', text: '下线' },
                { code: '1', text: '上线' },
                { code: '2', text: '审核不通过' },
                { code: '3', text: '审核中' }
            ],
            editSvg,
            analysisSvg,
            operatingObj: {},
            analysisObj: {},
            currPage: 1, // 当前页码
            pagesSize: 8 // 每页展示条数
        };
    },
    created() {
        this.initPage();
    },
    mounted() {},
    computed: {
        ...mapState({
            userName: state => state.user.name,
            activeBusinessName: state => state.business.activeName
        })
    },
    methods: {
        initPage() {
            let p1 = API.getCommonConfigDatas().then(res => {
                if (res.moduleList) {
                    if (res.moduleList.length > 0) {
                        this.moduleList = res.moduleList;
                        this.creatorVal = this.userName;
                    } else {
                        this.$message({
                            type: 'error',
                            message: '暂无层级数据'
                        });
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
            let p2 = API.getParamsDatas().then(res => {
                if (res.modifier) {
                    if (res.modifier.length > 0) {
                        this.creatorList = res.modifier;
                    } else {
                        this.$message({
                            type: 'error',
                            message: '暂无创建者数据'
                        });
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
            Promise.all([p1, p2]).then(results => {
                this.initTableData();
            });
        },
        handelCreatClick() {
            this.$router.push('/experiment/create');
        },
        // get table data
        initTableData() {
            API.getAnalyticsList({ module: this.moduleVal, creator: this.creatorVal, status: this.statusVal }).then(
                res => {
                    if (res.status === 'success') {
                        if (res && res.data && res.data.businesss) {
                            if (res.data.businesss.length > 0) {
                                this.renderTableList(res);
                            } else {
                                this.tableData = [];
                                this.$message({
                                    type: 'info',
                                    message: '暂无数据，请切换条件重新查询!'
                                });
                            }
                        } else {
                            this.tableData = [];
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                }
            );
        },
        // get favorite table data
        initFavoriteTableData() {
            API.getFavoriteList().then(res => {
                if (res.status === 'success') {
                    if (res && res.data && res.data.businesss) {
                        if (res.data.businesss.length > 0) {
                            this.renderTableList(res);
                        } else {
                            this.tableData = [];
                            this.$message({
                                type: 'info',
                                message: '暂无数据，请切换条件重新查询!'
                            });
                        }
                    } else {
                        this.tableData = [];
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // tab click
        radioChange() {
            if (this.radio === '全部实验') {
                this.creatorVal = 'all';
                this.initTableData();
            } else if (this.radio === '我的实验') {
                this.creatorVal = this.$store.state.user.name;
                this.initTableData();
            } else {
                this.initFavoriteTableData();
            }
        },
        renderTableList(res) {
            this.experimentnum = res.data.grayExpNum >= 0 ? res.data.grayExpNum + '个' : '--';
            let tableList = [];
            res.data.businesss.forEach(item => {
                item.grayStrategyList.forEach(el => {
                    // tabel 展开行参数 拆分
                    el.modelParamsList = el.modelParams.split('/');
                    // 桶
                    if (el.flowNums) {
                        el.flowNumsStr = el.flowNums.replace(/;/g, '桶,') + '桶';
                    } else {
                        el.flowNumsStr = '--';
                    }
                });
                // 映射 操作功能区
                let operatingList = [];
                // 当前登录用户 是当前实验创建者
                if (item.creater === this.$store.state.user.name) {
                    item.icon1.forEach(el => {
                        // audit:审核进度 update:编辑 offline:下线 delete:删除 collect:收藏 copy；复制 history:操作记录
                        let operatingObj = {};
                        if (el === 'audit') {
                            operatingObj.name = '审核进度';
                        } else if (el === 'update') {
                            operatingObj.name = '编辑';
                        } else if (el === 'offline') {
                            operatingObj.name = '下线';
                        } else if (el === 'delete') {
                            operatingObj.name = '删除';
                            operatingObj.class = 'li-red';
                        } else if (el === 'collect') {
                            if (this.radio === '收藏实验') {
                                operatingObj.name = '取消收藏';
                                operatingObj.class = 'li-red';
                            } else {
                                operatingObj.name = '收藏';
                                operatingObj.class = 'li-blue';
                            }
                        } else if (el === 'copy') {
                            operatingObj.name = '复制';
                        } else if (el === 'history') {
                            operatingObj.name = '操作记录';
                        }
                        operatingList.push(operatingObj);
                    });
                    item['operatingList'] = operatingList;
                } else {
                    item['operatingList'] = [{ name: '操作记录' }];
                }
                let obj = Object.assign({}, item);
                tableList.push(obj);
            });
            this.tableData = tableList;
        },
        // table row click
        handelRowClick(row) {
            let _table = this.$refs.table;
            _table.toggleRowExpansion(row);
        },
        // table 展开行 参数点击
        handelModuleParamsClick(el) {
            this.$alert(el, '模块参数详情', {
                showConfirmButton: false,
                customClass: 'module-params-list-box'
            }).catch(() => {});
        },
        // table 展开行 参数 mouseover 变色
        handelModuleParamsMouseover(e) {
            e.currentTarget.className = 'is-active';
        },
        // table 展开行 参数 mouseout 取消变色
        handelModuleParamsMouseout(e) {
            e.currentTarget.className = '';
        },
        handelDocumentClick() {
            // 隐藏操作 框
            this.operatingObj = {};
            // 隐藏实验 框
            this.analysisObj = {};
        },
        // 显示操作栏
        showOperating(row) {
            if (row.operatingList.length > 0) {
                this.operatingObj = {};
                this.analysisObj = {};
                // this.$set(this.operatingObj, id, !this.operatingObj[id]);
                this.$set(this.operatingObj, row.id, true);
            } else {
                this.$message({
                    type: 'info',
                    message: '暂无操作权限!'
                });
            }
        },
        // 操作栏
        handelOperaClick(row, name) {
            if (name === '审核进度') {
                this.handelReviewClick(row);
            } else if (name === '编辑') {
                this.handelEditClick(row);
            } else if (name === '删除') {
                this.handelDelClick(row);
            } else if (name === '收藏') {
                this.handelFavoriteClick(row);
            } else if (name === '取消收藏') {
                this.handelFavoriteClick(row);
            } else if (name === '复制') {
                this.handelCopyClick(row);
            } else if (name === '操作记录') {
                this.handelRecordingClick(row);
            }
        },
        // 操作栏 -> 审核
        handelReviewClick(row) {
            // console.log(row);
            this.$router.push({
                path: '/experiment/create/step4/check',
                query: {
                    id: row.id,
                    approvalType: row.status,
                    login: row.login
                }
            });
        },
        // 操作栏 -> 编辑
        handelEditClick(row) {
            this.$router.push({
                path: '/experiment/create',
                query: {
                    exp_id: row.id
                }
            });
        },
        // 操作栏 -> 复制
        handelCopyClick(row) {
            // console.log('复制', row);
            this.$confirm('确定要复制该实验?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    API.copyExperiment({ id: row.id }).then(res => {
                        if (res.status === 'success') {
                            this.$message({
                                type: 'success',
                                message: '复制成功!'
                            });
                            this.initTableData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                })
                .catch(res => {
                    // this.$message({
                    //     type: 'error',
                    //     message: res.msg
                    // });
                });
        },
        // 操作栏 -> 收藏
        handelFavoriteClick(row) {
            // console.log('收藏' + row.id);
            this.$confirm('确定要收藏该实验?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    API.addFavoriteList({ exp_id: row.id }).then(res => {
                        if (res.status === 'success') {
                            this.$message({
                                type: 'success',
                                message: '收藏成功!'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                })
                .catch(res => {
                    // this.$message({
                    //     type: 'error',
                    //     message: res.msg
                    // });
                });
        },
        // 操作栏 -> 取消收藏
        handelDelFavoriteClick(row) {
            // console.log('取消收藏' + row.id);
            this.$confirm('确定要取消收藏该实验?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    API.delFavoriteList({ exp_id: row.id }).then(res => {
                        if (res.status === 'success') {
                            this.$message({
                                type: 'success',
                                message: '已取消!'
                            });
                            this.initFavoriteTableData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                })
                .catch(res => {
                    // this.$message({
                    //     type: 'error',
                    //     message: res.msg
                    // });
                });
        },
        // 操作栏 -> 操作记录
        handelRecordingClick(row) {
            // console.log('操作记录', row);
            this.$router.push({ name: 'operation', params: { fexp_id: row.id } });
        },
        // 操作栏 -> 删除
        handelDelClick(row) {
            // console.log('删除', row);
            this.$confirm('确定要删除该实验?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    API.delExperiment({ exp_id: row.id }).then(res => {
                        if (res.status === 'success') {
                            this.$message({
                                type: 'success',
                                message: '已删除!'
                            });
                            if (this.radio === '收藏实验') {
                                this.initFavoriteTableData();
                            } else {
                                this.initTableData();
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                })
                .catch(res => {
                    // this.$message({
                    //     type: 'error',
                    //     message: res.msg
                    // });
                });
        },
        // 显示实验分析
        showAnalysis(id) {
            this.operatingObj = {};
            this.analysisObj = {};
            this.$set(this.analysisObj, id, true);
        },
        handleCurrentChange(cpage) {
            this.currPage = cpage;
        },
        handleSizeChange(psize) {
            this.pagesSize = psize;
        }
    }
};
</script>
<style lang="scss">
@import '../../../assets/scss/variables';
.row-abt-list {
    padding: 24px 24px 0 24px;
    font-family: PingFangSC-Regular;
}

.row-list-breadcrumb {
    height: 64px;
    border-bottom: 1px solid $borderColor;
    display: flex;
    align-items: center;
    padding: 0 24px;
    .experimentnum {
        flex: 1;
        text-align: right;
        font-size: 12px;
        color: #909399;
        line-height: 20px;
    }
}

.row-list-radio-group {
    font-size: 14px;
    .el-radio-button {
        text-align: center;
        .el-radio-button__inner {
            border: 1px solid #eeeeee;
            color: #666666;
            box-shadow: none;
        }
    }
    .el-radio-button.is-active {
        .el-radio-button__inner {
            background: rgba(25, 137, 250, 0.1);
            border: 1px solid #249ded;
            border-radius: 4px 0 0 4px;
            color: #249ded;
        }
    }
    .createbtn {
        float: right;
        width: 124px;
        height: 40px;
        background: #249ded;
        border-radius: 4px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
    }
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

#row-list-content {
    padding-left: 10px;
    padding-right: 10px;
    .table-box {
        width: 100%;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #606266;
        overflow: visible;
        .el-table__expand-icon {
            display: none;
        }
        .el-table__body-wrapper {
            overflow: visible;
        }
        .cell-svg {
            cursor: pointer;
        }
        .el-table__expanded-cell {
            padding-bottom: 0px;
        }
        .span-red {
            color: #ff3e00;
        }
        .el-form {
            padding-bottom: 18px;
            .el-form-item {
                margin-right: 0;
                margin-bottom: 0;
                color: #030303;
                letter-spacing: 0;
                width: 100%;
                .el-form-item__label {
                    line-height: 22px;
                    width: 12.5%;
                    color: #030303;
                    letter-spacing: 0;
                }
                .el-form-item__content {
                    line-height: 22px;
                    width: 87.5%;
                    height: 26px;
                    white-space: nowrap;
                    overflow: hidden;
                }
                .font-color {
                    color: #909399;
                }
            }
            .model-params {
                cursor: pointer;
                span {
                    &.is-active {
                        color: #249ded;
                    }
                }
            }
        }
        .operating-box {
            background: #ffffff;
            border: 1px solid #e4e7ed;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
            border-radius: 4px;
            width: 96px;
            position: absolute;
            left: -100px;
            z-index: 100;
            ul {
                padding: 20px 0px 12px 0px;
                li {
                    padding-left: 20px;
                    line-height: 28px;
                    cursor: pointer;
                }
                li:hover {
                    background: #f5f7fa;
                }
                .li-blue {
                    color: #249ded;
                }
                .li-red {
                    color: #ff3e00;
                }
            }
        }
        .analysis-box {
            background: #ffffff;
            border: 1px solid #e4e7ed;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
            border-radius: 4px;
            position: absolute;
            left: -180px;
            z-index: 100;
            ul {
                padding: 20px 0px 12px 0px;
                li {
                    padding: 0px 20px;
                    line-height: 28px;
                    cursor: pointer;
                }
                li:hover {
                    background: #f5f7fa;
                }
            }
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
}
.module-params-list-box {
    width: 600px;
    height: 470px;
    border: none;
    .el-message-box__header {
        .el-message-box__title {
            color: #030303;
            font-size: 14px;
        }
    }
    .el-message-box__content {
        height: 380px;
        background: #112435;
        color: white;
        word-wrap: break-word;
        word-break: break-all;
    }
}
</style>
