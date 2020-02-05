<template>
    <div style="margin-top:50px">
        <el-row>
            <el-col class="demo">
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
        <el-row style="margin-top:40px">
            <el-col :span="8" style="margin-left:50%;transform:translate(-50%,0)">
                <el-steps direction="vertical" :space="100" :active="1" finish-status="success">
                    <el-step :title="title1" :description="description1"></el-step>
                    <el-step :title="title2" :description="description1"></el-step>
                    <el-step :title="title3" :description="description1"></el-step>
                    <el-step :title="title4" :description="description1"></el-step>
                </el-steps>
            </el-col>
        </el-row>
        <el-row style="margin-top:40px">
            <el-col :span="8" style="margin-left:50%;transform:translate(-50%,0);text-align:center">
                <el-button type="primary">返回实验列表</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title1: 'v_yqsshen(申云强)发起审核【10086按钮颜色区分PV】',
            title2: '等待v_yqsshen(申云强)审核中',
            title3: '等待v_yqsshen(申云强)审核中',
            title4: '发布成功，时间为审核成功立即发起',
            description1: '2019-12-30 16:00:49'
        };
    },
    created() {}
};
</script>

<style lang="scss">
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
    transition: transform();
}
.across {
    width: 20px;
    height: 4px;
    top: 55%;
    left: 45%;
    position: absolute;
    background-color: #fff;
}
.demo {
    text-align: center;
    margin: 16px 0 35px;
    font-weight: 700;
}
.demo i {
    font-weight: 900;
}
</style>
