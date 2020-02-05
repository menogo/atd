const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

proxy = httpProxy.createServer({
    secure: false
});

async function req({ req, res }) {
    proxy.web(req, res, {
        target: {
            protocol: 'https:',
            host: 'ww.xx.yy.zz', // 目标服务器, 可以写ip也可以写域名
            hostname: 'api.target.com', // 请求host
            port: 443,
            pfx: fs.readFileSync(path.resolve(process.cwd(), 'mock/cert/cert.p12')), // 如果服务器是https需要生成证书
            passphrase: 'password'
        },
        selfHandleResponse: true
    });

    return new Promise((resolve, reject) => {
        proxy.once('proxyRes', function(proxyRes, req, res) {
            let body = [];
            let size = 0;
            function onData(chunk) {
                body.push(chunk);
                size += chunk.length;
            }

            proxyRes.on('data', onData).once('end', () => {
                proxyRes.off('data', onData);
                body = Buffer.concat(body, size);
                resolve({
                    header: proxyRes.headers,
                    data: body,
                    status: proxyRes.statusCode
                });
            });
        });
    });
}

module.exports = async function(ctx) {
    // 登录态
    const res = await req(ctx);
    const header = res.header;
    res.header = Object.keys(header).reduce((prev, key) => {
        let newKey = key
            .split('-')
            .map(v => v.charAt(0).toUpperCase() + v.slice(1))
            .join('-');
        prev[newKey] = header[key];
        return prev;
    }, {});

    if (res.header['Set-Cookie']) {
        // 如果有Set-Cookie header, 则处理返回本地模板
        // 这里处理模板的语法
        // 1. 处理类似include的拼接模板的语法
        // 2. 处理类似<?cs var: ?>插入变量/数据的语法
        // 3. 等等等等....
        res.data = '本地模板';

        // 这里需要注意, 目标服务器可能会返回gzip过后的数据
        // 如果不对Content-Encoding和Content-Length进行处理的话
        // 会导致响应中Content-Length和实际内荣长度不一致而出错
        res.header['Content-Encoding'] = 'identity';
        delete res.header['Content-Length'];
    }
    return res;
};
