<template>
    <el-row class="row-abt row-steps">
        <el-steps :active="active" simple>
            <el-step title="填写实验信息"></el-step>
            <el-step title="实验下发"></el-step>
            <el-step title="实验测试"></el-step>
            <el-step title="申请发布审核"></el-step>
        </el-steps>
    </el-row>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'AbtSteps',
    data() {
        return {};
    },
    props: {
        active: {
            type: Number,
            require: true
        }
    },
    computed: {
        ...mapState({
            businessList: state => state.business.list,
            activeBusinessCode: state => state.business.activeCode, //获取当前业务的code
            fromData: state => state.createExp.createExpData //获取step_1表单中的信息
        }),
        // 根据业务code获取业务信息
        curBusinessInfo: {
            get() {
                let arr = this.businessList.filter(item => {
                    return Number(item.businessCode) === Number(this.activeBusinessCode);
                });
                return arr[0] || {};
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import '../../../../assets/scss/variables';
.row-steps {
    // height: 80px;
    border-bottom: 1px solid $borderColor;
    // display: flex;
    // align-items: center;
    padding: 16px 24px;
    // max-width: 1180px;
}

.row-steps /deep/ .el-steps--simple {
    padding-left: 0;
    background: #ffffff;
    padding-left: 0;
    padding-right: 0;
    width: 824px;
}
.row-steps /deep/ .el-step.is-simple .el-step__arrow {
    position: relative;
}

.row-steps /deep/ .el-step.is-simple .el-step__arrow::before {
    -webkit-transform: rotate(0deg) translateY(0px);
    transform: rotate(0deg) translateY(0px);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
}

.row-steps /deep/ .el-step.is-simple .el-step__arrow::after {
    -webkit-transform: rotate(0deg) translateY(0px);
    transform: rotate(0deg) translateY(0px);
    -webkit-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
}

.row-steps /deep/ .el-step.is-simple .el-step__arrow::after,
.row-steps /deep/ .el-step.is-simple .el-step__arrow::before {
    content: '';
    display: inline-block;
    position: absolute;
    height: 2px;
    width: 90%;
    background: #c0c4cc;
}
</style>
