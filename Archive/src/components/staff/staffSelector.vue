<template>
    <el-select
        v-model="staff"
        filterable
        remote
        clearable
        :multiple="multiple"
        value-key="ID"
        placeholder="请输入关键字"
        :remote-method="getStaffs"
        @change="onSelect"
        :default-first-option="true"
        :loading="isLoading"
        loading-text="请稍候"
    >
        <el-option v-for="item in searchList" :key="item.ID" :label="item.Name" :value="item"></el-option>
    </el-select>
</template>

<script>
export default {
    name: 'staff-selector',
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 20
        },
        searchMock: {
            type: Array,
            default: () => []
        },
        selected: {
            type: [Number, String, Array],
            default: null
        },
        onSelected: null
    },
    data() {
        return {
            staff: [],
            isLoading: false,
            searchList: []
        };
    },
    beforeMount() {
        this.setSearchList();
    },
    methods: {
        jsonp(url, params, timeout = 10000) {
            let timer = null;
            let cbName = 'jsonp_' + (Math.floor(Math.random() * 100000) * Date.now()).toString(14);
            let cbQuery = params.callbackName || 'callback';
            params[cbQuery] = cbName;
            return new Promise(function(res, rej) {
                // Create script element.
                let head = document.querySelector('head');
                let script = document.createElement('script');
                function rmErrListener() {
                    script.removeEventListener('error', onError);
                }

                function onError() {
                    rmErrListener();
                    clearTimeout(timer);
                    rej('400:Bad Request');
                }

                function encodeParams(param, key) {
                    if (param === null) {
                        return '';
                    }
                    let paramStr = '';
                    let t = typeof param;
                    if (t === 'string' || t === 'number' || t === 'boolean') {
                        paramStr += '&' + key + '=' + encodeURIComponent(param);
                    } else {
                        for (let i in param) {
                            let k = !key ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                            paramStr += encodeParams(param[i], k);
                        }
                    }
                    return paramStr;
                }

                script.addEventListener('error', onError);
                script.src = url + '?' + encodeParams(params);
                head.appendChild(script);

                window[cbName] = function(json) {
                    clearTimeout(timer);
                    rmErrListener();
                    head.removeChild(script);
                    delete window[cbName];
                    res(json);
                };
                if (typeof timeout === 'number') {
                    timer = setTimeout(function() {
                        rmErrListener();
                        head.removeChild(script);
                        delete window[cbName];
                        rej('408:Request Timeout');
                    }, timeout);
                }
            });
        },
        onSelect() {
            let data;
            if (this.multiple) {
                data = [];
                this.staff.forEach(stf => {
                    let zh_name = stf.Name.match(/^(.+)\((.+)\)/)[2];
                    let en_name = stf.Name.match(/^(.+)\((.+)\)/)[1];
                    data.push({ id: stf.ID, name: stf.Name, code: stf.Code, zh_name, en_name });
                });
            } else {
                let zh_name = this.staff.Name.match(/^(.+)\((.+)\)/)[2];
                let en_name = this.staff.Name.match(/^(.+)\((.+)\)/)[1];
                data = { id: this.staff.ID, rtxName: this.staff.Name, code: this.staff.Code, zh_name, en_name };
            }
            if (typeof this.onSelected === 'function') {
                this.onSelected(data);
            } else {
                this.$emit('selected', data);
            }
        },
        //获取员工
        async getStaffs(q) {
            this.isLoading = true;
            try {
                this.searchList = await this.jsonp(`http://hrc.oa.com/v1.1/pages/chooser/data/staff.aspx`, {
                    deptlevel: -1,
                    depttypeid: -1,
                    includeDimission: false,
                    limit: this.limit,
                    q: q
                });
                this.isLoading = false;
            } catch (e) {
                this.$message.error(e);
            }
        },

        setSearchList() {
            if (this.searchMock && this.searchMock.length > 0) {
                this.searchList = this.searchMock;
                //转换key
                this.searchList.forEach(item => {
                    if (!item.ID) {
                        item.ID = item.id;
                    }
                    if (!item.Name) {
                        item.Name = item.name;
                    }
                });
                if (Array.isArray(this.selected)) {
                    this.staff = [];
                    this.selected.forEach(stf => {
                        this.searchList.forEach(item => {
                            if (item.ID.toString() === stf.toString()) {
                                this.staff.push(item);
                            } else if (item.ID.toString() === stf.id.toString()) {
                                this.staff.push(item);
                            }
                        });
                    });
                } else {
                    this.staff = this.searchList.find(item => item.id.toString() === this.selected.toString());
                }
            }
            if (this.multiple && this.selected.length === 0) {
                this.staff = [];
            } else if (!this.multiple && !this.selected) {
                this.staff = null;
            }
        }
    },
    watch: {
        searchMock: function(after, before) {
            this.setSearchList();
        }
    }
};
</script>

<style scoped>
.el-select {
    width: 100%;
}
</style>
