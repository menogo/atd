<template>
    <el-row class="row-abt row-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/experiment/business' }">全部业务</el-breadcrumb-item>
            <el-breadcrumb-item>{{ curBusinessInfo.businessName }}</el-breadcrumb-item>
            <el-breadcrumb-item>创建实验</el-breadcrumb-item>
        </el-breadcrumb>
    </el-row>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'AbtBreadcrumb',
    data() {
        return {};
    },
    computed: {
        ...mapState({
            businessList: state => state.business.list,
            activeBusinessCode: state => state.business.activeCode //获取当前业务的code
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
.row-breadcrumb {
    height: 64px;
    border-bottom: 1px solid $borderColor;
    display: flex;
    align-items: center;
    padding: 0 24px;
}
</style>
