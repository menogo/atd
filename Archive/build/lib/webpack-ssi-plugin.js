const ssi = require('ssi');
const ejs = require('ejs');

class SSIWebpackPlugin {
    constructor(opt = {}) {
        this.opt = Object.assign(
            {
                templateParameters: {},
                base: '/'
            },
            opt
        );
    }

    getParser() {
        if (this.parser) {
            return this.parser;
        }
        this.parser = new ssi(this.opt.base, this.opt.base, '/**/*.shtml');
        return this.parser;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('SSIWebpackPlugin', compilation => {
            // 处理shtml
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('SSIWebpackPlugin', htmlPluginData => {
                const content = htmlPluginData.html;
                let template = htmlPluginData.plugin.options.template;
                const isSpecifyLoader = template.startsWith('!!');
                template = isSpecifyLoader ? template.substr(2) : template;
                const filename = template.split('!')[1];
                const parser = this.getParser();

                let parsedContent = parser.parse(filename, content).contents;

                if (this.opt.templateParameters) {
                    parsedContent = ejs.render(parsedContent, this.opt.templateParameters);
                }
                htmlPluginData.html = parsedContent;
            });
        });
    }
}

module.exports = SSIWebpackPlugin;
