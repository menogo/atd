<template>
    <div style="margin-top:50px">
        <el-row v-if="isPass">
            <el-col class="suc-demo">
                <el-button
                    type="success"
                    icon="el-icon-check"
                    circle
                    style="width:86px;height:86px;font-size:50px;"
                ></el-button>
            </el-col>
            <el-col style="text-align:center;font-size:20px;font-weight:700">
                <span>审核已提交，等待审核中...</span>
            </el-col>
        </el-row>
        <el-row v-else>
            <el-col class="dang-demo">
                <div
                    style="border-radius:50%;width:86px;height:86px;background-color:red;line-height:86px;text-align:center"
                >
                    <span style="color:#fff;font-size:60px">!</span>
                </div>
            </el-col>
            <el-col style="text-align:center;font-size:20px;font-weight:700">
                <span>审核未通过</span>
            </el-col>
        </el-row>
        <el-row style="margin-top:40px">
            <el-col :span="6" style="margin-left:50%;transform:translate(-50%,0)">
                <el-steps direction="vertical" :space="100" :active="active" finish-status="success">
                    <!-- 三元表达式 第一条、最后一条和中间不太一样 -->
                    <el-step
                        :icon="item.fhandler_result == 2 ? 'el-icon-error' : ''"
                        :title="
                            index == 0
                                ? item.title
                                : item.fhandler
                                ? item.fhandler_result == 1
                                    ? item.fhandler + '审核通过'
                                    : item.fhandler + '审核不通过'
                                : !item.fapproval_author
                                ? item.title
                                : '等待' + item.fapproval_author + '审核中'
                        "
                        v-for="(item, index) in approvalData.flows"
                        :key="index"
                    >
                        <template slot="description">
                            <div>{{ index == 0 ? item.createTime : item.fhandler_time }}</div>
                            <div v-if="item.fhandler_result == 2 && item.fhandler_reason">
                                <!-- 这里放置理由 -->
                                <span class="red">理由{{ item.fhandler_reason }}</span>
                            </div>
                        </template>
                    </el-step>
                </el-steps>
            </el-col>
        </el-row>
        <el-row style="margin-top:40px">
            <el-col :span="6" style="margin-left:50%;transform:translate(-50%,0);text-align:center">
                <el-button type="primary" @click="backExp">返回实验列表</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// 目前这个页面只有一个入口（实验列表页） 且审批状态只有两种 1个是未通过 一个是审批中
import API from '../api';
export default {
    data() {
        return {
            approvalData: { flows: [] },
            isPass: true,
            active: '',
            interval: '',
            businessCode: '',
            expId: '',
            expLogId: '',
            approvalType: ''
        };
    },
    created() {
        this.expId = this.$route.query.id;
        this.expLogId = this.$route.query.login;
        this.approvalType = this.$route.query.approvalType;
        // 由于公共仓库里的businessCode是通过接口返回的 因此直接获取可能获取不到（接口未返回）这里使用定时器
        this.interval = setInterval(() => {
            if (this.$store.getters.activeBusinessCode) {
                this.businessCode = this.$store.getters.activeBusinessCode;
                clearInterval(this.interval);
                let postData = {
                    businessCode: this.businessCode,
                    expId: this.expId,
                    expLogId: this.expLogId,
                    approvalType: this.approvalType
                };
                API.getApprovalFlow(postData).then(res => {
                    if (res.status === 'success') {
                        // 根据审核级别排序
                        let compare = function(i, j) {
                            return i.fapproval_grade - j.fapproval_grade;
                        };
                        res.data.flows.sort(compare);
                        // 由于进度条存在固定项时渲染会有一瞬间体验不好  因此 将数据处理后放到数组中 包含第一项和最后一项
                        res.data.flows.unshift({
                            title: `${res.data.creator} + '发起' + ${res.data.title}`,
                            createTime: res.data.createTime
                        });
                        let isPass = true;
                        for (let i = 1; i < res.data.flows.length; i++) {
                            if (!res.data.flows[i].fhandler) {
                                // 正在审核
                                this.active = i;
                                break;
                            } else if (+res.data.flows[i].fhandler_result === 2) {
                                // 审核不通过
                                isPass = false;
                                this.active = i;
                                break;
                            }
                        }
                        res.data.flows.push({ title: '发布成功，时间为审核成功立即发起' });
                        if (isPass) {
                            this.isPass = true;
                        } else {
                            this.isPass = false;
                        }
                        this.approvalData = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        }, 10);
    },
    methods: {
        backExp() {
            this.$router.push('/experiment/list');
        }
    }
};
</script>

<style lang="less">
// 由于.el-step__icon-inner.el-icon-error这个类需要特殊的样式 这里不能使用scoped
.radius {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #10aeff;
    position: relative;
    margin: 30px auto 20px;
}
.vertical {
    width: 4px;
    height: 20px;
    position: absolute;
    top: 22%;
    left: 45%;
    background-color: #fff;
}
.across {
    width: 20px;
    height: 4px;
    top: 55%;
    left: 45%;
    position: absolute;
    background-color: #fff;
}
.suc-demo {
    text-align: center;
    margin: 16px 0 35px;
    font-weight: 700;
}
.suc-demo i {
    font-weight: 900;
}
.dang-demo div {
    margin: 16px auto 35px;
}
.red {
    color: red;
}
.el-step__icon-inner.el-icon-error {
    color: red !important;
}
.suc-demo > button {
    pointer-events: none;
}
</style>
