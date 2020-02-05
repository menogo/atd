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
            msg: 'create tags'
        };
    },
    created() {
        console.log(API);
        // API.getProductList().then(res => {
        //     console.log(res)
        // })
    }
};
</script>
