<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        :width="width"
        :center="center"
        :show-close="showClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
        :lock-scroll="true"
        :custom-class="customClass"
        @close="close"
    >
        <sub-view
            :view="currView"
            :data="data"
            :action="action"
            v-loading="loading"
            element-loading-background="rgba(255, 255, 255,1)"
            element-loading-custom-class="el-dialog-loading"
        ></sub-view>
    </el-dialog>
</template>
<script>
const DEFAULT_WIDTH = '50%';

const Utils = {
    //解析组建内容
    resolveComponent: component => {
        return new Promise(resolve => {
            if (component && component.constructor === Promise) {
                component.then(res => {
                    resolve((res && res.default) || res);
                });
                return;
            }
            resolve(component);
        });
    },
    //数据拷贝
    copyData: data => {
        return data ? JSON.parse(JSON.stringify(data)) : data;
    }
};

// 定义一个呈现子视图的容器组件
const SubView = {
    name: 'sub-view',
    props: {
        view: {
            type: [Object, Function]
        },
        data: {
            type: [Object, Array]
        },
        action: Object //通知/回调相关处理
    },
    functional: true,
    render(createElement, context) {
        let component = context.props.view;
        let data = context.data || {};

        if (component) {
            //注册vnode执行钩子函数
            if (!data.hook) {
                data.hook = {};
            }
            data.hook.init = vnode => {
                let instanse = vnode && vnode.componentInstance;
                const action = context.props.action || {};
                if (instanse) {
                    const subViewAttrs = {
                        //获取传递到视图中的数据
                        data: context.props.data
                    };
                    //将方法扩展到弹框视图实例上
                    for (let key in action) {
                        if (action.hasOwnProperty(key)) {
                            (k => {
                                subViewAttrs[k] = function() {
                                    action[k].apply(null, arguments);
                                };
                            })(key);
                        }
                    }
                    instanse.$view = subViewAttrs;
                }
            };
            return createElement(component, data);
        }
        return createElement('div', 'there is no view content');
    }
};

//**弹框展示视图组件**/
const Dialog = {
    data() {
        return {
            title: '', //弹出框子视图标题
            width: DEFAULT_WIDTH,
            currView: null, //当前呈现的视图组件对象
            data: null, //给子视图传递的数据
            action: {}, //给子视图传递的调用函数
            center: false, //是否居中展示
            loading: false, //是否展示loading
            visible: false, //是否隐藏
            showClose: true // 是否显示关闭按钮
        };
    },
    components: {
        SubView
    },
    computed: {
        //计算弹框自定义样式名
        customClass() {
            let classList = ['app-dialog', 'app-dialog-ext'];
            if (!this.title) {
                classList.splice(1, 1);
            }
            return classList.join(' ');
        }
    },
    methods: {
        close() {
            this.hide();
        },
        /**
         * 展示弹层
         * @param  {Object} args 展示子视图相关参数
         * @param  {Sting}  [args.title] 标题
         * @param  {Number} [args.width] 宽度，默认800
         * @param  {Function/Object} args.component 视图组件模块对象，必传
         * @param  {Object} [args.data] 传递给子视图的数据/参数
         */
        show(args) {
            const self = this;
            const params = args || {};
            return new Promise((resolve, reject) => {
                Utils.resolveComponent(params.component).then(component => {
                    //更新弹框组件实例属性状态
                    Object.assign(this, {
                        //弹框标题
                        title: params.title || '',
                        //是否展示关闭按钮
                        showClose: params.showClose || true,
                        //高度/宽度
                        width: params.width || DEFAULT_WIDTH,
                        //子视图组件对象
                        currView: component,
                        //传递给子视图的参数
                        data: Utils.copyData(params.data),
                        //暂存promise信息
                        promise: { resolve: resolve },
                        //给子视图方法
                        action: {
                            //子视图提交数据到调用视图
                            submit(data) {
                                self.promise.data = data;
                                self.hide();
                            },
                            //关闭弹框
                            close() {
                                self.hide();
                            },
                            //设置弹框标题
                            setTitle(title) {
                                self.title = title;
                            },
                            //隐藏弹框loading
                            hideLoading() {
                                self.loading = false;
                            }
                        },
                        //是否展示loding
                        loading: true,
                        //是否展示弹框
                        visible: true
                    });
                });
            });
        },
        // 关闭弹层
        hide() {
            Object.assign(this, {
                visible: false,
                loading: false,
                currView: null,
                data: null,
                action: {}
            });
            if (this.promise.resolve) {
                this.promise.resolve(this.promise.data);
            }
        }
    }
};

export default Dialog;
</script>
<style>
/* .el-dialog-loading .el-loading-spinner {
    margin-top: -10%;
} */
.app-dialog-ext .el-dialog__header {
    border-bottom: 1.2px solid #ebeef5;
}
.app-dialog .el-dialog__body {
    overflow: hidden;
}
</style>
