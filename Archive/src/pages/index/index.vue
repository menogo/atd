<template>
    <div class="main">
        <div>index page</div>
    </div>
</template>

<script>
import Viewbase from '@/assets/js/viewbase';

export default {
    name: 'indexView',
    extends: Viewbase,
    data() {
        return {};
    },
    mounted() {
        this.hideLoading();
    }
};
</script>

<style scoped></style>
