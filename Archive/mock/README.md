# 模板cgi调试 & 构建包验证说明

## 开发中调试本地模板(后端无需处理数据)

开发构建中默认支持cgi模板的解析的解析, 会解析如下后端模板语法

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<?cs include:PARSE_PATH("./inc/meta.shtml") ?>
    <title>cgi html</title>
	<?cs include:PARSE_PATH("./inc/ico.html") ?>
</head>
<body>
	<div id="app">
    </div>
    <script type="text/javascript">
        var gLang = <?cs include:PARSE_PATH("./vtools/g/en_utf8.js") ?>;
    </script>
</body>
</html>
```

上面的入口模板会处理`include`语法凭借对应的html片段和数据, 如果想模拟线上真实的url请求来进行模板调试

如访问 `api.target.com/cgi-bin/index.fcgi`时, 返回上面的cgi模板内容

此时需要配置域名代理, 以whistle为例

```bash
api.target.com 127.0.0.1:8080 # 注意devServer端口可能不一致
api.target.com/cgi-bin/index.fcgi 127.0.0.1:8080 # 获取具体到某个cgi
```

然后需要打开模板cgi支持配置

```js
// /build/base.js
{
    cgi: true, // 如果需要模板cgi支持, 这想需要置为true
    // ...
    templateBase: path.resolve(__dirname, '../public/template'), // 模板基础路径, /public/template
    templateParameters: {
        BASE_URL: isProd ? cdnUrl : '/'
    }
};
```

这样在启动开发构建

```bash
npm run dev

App running at:
- Local:   http://localhost:8080/
- Network: http://xx.xx.xx.xxx:8080/

Note that the development build is not optimized.
To create a production build, run npm run build.
```

接下来在浏览器访问`api.target.com/cgi-bin/index.fcgi`即会正常返回本地模板

## 开发中调试本地模板(后端需要处理数据)

假设需要调试的后端模板如下

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<?cs include:PARSE_PATH("./inc/meta.shtml") ?>
    <title>cgi html</title>
	<?cs include:PARSE_PATH("./inc/ico.html") ?>
</head>
<body>
	<div id="app">cgi html</div>
	<script>
	    var MOCK_DATA = <?cs var:mock_data ?>;
	</script>
</body>
</html>
```

其中有需要后端处理并注入的数据(如上面的`mock_data`)

这个时候如果需要调试这样的模板, 可以借助`mock-server`, 除了上面的配置外, 还需要配置proxy

```js
// /config.js
proxy: {
    '/cgi-bin/index.fcgi': {
        target: 'http://127.0.0.1:8889', // mock server监听端口
        headers: {
            host: 'api.target.com' // 项目线上域名
        },
        onProxyReq: function(proxyReq, req, res) {
            proxyReq.setHeader('host', 'api.target.com'); // 项目线上域名
        }
    }
}
```

1. 第一层代理(如whistle), 会把`api.target.com/cgi-bin/index.fcgi`请求转发到`127.0.0.1:8080`(即webpack devServer)
1. webpack devServer会把`*/cgi-bin/index.fcgi`再转发到`http://127.0.0.1:8889`(mock server)
1. mock server处理模板内容返回, 见`/mock/api.target.com/cgi-bin/index.fcgi/调试本地模板/data.js`

然后启动开发构建, 及mock-server

```bash
# 启动开发构建
npm run dev

App running at:
- Local:   http://localhost:8080/
- Network: http://xx.xx.xx.xxx:8080/

Note that the development build is not optimized.
To create a production build, run npm run build.

# 启动mock server
npm run mock

you can access mock server:
http://127.0.0.1:8889
http://xx.xx.xx.xxx:8889

you can access mock server view:
http://127.0.0.1:8889/view
http://xx.xx.xx.xxx:8889/view
```

然后访问http://127.0.0.1:8889/view/mocks, 并勾选`调试本地模板`即可

## 开发中调试本地模板(需后端登录态)

当需要后端的登录态, 或需要微信登录时, 简单的本地mock并不能满足调试需求

这个时候可以通过真正去请求后端cgi去获取登录态, 然后本地拼接模板带上后端的返回的登录态一起返回

步骤分解如下

1. 第一层代理(如whistle), 会把`api.target.com/cgi-bin/index.fcgi`请求转发到`127.0.0.1:8080`(即webpack devServer)
1. webpack devServer会把`*/cgi-bin/index.fcgi`再转发到`http://127.0.0.1:8889`(mock server)
1. mock server会把请求转发到线上(或开发/测试服务器), 获取后端的登录态
1. 获取到后端的登录态后, 再拼接本地模板, 注入mock数据后返回前端页面, 见`/mock/api.target.com/cgi-bin/index.fcgi/调试本地模板(使用后端登录态)/data.js`

然后访问http://127.0.0.1:8889/view/mocks, 并勾选`调试本地模板(使用后端登录态)`即可

## 构建物验证

如果需要对构建产物进行验证, 与开发中调试不同的是, 要调试构建物时并不需要开启webpack devServer

具体步骤分析如下

1. 第一层代理(如whistle), 把`api.target.com/cgi-bin/index.fcgi`请求直接转发到`127.0.0.1:8889`(即mock server)
1. mock server读取构建物中的模板, 并进行必要html片段拼接, 数据注入等, 然后返回html页面
1. 浏览器获取到页面后再次请求js/css等资源, 需要代理(如whistle)直接映射到本地构建物文件夹
1. 前端资源完成加载, 即可对构建物进行验证

whistle配置如下

```bash
api.target.com/cgi-bin/index.fcgi 127.0.0.1:8889 # mock server端口可能不一致
mqq-imgcache.gtimg.cn /local/file/path/to/cdn/dist # cdn资源请求映射到cdn构建物的本地文件夹
```
