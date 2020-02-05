<template>
    <section class="site-header">
        <img :src="logo" class="logo-img" />
        <h1 class="logo-text">FiT A/Btest平台</h1>
        <div class="logo-splitter"></div>
        <el-select ref="businessSelect" popper-class="business-select" filterable v-model="activeBusinessCode">
            <el-option
                v-for="item in businessList"
                :key="item.businessCode"
                :label="item.businessName"
                :value="item.businessCode"
            ></el-option>
        </el-select>

        <div class="logo-info">
            <i class="el-icon-question logo-help"></i>
            <div class="logo-badge" v-click-outside="closeNews" @click="showNews">
                <el-badge :value="userNewsNum">
                    <i class="el-icon-message-solid logo-icon"></i>
                    <ul class="todo-list" v-show="isShowNews">
                        <todo
                            v-for="(todo, index) in newsList.slice(0, clickNum * limitNum)"
                            :key="index"
                            :todo="todo"
                        />
                        <li class="view-more">
                            <span v-show="userNewsNum - clickNum * limitNum < limitNum" class="no-more"
                                >没有更多了</span
                            >
                            <span
                                v-show="userNewsNum - clickNum * limitNum >= limitNum"
                                class="more"
                                @click="clickNum++"
                                >查看更多</span
                            >
                        </li>
                    </ul>
                </el-badge>
            </div>

            <el-avatar size="medium" :src="avatar" class="user-avatar"></el-avatar>
            <span class="logo-user">{{ userName }}</span>
        </div>
    </section>
</template>

<script>
import logoGif from '@/assets/img/logo.svg';
import Todo from './TodoList.vue';
import ClickOutside from '@/directive/ClickOutside';
import { mapState } from 'vuex';

export default {
    name: 'header',
    components: { Todo },
    directives: { ClickOutside },
    data() {
        return {
            logo: logoGif,
            isShowNews: false,
            clickNum: 1,
            limitNum: 5,
            interval: null
        };
    },
    computed: {
        ...mapState({
            userName: state => state.user.name,
            avatar: state => state.user.avatar,
            userNews: state => state.user.news,
            businessList: state => state.business.list,
            test: state => state.business.isDefault
        }),
        activeBusinessCode: {
            get() {
                return this.$store.getters.activeBusinessCode;
            },
            set(val) {
                let selectedBusiness = this.businessList.find(item => {
                    return item.businessCode === val;
                });
                let businessName = selectedBusiness.businessName;
                this.$store.dispatch('business/setActiveName', businessName);

                //二次确认切换业务
                this.$confirm('确定切换到 <strong>' + businessName + '</strong> 吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                })
                    .then(() => {
                        this.$store.dispatch('business/updateBusinessCode', val).then(res => {
                            this.$emit('change');
                            if (res !== '') {
                                this.$message({
                                    showClose: true,
                                    type: 'success',
                                    message: '切换成功'
                                });
                            }
                        });
                        //跳转至实验列表页面
                        this.$router.push('/experiment/list');
                        this.$refs.businessSelect.blur();
                    })
                    .catch(() => {
                        this.$message({
                            showClose: true,
                            type: 'info',
                            message: '已取消切换'
                        });
                        this.$refs.businessSelect.blur();
                    });
            }
        },
        newsList: {
            get() {
                return this.$store.getters.news;
            }
        },
        userNewsNum: {
            get() {
                let newsList = this.$store.getters.news;
                return newsList.length;
            }
        }
    },
    created() {
        this.interval = setInterval(() => {
            if (this.$store.getters.isDefault !== '') {
                window.clearInterval(this.interval);
                //系统无默认业务时，默认跳转至"全部业务页面
                if (this.$store.getters.isDefault !== 'true') {
                    this.$router.push('/experiment/business');
                }
            }
        }, 50);
    },
    methods: {
        showNews(e) {
            this.isShowNews = true;
        },
        closeNews() {
            this.isShowNews = false;
        }
    }
};
</script>

<style lang="scss">
.el-header.site-header {
    padding: 0 24px;
}

.site-header {
    width: 100%;
    background: #303133;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 8px 1px rgba(0, 0, 0, 0.18);
    justify-content: space-between;

    input[type='text'] {
        background-color: #303133;
        color: #fff;
    }

    .el-input__inner {
        border: none;
        &:hover {
            border: none;
        }
    }

    .el-icon-arrow-up {
        &:before {
            content: '\e790';
        }
    }

    .el-select {
        .el-input.is-focus {
            .el-input__inner {
                border: none;
            }
        }
    }

    .el-select {
        .el-input__inner {
            &:focus {
                border: none;
            }
        }
    }

    .logo-img {
        width: 32px;
        height: 30px;
        margin-right: 10px;
    }

    .logo-text {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #ffffff;
    }

    .logo-splitter {
        width: 1px;
        height: 16px;
        margin-left: 30px;
        margin-right: 10px;
        background: #909399;
    }

    .logo-info {
        display: inline-flex;
        flex: 1;
        justify-content: flex-end;
        align-items: center;
        color: #c0c4cc;

        .logo-help,
        .logo-icon {
            font-size: 20px;
        }

        .logo-help,
        .logo-badge {
            margin-right: 30px;
        }

        .logo-badge {
            position: relative;
            .el-badge__content {
                width: 12px;
                height: 12px;
                line-height: 12px;
                padding: 0;
                top: -4px;
                left: 4px;
                background: #ff3e00;
                border-radius: 2px;
                border: none;
            }

            .todo-list {
                position: absolute;
                top: 30px;
                right: 0;
                width: 424px;
                background: #fff;
                border: 1px solid #e4e7ed;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
                border-radius: 4px;
                z-index: 2;

                li {
                    font-size: 14px;
                    color: #666;
                    letter-spacing: 0;
                    padding: 20px 0;
                }

                .todo {
                    border-bottom: 1px solid #ebeef5;
                    .todo-content {
                        padding: 0 20px;
                        display: flex;

                        .todo-info {
                            width: 315px;
                            label {
                                padding-right: 20px;
                            }

                            .text-strong {
                                color: #151515;
                                font-weight: bold;
                                padding: 0 5px;
                            }
                        }

                        .todo-time {
                            display: inline-flex;
                            flex: 1;
                            justify-content: flex-end;
                        }
                    }
                }

                .view-more {
                    text-align: center;

                    .no-more {
                        color: #c0c4cc;
                    }

                    .more {
                        color: #3c3c3e;
                    }
                }
            }
        }

        .user-avatar {
            margin-right: 10px;
        }

        .logo-user {
            font-size: 14px;
            letter-spacing: 0;
        }
    }
}
</style>
