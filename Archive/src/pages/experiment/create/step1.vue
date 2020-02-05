<template>
    <section>
        <abt-breadcrumb></abt-breadcrumb>
        <abt-steps :active="0"></abt-steps>
        <el-form :model="fromData" :rules="rules" ref="fromData" label-width="100px" class="form-container">
            <el-form-item label="实验业务线">
                {{ curBusinessInfo.businessName }}
            </el-form-item>

            <el-form-item label="实验名称" prop="name">
                <el-input size="large" type="text" v-model="fromData.name" placeholder="给实验起个名字"></el-input>
            </el-form-item>

            <el-form-item label="实验负责人" prop="charger">
                <!-- <el-input size="large" type="text" v-model="fromData.charger" placeholder="请填写负责人"></el-input> -->
                <staffSelector @selected="selectedStaff"></staffSelector>
            </el-form-item>

            <el-form-item label="实验类别" prop="type">
                <el-radio-group v-model="fromData.type">
                    <el-radio :label="item.key" name="type" v-for="item in expType" :key="item.key">
                        {{ item.txt }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="实验目的" prop="purpose">
                <el-input size="large" type="text" v-model="fromData.purpose" placeholder="请输入实验目的"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('fromData')">下一步</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
import staffSelector from '../../../components/staff/staffSelector';
import AbtBreadcrumb from './components/Breadcrumb.vue';
import AbtSteps from './components/Steps.vue';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            expType: [
                { key: 'program', txt: '后台实验' },
                { key: 'web', txt: 'web实验' },
                { key: 'ui', txt: 'UI实验' },
                { key: 'lpo', txt: 'LPO实验' },
                { key: 'alg', txt: '算法实验' }
            ],
            rules: {
                name: [{ required: true, message: '给实验起个名字', trigger: 'blur' }],
                charger: [{ required: true, message: '请填写负责人', trigger: 'blur' }],
                type: [{ required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
                purpose: [{ required: false, message: '请填写活动形式', trigger: 'blur' }]
            }
        };
    },
    components: {
        AbtBreadcrumb,
        AbtSteps,
        staffSelector
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
    },
    methods: {
        // 提交表单，这里是用store缓存给第二步
        submitForm: function() {
            this.$refs['fromData'].validate(valid => {
                if (!valid) {
                    return false;
                }
                this.$store.dispatch('setCreateExpData', this.fromData);
                this.$router.push('/experiment/create/step2');
            });
        },
        selectedStaff: function(data) {
            this.fromData.charger = data.en_name;
        }
    },
    created() {},
    mounted() {}
};
</script>
<style lang="scss">
.form-container {
    margin: 32px 40px;
    width: 60%;
}
</style>
