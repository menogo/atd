<template>
    <section>
        <abt-breadcrumb></abt-breadcrumb>
        <abt-steps :active="3"></abt-steps>
        <router-view></router-view>
    </section>
</template>

<script>
import AbtBreadcrumb from './components/Breadcrumb.vue';
import AbtSteps from './components/Steps.vue';
export default {
    data() {
        return {};
    },
    components: {
        AbtBreadcrumb,
        AbtSteps
    }
};
</script>
