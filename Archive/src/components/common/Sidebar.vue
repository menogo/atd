<template>
    <el-row class="site-navbar">
        <el-col :span="24">
            <el-menu
                :unique-opened="true"
                :router="true"
                size="small"
                background-color="#ffffff"
                text-color="#000000"
                active-text-color="#ffffff"
                :default-active="$route.path"
                @open="handleOpen"
                @close="handleClose"
            >
                <el-submenu :index="staticMenu.url" v-for="staticMenu in menusList" :key="staticMenu.url">
                    <template slot="title">
                        <i :class="'el-icon-' + staticMenu.icon"></i>
                        <span>{{ staticMenu.text }}</span>
                    </template>
                    <el-submenu
                        :index="subMenu.url"
                        v-for="subMenu in staticMenu.menu"
                        v-if="subMenu.leaf == 'false'"
                        :key="subMenu.url"
                    >
                        <el-menu-item-group :index="subMenu.url" v-for="leafMenu in subMenu.menu" :key="leafMenu.url">
                            <el-menu-item :index="leafMenu.url">{{ leafMenu.text }}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item-group
                        :index="subMenu.url"
                        v-for="subMenu in staticMenu.menu"
                        v-if="subMenu.leaf == 'true'"
                        :key="subMenu.url"
                    >
                        <el-menu-item :index="subMenu.url">{{ subMenu.text }}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
/* eslint-disable */
import menusList from '../../menu';

console.log('Logs::menusList', menusList);
export default {
    name: 'Sidebar',
    data() {
        return {
            menusList: menusList
        };
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },

        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.$router.push(key);
        }
    }
};
</script>

<style lang="scss">
.site-navbar {
    .el-menu .el-menu-item-group__title {
        padding: 0;
    }

    .el-menu {
        border-right: none;
    }

    .el-menu-item.is-active {
        color: #249ded !important;
        background: #ecf5ff !important;
        // background: #2260de !important;
    }
}
</style>
