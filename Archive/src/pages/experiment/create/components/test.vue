<template>
    <div style="margin-top:30px">
        <el-row>
            <el-row class="margin-b-35" style="margin-top:50px">
                <el-col :span="3" class="textRight">
                    <span class="title">一级审核</span>
                </el-col>
                <el-col :span="21">
                    <span>{{ name1 }}</span>
                </el-col>
            </el-row>
            <el-row class="margin-b-35">
                <el-col :span="3" class="textRight">
                    <span class="title">二级审核</span>
                </el-col>
                <el-col :span="21">
                    <span>{{ name2 }}</span>
                </el-col>
            </el-row>
            <el-row class="gray">
                <el-col :span="3" class="textRight">
                    <span class="title">审核内容</span>
                </el-col>
                <el-col :span="21">
                    <el-row>
                        <el-col :span="24" style="padding:20px;border-radius:5px">
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验名称:</span></el-col
                                ><el-col :span="10"><span>10086_按钮颜色区分PV</span></el-col>
                            </el-row>
                            <el-row class="margin-b-15"
                                ><el-col :span="3" class="textRight"> <span>实验负责人:</span></el-col
                                ><el-col :span="10"><span>xxxxx</span></el-col>
                            </el-row>
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验类别:</span></el-col
                                ><el-col :span="10"><span>后台试验</span> </el-col></el-row
                            >
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验目的:</span></el-col
                                ><el-col :span="10"><span>为了维护世界的和平</span> </el-col></el-row
                            >
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span> 实验层:</span></el-col
                                ><el-col :span="10"><span> Predict_精排</span> </el-col></el-row
                            >
                            <el-row class="margin-b-15"
                                ><el-col :span="3" class="textRight"> <span>流量分配方式:</span></el-col
                                ><el-col :span="10"><span>按比例下发_35%</span> </el-col></el-row
                            >

                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验模式</span></el-col
                                ><el-col :span="10"><span>公用原始版本实验</span> </el-col></el-row
                            >
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验时间:</span></el-col>
                                <el-col :span="10"><span>2020/01/07一2020/01/31</span></el-col>
                            </el-row>
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span> 空跑期:</span></el-col
                                ><el-col :span="10"><span> 3天</span></el-col>
                            </el-row>
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"> <span>关注指标:</span></el-col
                                ><el-col :span="10"><span>PV、UV、CTR、转化率、关注率、点赞率、评论率</span></el-col>
                            </el-row>
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight">
                                    备注:
                                </el-col>
                                <el-col :span="10">
                                    <el-input
                                        type="textarea"
                                        placeholder="请输入备注信息"
                                        v-model="textarea"
                                        resize="none"
                                        :rows="3"
                                    >
                                    </el-input>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="24" style="padding:20px ">
                            <el-row class="margin-b-15" style="margin-top:25px">
                                <el-col :span="3" class="textRight">
                                    <el-button @click="backPage">上一步</el-button>
                                </el-col>
                                <el-col :span="10">
                                    <el-button type="primary">提交审核申请</el-button>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>
<script>
import API from '../api';
export default {
    data() {
        return {
            name1: 'tcmtang(汤楚明)',
            name2: 'bladedu(杜西裤)'
        };
    },
    created() {
        API.getApprovalInfo({ businessCode: 16, expId: 1, expLogId: 1 }).then(res => {
            if (res.status === 'success') {
                this.name1 = res.data.approval_first;
                this.name2 = res.data.approval_second;
                // res.data.detail.forEach(item => {});
            }
        });
    },
    methods: {
        backPage() {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="less" scoped>
.textRight {
    text-align: right;
    padding-right: 20px;
}
.title {
    color: #1c1c1c;
    font-weight: 700;
}
.margin-b-35 {
    margin-bottom: 35px;
}
.margin-b-15 {
    margin-bottom: 15px;
}
.gray .textRight {
    color: #a0a3a8;
}
textarea {
    height: 100px;
}
</style>
