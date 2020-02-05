export default {
    methods: {
        /**
         * 设置延时器，具备视图销毁后自动清除延时器能力
         * @param {Function} fn  延时后要执行的回调
         * @param {[Number]} delay 延时时间，单位秒
         */
        setTimeout(fn, delay) {
            let result = 0;
            if (this._isDestroyed || this._inactive === true) {
                this.clearTimeout();
                return result;
            }
            if (!fn) {
                return result;
            }
            if (!this._cacheTimeout) {
                this._cacheTimeout = {};
            }
            result = window.setTimeout(
                function() {
                    if (this._isDestroyed || this._inactive === true) {
                        this.clearTimeout();
                        return;
                    }
                    fn();
                }.bind(this),
                delay
            );
            this._cacheTimeout[result] = result;
            return result;
        },
        /**
         * 清除延时器
         * @param  {Number} [timer] 延时器编号，为空时清除全部
         */
        clearTimeout(timer) {
            if (timer) {
                window.clearTimeout(timer);
                if (this._cacheTimeout) {
                    delete this._cacheTimeout[timer];
                }
                return;
            }
            //没有指定具体定时任务则清除全部定时器
            if (this._cacheTimeout) {
                for (let key in this._cacheTimeout) {
                    if (this._cacheTimeout.hasOwnProperty(key)) {
                        window.clearTimeout(key);
                    }
                }
                delete this._cacheTimeout;
            }
        },
        /**
         * 设置定时器，具备视图销毁后自动清楚定时器能力
         * @param {Function} fn  定时后要执行的回调
         * @param {[Number]} delay 定时时间，单位秒
         */
        setInterval(fn, delay) {
            let result = 0;
            if (this._isDestroyed || this._inactive === true) {
                this.clearInterval();
                return result;
            }
            if (!fn) {
                return result;
            }
            if (!this._cacheInterval) {
                this._cacheInterval = {};
            }
            result = window.setInterval(
                function() {
                    if (this._isDestroyed || this._inactive === true) {
                        this.clearInterval();
                        return;
                    }
                    fn();
                }.bind(this),
                delay || 0
            );
            this._cacheInterval[result] = result;
            return result;
        },
        /**
         * 清除延时器
         * @param  {Number} [timer] 定时器编号，为空时清除全部
         */
        clearInterval(timer) {
            if (timer) {
                window.clearInterval(timer);
                if (this._cacheInterval) {
                    delete this._cacheInterval[timer];
                }
                return;
            }
            if (this._cacheInterval) {
                for (let key in this._cacheInterval) {
                    if (this._cacheInterval.hasOwnProperty(key)) {
                        window.clearInterval(key);
                    }
                }
                delete this._cacheInterval;
            }
        }
    }
};
