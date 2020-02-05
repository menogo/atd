<template>
    <div class="main">系统繁忙，请稍后再试</div>
</template>
<script>
import Viewbase from '@/assets/js/viewbase';
export default {
    extends: Viewbase,
    watch: {
        $route: function() {
            this.hideLoading();
        }
    },
    created() {
        this.hideLoading();
    }
};
</script>
<style scoped>
.main {
    margin-top: 100px;
    text-align: center;
}
</style>
