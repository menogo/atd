const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const regexInclude = /<\?cs include:PARSE_PATH\("(.*?)"\) \?>/g;

class TemplateWebpackPlugin {
    constructor(opt = {}) {
        this.opt = Object.assign(
            {
                templateParameters: {},
                base: '/template'
            },
            opt
        );
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('TemplateWebpackPlugin', compilation => {
            // 处理后端模板
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('TemplateWebpackPlugin', htmlPluginData => {
                regexInclude.lastIndex = 0;
                let template = htmlPluginData.plugin.options.template;
                const isSpecifyLoader = template.startsWith('!!');
                template = isSpecifyLoader ? template.substr(2) : template;
                const filename = template.split('!')[1];

                if (!filename.startsWith(this.opt.base)) {
                    return;
                }
                let content = htmlPluginData.html;
                let match = null;
                while ((match = regexInclude.exec(content))) {
                    const replacement = match[0];
                    let file = match[1];
                    file = file.startsWith('/') ? file.substr(1) : file;
                    let filename = path.resolve(this.opt.base, file);
                    if (!fs.existsSync(filename)) {
                        // 先简单处理
                        filename = path.resolve(this.opt.base, '../htdocs', file);
                    }
                    const replaceContent = fs.readFileSync(filename, {
                        encoding: 'utf8'
                    });
                    content = content.replace(replacement, replaceContent);
                }

                if (this.opt.templateParameters) {
                    content = ejs.render(content, this.opt.templateParameters);
                }

                htmlPluginData.html = content;
            });
        });
    }
}

module.exports = TemplateWebpackPlugin;
