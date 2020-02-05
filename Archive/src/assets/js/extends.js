import Vue from 'vue';
import Dialog from '@/components/common/dialog.vue';
import { Loading } from 'element-ui';
import './axios';

// 事件总线
const EventBus = new Vue();

export default {
    $on() {
        return EventBus.$on.apply(EventBus, arguments);
    },

    $off() {
        return EventBus.$off.apply(EventBus, arguments);
    },

    $once() {
        return EventBus.$once.apply(EventBus, arguments);
    },

    $emit() {
        return EventBus.$emit.apply(EventBus, arguments);
    },

    // 页面级loading对话框（背景遮挡）
    $pageLoading: {
        el: document.querySelector('#app_loading'),
        show() {
            this.el.classList.remove('hide');
        },
        hide() {
            this.el.classList.add('hide');
        }
    },

    // 局部loading
    $loading: {
        el: null,
        show() {
            this.el = Loading.service({
                body: true,
                fullscreen: true,
                background: '#00000030',
                lock: true
            });
        },
        hide() {
            if (this.el) {
                this.el.close();
            }
        }
    },

    $msgbox: {
        /**
         * 消息提示
         * @param {object} title  标题
         * @param {object} text  内容
         * @return {Object} Promise
         */
        alert(text, title) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$alert(text || '', title || '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if (resolve) {
                            resolve(action);
                        }
                    }
                });
            });
        },

        /**
         * 信息确认框
         * @param {object} title  标题
         * @param {object} text  内容
         * @return {Object} Promise
         */
        confirm(text, title) {
            return new Promise((resolve, reject) => {
                let callback = resolve || function() {};
                Vue.prototype
                    .$confirm(text || '', title || '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        callback(true);
                    })
                    .catch(() => {
                        callback(false);
                    });
            });
        }
    },
    $message: {
        error(message) {
            // Vue.prototype.$message.error(message);
            this.show({ message: message, type: 'error' });
        },

        success(message) {
            this.show({ message: message, type: 'success' });
        },

        warn(message) {
            this.show({ message: message, type: 'warning' });
        },

        show(args) {
            Vue.prototype.$message(args);
        }
    },

    $dialog: {
        els: [],
        /**
         * 弹框展示子视图，适合内容比较复杂需要独立页面承载
         * @param {Object} args 弹框需要的参数
         * @param {String} args.title 标题
         * @param {Number/String} args.width 宽度
         * @param {Number/String} args.height 高度
         * @param {VueComponent} args.component 内容
         *
         * @example
         * import View from './index.vue';
         * app.$dialog.show({component:View}).then(res=>{
         *    alert(res);
         * });
         * //View视图中的处理:
         * View ={
         *   mounted(){
         *      let data = this.$view.data  //获取传入视图的数据
         *      this.$view.submit({a:1})    //将数据提交出去，父页面通过上面的then方法接收
         *      this.$view.close()         //关闭弹框
         *      this.$view.hideLoading()   //关闭loading
         *   }
         * }
         */
        show(args) {
            if (!args) {
                return;
            }

            // 动态创建挂载点
            const el = document.createElement('div');
            el.id = `app_dialog_${this.els.length}`;
            document.body.appendChild(el);

            // 动态挂载弹框
            const DialogClass = Vue.extend(Dialog);
            let dialog = new DialogClass().$mount(`#${el.id}`);
            this.els.push(dialog);
            return dialog.show(args);
        },

        // 销毁所有视图弹框
        destroy() {
            while (this.els.length) {
                let el = this.els.splice(0, 1)[0];
                document.body.removeChild(el.$el);
                el.$destroy();
            }
        }
    },

    // ajax挂载到app
    $axios: Vue.prototype.$axios
};
