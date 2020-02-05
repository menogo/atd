<template>
    <section>
        <h1>{{ msg }}</h1>

        <el-row style="margin-bottom: 20px;">
            <el-button type="primary" @click="axiosGet">接口请求-GET</el-button>
            <el-button type="success" @click="axiosPost">接口请求-POST</el-button>
        </el-row>

        <el-row>
            <ul v-for="(value, key) in profile" :key="key">
                <li>{{ key }}: {{ value }}</li>
            </ul>

            <p>
                <el-link type="danger" @click="handleClear" v-show="profile">清空结果</el-link>
            </p>
        </el-row>
    </section>
</template>

<script>
import API from './api';
export default {
    data() {
        return {
            msg: 'demo create',
            profile: false
        };
    },
    created() {
        console.log(process.env);
    },
    methods: {
        axiosGet() {
            API.fetchProfile().then(res => {
                console.log(res);
                this.profile = res;
            });
        },

        axiosPost() {
            API.updateProfile().then(res => {
                console.log(res);
            });
        },

        handleClear() {
            this.profile = false;
        }
    }
};
</script>
