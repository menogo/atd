<template>
    <el-form ref="form" :model="form" class="version">
        <!-- 原始公共版本 -->
        <el-row class="label-row contrast-row">
            <el-form-item label="实验配置" prop="contrastVersion" class="originversion-wrap">
                <el-input
                    placeholder="请输入内容"
                    v-model="getOriginVersionName"
                    :disabled="true"
                    class="origin-name"
                ></el-input>
            </el-form-item>

            <el-form-item prop="contrastVar" class="originvar-wrap">
                <el-input
                    placeholder="请输入内容"
                    v-model="getOriginVersionParams"
                    :disabled="true"
                    class="origin-params"
                ></el-input>
            </el-form-item>

            <el-form-item prop="contrastVar" class="originflow-wrap">
                <el-input placeholder v-model="form.originFlow" disabled="true" class="origin-flow">
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>
        </el-row>

        <!-- 实验版本 -->
        <el-row class="label-row param-row version-wrap">
            <section class="version-name">
                <el-form-item prop="versionName">
                    <el-input
                        prop="versionName"
                        placeholder="请输入内容"
                        v-model="form.versionName"
                        class="version"
                    ></el-input>
                </el-form-item>
            </section>

            <!-- 新增参数 -->
            <section class="version-param">
                <el-row class="label-row param-more" v-for="(param, index) in form.addParamList" :key="index">
                    <el-form-item prop="paramName">
                        <el-select
                            v-model="param.key"
                            placeholder="请选择参数名称"
                            class="param-name"
                            @change="onParamChange(param)"
                        >
                            <el-option v-for="item in paramKeyList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="paramValue">
                        <el-popover placement="bottom-start" width="168" trigger="click">
                            <el-radio-group
                                v-model="param.value"
                                v-for="item in valuesList"
                                :key="item.id"
                                value-key="item"
                                @change="onAddValueChange(item, param)"
                            >
                                <el-radio-button :key="item" :value="item" :label="item.value">{{
                                    item.value
                                }}</el-radio-button>
                            </el-radio-group>
                            <el-input
                                slot="reference"
                                placeholder="请输入内容"
                                class="param-value"
                                v-model="param.value"
                                @focus="handleParamValueInputFocus(event, param)"
                            ></el-input>
                        </el-popover>
                    </el-form-item>
                </el-row>
            </section>
            <section class="version-flow">
                <el-form-item class="flow">
                    <el-popover placement="bottom" width="400" trigger="click">
                        剩余流量：{{ diffProportion }}%
                        <el-slider
                            v-model="form.versionFlowVal"
                            show-input
                            :min="0"
                            :max="remainProportion"
                        ></el-slider>
                        <el-input
                            slot="reference"
                            placeholder
                            v-model="form.versionFlowVal"
                            @focus="handleFlowInputFocus"
                        >
                            <template slot="append">%</template>
                        </el-input>
                    </el-popover>
                </el-form-item>
            </section>
        </el-row>

        <el-row class="label-row addparam-row">
            <el-form-item>
                <el-button size="medium" @click="addParam">
                    <i class="el-icon-circle-plus-outline"></i>新增参数
                </el-button>
            </el-form-item>
        </el-row>
    </el-form>
</template>

<script>
export default {
    name: 'header',
    data() {
        return {
            paramValue: '',
            form: {
                originVersion: '原始公共版本',
                originParams: 'name/john;age/27',
                originFlow: '30',

                versionName: '版本01',
                paramName: '',
                paramValue: {},
                versionFlowVal: 0,

                addParamList: [],
                name: '',
                age: 26
            },
            valuesList: [],
            contrastVersion: '原始公用版本',
            contrastVar: 'name/john;age/27',
            versionName: '版本01',
            paramName: '',
            input: '50%',
            msg: 'Lorem ipsum dolor sit amet.',
            rules: {
                originVersion: [
                    { required: false, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                originParams: [
                    { required: false, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                originFlow: [
                    { required: false, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                versionName: [
                    { required: false, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                paramName: [
                    { required: false, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                paramValue: [
                    { required: false, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
                // region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
                // date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
                // date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
                // type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
                // resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
                // desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
            }
        };
    },
    props: {
        paramKeyList: {
            type: Array,
            require: true
        },
        paramObj: {
            type: Object,
            require: true
        },
        originVersion: {
            type: Object,
            required: true
        },
        remainProportion: {
            type: Number,
            required: true,
            default: 0
        }
    },
    computed: {
        diffProportion() {
            return this.remainProportion - this.form.versionFlowVal;
        },
        getOriginVersionName: function() {
            return this.originVersion.name || this.form.originVersion;
        },
        getOriginVersionParams: function() {
            if (JSON.stringify(this.originVersion) === '{}') {
                return '无可用参数';
            }

            let str = '';
            for (const key in this.originVersion) {
                if (key !== 'gradStrategyId') {
                    str = key + ':' + this.originVersion[key] + ';';
                }
            }

            return str;
        }
    },
    created() {
        this.form.addParamList.push({
            value: '',
            key: ''
        });
    },
    methods: {
        onAddValueChange(paramObj, item) {
            item.paramObj = paramObj;
        },
        onParamChange(param) {
            this.valuesList = this.paramObj[param.key].values;
            param.value = this.paramObj[param.key].values[0].value;
            param.paramObj = this.paramObj[param.key].values[0];
            // console.log(this.valuesList);
        },
        formValidate() {
            this.$refs['form'].validate(valid => {
                console.log(valid);
                if (valid) {
                    console.log('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleParamValueInputFocus(event, param) {
            console.log('param', param);
            if (param.key) {
                this.valuesList = this.paramObj[param.key].values;
            }
            // this.versionFlowVal = '' + this.versionFlowVal.split('%')[0];
        },
        addParam() {
            this.form.addParamList.push({
                value: '',
                key: ''
            });
        }
    },
    watch: {
        form: {
            handler: function() {
                let options = {};
                options.originVersion = this.form.originVersion;
                options.originParams = this.form.originParams;
                options.originFlow = this.form.originFlow;

                options.versionName = this.form.versionName;
                options.paramName = this.form.paramName;
                // options.paramValue = this.form.paramValue;
                options.paramValue = this.paramValue;
                options.versionFlowVal = this.form.versionFlowVal;

                options.addParamList = this.form.addParamList;

                console.log('changed');
                this.$emit('confirm', options);
            },
            deep: true
        }
    }
};
</script>

<style lang="scss" scoped>
.version .label-row {
    margin-bottom: 0;
}

.version-wrap {
    display: flex;
}

.version-name,
.version-param,
.version-flow {
    display: flex;
    align-self: flex-start;
}

.version-param {
    flex-direction: column;
}

.param-row {
    padding-left: 156px;
}

.version .flow {
    width: 68px;
}

.originversion-wrap {
    display: inline-flex;

    /deep/ .el-form-item__label {
        width: 156px;
        padding-right: 20px;
    }

    .origin-name {
        width: 168px;
        margin-right: 10px;
    }
}

.originvar-wrap {
    .origin-params {
        width: 346px;
        margin-right: 10px;
    }
}

.originflow-wrap {
    .origin-flow {
        width: 68px;
        margin-right: 10px;
    }
}

.el-popover.el-popper .el-radio-group,
.el-popover.el-popper .el-radio {
    // border: 1px solid red !important;
    padding: 3px 0;
    display: block;
}

/deep/ .el-radio-button,
/deep/ .el-radio-group,
/deep/ .el-radio-button__inner {
    display: block;
    border: none;
    width: 100%;
    box-shadow: none;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
    border-left: none;
}

/deep/ .el-radio-button__inner {
    padding: 5px 0;
    padding-left: 10px;
    text-align: left;
}

/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #249ded;
    background: #f5f7fa;
    border-color: #409eff;
}

/deep/ .el-form-item__content .el-input-group {
    vertical-align: middle;
}

/deep/ .el-input-group__append {
    padding: 0 5px;
}

.originflow-wrap /deep/ .el-input__inner,
.version-flow /deep/ .el-input__inner {
    border-right: 0;
    padding-left: 11px;
    padding-right: 0px;
}
</style>
