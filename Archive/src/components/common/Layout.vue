<template>
    <div id="layout">
        <el-container id="site-container">
            <el-header class="site-header" height="72px">
                <site-header></site-header>
            </el-header>
            <el-container>
                <el-aside class="site-sidebar" width="232px">
                    <sidebar></sidebar>
                </el-aside>
                <el-main class="site-main">
                    <router-view></router-view>
                    <!-- <div class="content-container"></div> -->
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import Sidebar from '@/components/common/Sidebar.vue';
import SiteHeader from '@/components/common/Header.vue';

export default {
    name: 'layout',
    data() {
        return {};
    },
    computed: {},
    created() {},
    components: {
        Sidebar,
        SiteHeader
    },
    methods: {}
};
</script>

<style lang="scss">
$borderColor: #f0f0f0;

#layout {
    height: 100%;
}

#site-container {
    height: 100%;
}

.el-header {
    height: 80px;
    /*border-bottom: 1px solid #2260de;*/
    // border-bottom: 1px solid $borderColor;
    /* margin-bottom: 14px; */
}

.el-aside {
    height: 100%;
    background: #ffffff;
    box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.04);
}

.site-main {
    background: #ffffff;
    margin-top: 14px;
    padding: 0;
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 24px;
    min-width: 1160px;
    box-shadow: 3px 3px 8px 2px rgba(216, 216, 216, 0.5);

    .content-container {
        width: 1160px;
    }
}
</style>
