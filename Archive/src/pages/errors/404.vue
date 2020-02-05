<template>
    <div class="main">找不到您要访问的页面</div>
</template>
<script>
export default {
    mounted() {
        app.$pageLoading.hide();
    }
};
</script>
<style scoped>
.main {
    margin-top: 100px;
    text-align: center;
}
</style>
