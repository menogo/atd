/**
 * 路由访问拦截处理
 */
class RouterIntercept {
    constructor(rules) {
        this.rules = [];
        if (rules && rules.length) {
            this.rules = [].concat(rules);
        }
    }

    /**
     * 添加路由访问权限规则
     * @param {Boolean/Function} cond  校验条件，true:拦截，去指定路由 fasle:不拦截
     * @param {String}  path           拦截后替补访问路由
     * @param {Boolean} important      是否为重要级别，为true会优先判断该规则
     */
    add(cond, path, important) {
        if (path && typeof cond !== 'undefined') {
            let rule = {
                cond: cond,
                path: path
            };
            if (important) {
                this.rules.unshift(rule);
                return;
            }
            this.rules.push(rule);
        }
    }

    /**
     * 获取拦截规则
     * @param {Object} to   要跳转到的路由信息
     * @param {Object} from 跳转源路由信息
     */
    get(to, from) {
        let rule = null;
        let isIntercept = false;
        if (this.rules.length) {
            for (let i = 0; i < this.rules.length; i++) {
                rule = this.rules[i];
                isIntercept = typeof rule.cond === 'function' ? rule.cond(to, from) : rule.cond;
                if (isIntercept === true) {
                    break;
                } else {
                    rule = null;
                }
            }
        }
        return rule;
    }
}

export default RouterIntercept;
