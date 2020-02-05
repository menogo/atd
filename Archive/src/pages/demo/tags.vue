<template>
    <section>
        <div>{{ msg }}</div>
    </section>
</template>

<script>
import API from './api';
export default {
    data() {
        return {
            msg: 'demo tags'
        };
    },
    created() {
        console.log(API);
        // API.fetMenuList().then(res => {
        //     console.log('menuList =>', res);
        // });
        // API.getProductList().then(res => {
        //     console.log(res)
        // })
    }
};
</script>
