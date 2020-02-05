const axios = require('axios');

// 如果cgi模板中有后端直接插入的数据
// 如var DATA = <?cs var:mock_data ?>;
// 这里可以定义为你希望返回的数据
let DATA = {
    mock_data: {}
};

const dataReg = /<\?cs var:(.*?) \?>/g;

module.exports = async ctx => {
    let html = '';
    try {
        // 需要注意, 如果是多页应用, 这里请求模板的地址需要自行调整
        // 如 http://127.0.0.1:8080/index, http://127.0.0.1:8080/about
        const res = await axios.get('http://127.0.0.1:8080'); // webpack devServer监听的端口
        html = res.data;
    } catch (e) {
        html = e.message;
    }
    let match = null;
    while ((match = dataReg.exec(html))) {
        const replacement = match[0];
        const key = match[1];
        if (DATA[key]) {
            // 匹配html模板数据并替换
            html = html.replace(replacement, JSON.stringify(DATA[key]));
        }
    }

    // 这里返回模板已经插入了mock数据
    return {
        data: html
    };
};
