<template>
    <section>
        <el-row class="row-line">
            <span>全部业务</span>
        </el-row>
        <el-row>
            <el-col :span="8" class="row-content" v-for="item in businessList" :key="item.businessCode">
                <div class="content">
                    <div class="tip">
                        <b>{{ item.businessName }}</b>
                    </div>
                    <span class="num">正在运行的实验： {{ item.onlineNum }} 个</span>
                    <div class="checkbox">
                        <el-checkbox
                            label="设为默认"
                            border
                            :checked="item.businessCode === defaultExperiment"
                            @change="setDefaultExperiment(item.businessCode)"
                        ></el-checkbox>
                    </div>
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            isdefault: true
        };
    },
    computed: {
        ...mapState({
            businessList: state => state.business.list
        }),
        //默认实验
        defaultExperiment: {
            get() {
                return this.$store.getters.activeBusinessCode;
            }
        }
    },
    created() {},
    methods: {
        setDefaultExperiment(code) {
            this.$store.dispatch('business/updateBusinessCode', code).then(res => {
                if (res !== '') {
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: '设置默认实验成功'
                    });
                }
            });
            //跳转至实验列表页面
            this.$router.push('/experiment/list');
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/variables';

.row-line {
    padding: 20px 0 20px 24px;
    border-bottom: 1px solid $borderColor;
    color: #000;
}

.row-content {
    height: 218px;
    border-right: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;

    .content {
        margin: 40px 24px 40px 14px;

        .tip {
            font-size: 20px;
            color: #303133;
            border-left: 4px solid #249ded;
            margin-bottom: 20px;

            b {
                margin-left: 10px;
            }
        }

        .num {
            color: #909399;
        }

        .checkbox {
            display: flex;
            justify-content: flex-end;
            margin-top: 40px;
        }
    }
}
</style>
