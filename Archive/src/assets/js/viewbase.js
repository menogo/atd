/**
 * 视图基类
 * 1、封装了视图通用操作（标题设置、路由切换、获取参数）
 * 2、兼容路由视图、弹框子视图开发体验一致
 */
export default {
    data() {
        return {
            // 视图组件是否已缓存
            isViewCached: false
        };
    },

    computed: {
        // 是否弹框子视图
        isSubview() {
            return !!this.$view;
        }
    },

    created() {
        // 此时子视图$view对象还未初始化，建议大家在mounted中访问
    },

    mounted() {
        if (this.title) {
            this.setTitle(this.title);
        }
    },

    deactivated() {
        this.isViewCached = true;
    },

    methods: {
        /**
         * 动态改变title
         * @param  {String} title  视图顶部展示标题
         * @return {undefined}
         */
        setTitle(title) {
            if (this.isSubview) {
                this.$view.setTitle(title);
                return;
            }
            document.title = title;
        },

        // 隐藏loading
        hideLoading() {
            if (this.isSubview) {
                this.$view.hideLoading();
                return;
            }
            app.$pageLoading.hide();
        },

        // 关闭视图
        close() {
            if (this.isSubview) {
                this.$view.close();
            }
        },

        // 获取视图参数
        getParams(name) {
            const data = this.isSubview ? this.$view.data : this.$route.query;
            if (!data) {
                return data;
            }
            return name ? data[name] : data;
        },

        // 提交数据到父视图(子视图专用)
        submit() {
            if (this.isSubview) {
                this.$view.submit.apply(null, arguments);
            }
        },

        /**
         * 通用跳转逻辑处理1
         * @param  {String} url 要跳转的URL地址
         */
        turnPage(url) {
            //保留，后续可加入通用校验逻辑
            window.location.href = url;
        },

        /**
         * 跳转到指定路由视图
         * @param  {String/Object} path 要跳转的路由地址
         * @param  {Object} query 要传递的查询参数
         */
        goRouter(path, query) {
            let router = this.$router || app.$rotuer;
            let params = {
                path: path,
                query: query
            };

            if (Object.prototype.toString.call(path) === '[object Object]') {
                params = path;
            }

            if (router) {
                router.push(params);
            }
        },

        // 刷新路由
        refreshRouter() {
            //进入空白路由后，该路由会重新回到当前路由
            this.goRouter('/blank');
        },

        /**
         * 路由回退
         * @param  {Number} n 路由跳转的层级
         */
        routerBack(n) {
            let router = this.$router || app.$router;
            if (router) {
                router.go(n);
            }
        },

        /**
         * 回到上一级路由
         */
        goBack() {
            this.routerBack(-1);
        }
    }
};
