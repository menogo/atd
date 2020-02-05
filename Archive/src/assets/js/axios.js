import Vue from 'vue';
import axios from 'axios';
// import qs from 'qs';

const Error_Network = '网络繁忙，请稍后再试！';
// const Error_404 = '找不到你要访问的资源！';

// 创建axios实例
const Axios = axios.create({
    // 环境的不同，对应不同的API
    baseURL: process.env.VUE_APP_API_ENDPOINT,

    // 默认请求方式
    method: 'get',

    // 请求的超时时间
    timeout: 5000,

    // 设置默认请求头，使 post 请求发送的是 formdata 格式数据
    // Axios 的 header 默认的 Content-Type 是 'application/json;charset=UTF-8',
    headers: {
        'Content-Type': 'application/json',

        // 如果后端需要使用 formdata 格式传输需要改成：
        // 'Content-Type': 'application/x-www-form-urlencoded',

        // "Content-Type": "multipart/form-data"

        'X-Requested-With': 'XMLHttpRequest'
    },

    // 允许请求携带 cookie
    // 如果后端设置了：`Access-Control-Allow-Origin: *`
    // Axios 设置 `withCredentials: true` 会报跨域出错，但是接口还是可以请求成功的！
    // 应该设为 `withCredentials: false`
    withCredentials: false
});

// `transformRequest` 允许在向服务器发送前，修改请求数据
// 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
// 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
axios.defaults.transformRequest = [
    function(data, headers) {
        // 对 data 进行任意转换处理
        // console.log('transformRequest', data)

        return data;
    }
];

// `transformResponse` 在传递给 then/catch 前，允许修改响应数据
axios.defaults.transformResponse = [
    function(data) {
        // 对 data 进行任意转换处理
        // console.log('transformResponse', data)

        return data;
    }
];

// `paramsSerializer` 是一个负责 `params` 序列化的函数
// (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
// axios.defaults.paramsSerializer = function(params) {
//     return QS.stringify(params, { arrayFormat: 'brackets' })
// }

// Request Interceptors
Axios.interceptors.request.use(
    config => {
        // 发送请求之前，要做的业务
        console.log('Logs::axios.config', config);

        if (config && config.loading !== false) {
            app.$loading.show();
        }

        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        // const token = store.state.token;
        // token && (config.headers.Authorization = token);
        // 让每个请求携带token--['X-Token']为自定义key || cookie, 请根据实际情况自行修改

        // 判断为post请求，序列化传来的参数
        // if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
        //     config.data = qs.stringify(config.data);
        // }

        return config;
    },
    error => {
        // 错误处理代码
        // errorHandle()

        return Promise.reject(error);
    }
);

// Response Interceptors
Axios.interceptors.response.use(
    response => {
        // 数据响应之后，要做的业务

        // hide loading
        app.$loading.hide();

        // 错误提示(前提是接口跑通了，只是对里边某些值做下详细判断。要先跟后台商定好，对某个固定的字段进行判断，并且确定固定字段来承接 错误信息，方便展示)
        // if (response.data && response.data.status !== 'success') {
        //     app.$message.error(response.data.msg);
        // }

        return response.data;

        // return response.status === 200 || response.status === 201
        //     ? Promise.resolve(response)
        //     : Promise.reject(response);
    },
    error => {
        // 请求错误时做些事(接口错误、超时等)

        // hide loading
        app.$loading.hide();

        // 打开控制台，可以看到error包含了几个对象:message, config, code, request, response,可以拿来请求超时等问题
        console.log('Logs::XHR Error', error);

        //  判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            app.$message.error(Error_Network);

            // 根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案
            // 例如再重复请求一次
            // return Axios.request(originalRequest);
        }

        return Promise.reject(error);
    }
);

Vue.prototype.$axios = Axios;

export default Axios;
