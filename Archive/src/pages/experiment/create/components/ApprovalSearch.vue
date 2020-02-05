<template>
    <div style="margin-top:30px">
        <el-row>
            <el-row class="margin-b-35" style="margin-top:50px">
                <el-col :span="3" class="textRight">
                    <span class="title">一级审核</span>
                </el-col>
                <el-col :span="21">
                    <span>{{ approval_first }}</span>
                </el-col>
            </el-row>
            <el-row class="margin-b-35">
                <el-col :span="3" class="textRight">
                    <span class="title">二级审核</span>
                </el-col>
                <el-col :span="21">
                    <span>{{ approval_second }}</span>
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
                                ><el-col :span="10"
                                    ><span>{{ approvalData['实验名称'] }}</span></el-col
                                >
                            </el-row>
                            <el-row class="margin-b-15"
                                ><el-col :span="3" class="textRight"> <span>实验负责人:</span></el-col
                                ><el-col :span="10"
                                    ><span>{{ approvalData['实验负责人'] }}</span></el-col
                                >
                            </el-row>
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验类别:</span></el-col
                                ><el-col :span="10"
                                    ><span>{{ approvalData['实验类别'] }}</span>
                                </el-col></el-row
                            >
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验目的:</span></el-col
                                ><el-col :span="10"
                                    ><span>{{ approvalData['实验目的'] }}</span>
                                </el-col></el-row
                            >
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span> 实验层:</span></el-col
                                ><el-col :span="10"
                                    ><span> {{ approvalData['实验层'] }}</span>
                                </el-col></el-row
                            >
                            <el-row class="margin-b-15"
                                ><el-col :span="3" class="textRight"> <span>流量分配方式:</span></el-col
                                ><el-col :span="10"
                                    ><span>{{ approvalData['流量分配方式'] }}</span>
                                </el-col></el-row
                            >

                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验模式:</span></el-col
                                ><el-col :span="10"
                                    ><span>{{ approvalData['实验模式'] }}</span>
                                </el-col></el-row
                            >
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span>实验时间:</span></el-col>
                                <el-col :span="10"
                                    ><span>{{ approvalData['实验时间'] }}</span></el-col
                                >
                            </el-row>
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"><span> 空跑期:</span></el-col
                                ><el-col :span="10"
                                    ><span> {{ approvalData['空跑期'] }}</span></el-col
                                >
                            </el-row>
                            <el-row class="margin-b-15">
                                <el-col :span="3" class="textRight"> <span>关注指标:</span></el-col
                                ><el-col :span="10"
                                    ><span>{{ approvalData['关注指标'] }}</span></el-col
                                >
                            </el-row>
                            <!-- 备注现在不用 -->
                            <!-- <el-row class="margin-b-15">
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
                            </el-row> -->
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="24" style="padding:20px ">
                            <el-row class="margin-b-15" style="margin-top:25px">
                                <el-col :span="3" class="textRight">
                                    <el-button @click="backPage">上一步</el-button>
                                </el-col>
                                <el-col :span="10">
                                    <el-button type="primary" @click="approvalSubmit">提交审核申请</el-button>
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
// 这个页面的入口也只有一个 创建实验的时候会跳转到该页面 需要参数实验id 和实验logId 此页面approvalType只有1（创建）
import API from '../api';
export default {
    data() {
        return {
            approval_first: '',
            approval_second: '',
            approvalData: {},
            interval: '',
            businessCode: '',
            expId: '',
            expLogId: ''
        };
    },
    created() {
        this.expId = this.$route.query.id;
        this.expLogId = this.$route.query.login;
        // 通过计时器拿到公共的businessCode
        this.interval = setInterval(() => {
            if (this.$store.getters.activeBusinessCode) {
                window.clearInterval(this.interval);
                this.businessCode = this.$store.getters.activeBusinessCode;
                API.getApprovalInfo({
                    businessCode: this.businessCode,
                    expId: this.expId,
                    expLogId: this.expLogId,
                    approvalType: 1
                }).then(res => {
                    if (res.status === 'success') {
                        this.approval_first = res.data.approval_first;
                        this.approval_second = res.data.approval_second;
                        let resDulObj = {};
                        res.data.detail.forEach(item => {
                            resDulObj[item.key] = item.value;
                        });
                        this.approvalData = resDulObj;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        }, 50);
        // 只有创建实验的审核才会进入这个界面 因此 approvalType为1
    },
    methods: {
        backPage() {
            this.$router.go(-1);
        },
        approvalSubmit() {
            // 上个页面拿到数据
            let postData = {
                businessCode: this.businessCode,
                expId: this.expId,
                expLogId: this.expLogId,
                approvalType: 1
            };
            API.getApprovalSubmit(postData).then(res => {
                if (res.status === 'success') {
                    this.$message.success(res.msg);
                    this.$router.push({
                        path: 'step4/check',
                        query: { id: this.expId, login: this.expLogId, approvalType: 1 }
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
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
