<template>
    <section>
        <abt-breadcrumb></abt-breadcrumb>
        <abt-steps :active="2"></abt-steps>

        <div>{{ msg }}</div>
    </section>
</template>

<script>
import AbtBreadcrumb from './components/Breadcrumb.vue';
import AbtSteps from './components/Steps.vue';

export default {
    data() {
        return {
            msg: 'step3'
        };
    },
    components: {
        AbtBreadcrumb,
        AbtSteps
    },
    created() {}
};
</script>
