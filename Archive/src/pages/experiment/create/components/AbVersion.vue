<template>
    <el-form ref="form" :model="form" class="version">
        <div class="version">
            <el-row class="label-row param-row">
                <section class="version-name">
                    <el-form-item label="实验配置">
                        <el-input placeholder="请输入内容" v-model="form.versionAName" class="version"></el-input>
                    </el-form-item>
                </section>

                <!-- 新增参数 -->
                <section class="version-param">
                    <el-row class="label-row param-more" v-for="(param, index) in form.versionAParamsList" :key="index">
                        <el-form-item prop="paramName">
                            <el-select
                                v-model="param.key"
                                placeholder="请选择参数名称"
                                class="param-name"
                                @change="onParamChange(param)"
                            >
                                <el-option
                                    v-for="item in paramKeyList"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item prop="paramValue">
                            <el-popover placement="bottom-start" width="168" trigger="click">
                                <el-radio-group
                                    v-model="param.value"
                                    v-for="item in valuesListA"
                                    :key="item.id"
                                    value-key="item"
                                    @change="onParamValueChange(item, param)"
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
                                    @blur="handleFlowInputBlur"
                                    @focus="handleParamValueInputFocus(event, param, 'a')"
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
                                v-model="form.versionAFlowVal"
                                show-input
                                :min="0"
                                :max="diffProportion"
                                @change="handleFlowChange"
                            ></el-slider>
                            <el-input
                                slot="reference"
                                placeholder
                                v-model="form.versionAFlowVal"
                                @blur="handleFlowInputBlur"
                                @focus="handleFlowInputFocus"
                            >
                                <template slot="append">%</template>
                            </el-input>
                        </el-popover>
                    </el-form-item>
                </section>
                <section class="version-check">
                    <el-form-item>
                        <el-checkbox v-model="versionAcheck" label="原始版本" border class="no-border"></el-checkbox>
                    </el-form-item>
                </section>
            </el-row>

            <el-row class="label-row addparam-row">
                <el-form-item>
                    <el-button size="medium" @click="addParam('a')">
                        <i class="el-icon-circle-plus-outline"></i>新增参数
                    </el-button>
                </el-form-item>
            </el-row>
        </div>

        <div class="version">
            <el-row class="label-row param-row version-row">
                <section class="version-name">
                    <el-form-item>
                        <el-input placeholder="请输入内容" v-model="form.versionBName" class="version"></el-input>
                    </el-form-item>
                </section>

                <!-- 新增参数 -->
                <section class="version-param">
                    <el-row class="label-row param-more" v-for="(param, index) in form.versionBParamsList" :key="index">
                        <el-form-item prop="paramName">
                            <el-select
                                v-model="param.key"
                                placeholder="请选择参数名称"
                                class="param-name"
                                @change="onParamChange(param)"
                            >
                                <el-option
                                    v-for="item in paramKeyList"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item prop="paramValue">
                            <el-popover placement="bottom-start" width="168" trigger="click">
                                <el-radio-group
                                    v-model="param.value"
                                    v-for="item in valuesListB"
                                    :key="item.id"
                                    value-key="item"
                                    @change="onParamValueChange(item, param)"
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
                                    @blur="handleFlowInputBlur"
                                    @focus="handleParamValueInputFocus(event, param, 'b')"
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
                                v-model="form.versionBFlowVal"
                                show-input
                                :min="0"
                                :max="diffProportion"
                            ></el-slider>
                            <el-input
                                slot="reference"
                                placeholder
                                v-model="form.versionBFlowVal"
                                @blur="handleFlowInputBlur"
                                @focus="handleFlowInputFocus"
                            >
                                <template slot="append">%</template>
                            </el-input>
                        </el-popover>
                    </el-form-item>
                </section>

                <section class="version-check">
                    <el-form-item>
                        <el-checkbox v-model="versionBcheck" label="原始版本" border class="no-border"></el-checkbox>
                    </el-form-item>
                </section>
            </el-row>

            <el-row class="label-row addparam-row no-mbt">
                <el-form-item>
                    <el-button size="medium" @click="addParam('b')">
                        <i class="el-icon-circle-plus-outline"></i>新增参数
                    </el-button>
                </el-form-item>
            </el-row>
        </div>
    </el-form>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'header',
    data() {
        return {
            form: {
                paramName: '',
                paramValue: {},
                versionAParamsList: [],
                versionBParamsList: [],
                versionAName: '版本01',
                versionBName: '版本02',

                versionAFlowVal: 0,
                versionBFlowVal: 0
            },
            valuesListA: [],
            valuesListB: [],
            versionAcheck: true,
            versionBcheck: false,
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
        remainProportion: {
            type: Number,
            required: true,
            default: 0
        }
    },
    computed: {
        ...mapState({
            remainFlowValue: state => state.createExp.remainFlowValue
        }),
        diffProportion() {
            return this.remainProportion - this.form.versionAFlowVal - this.form.versionBFlowVal;
        }
    },
    created() {
        this.form.versionAParamsList.push({
            value: '',
            key: ''
        });

        this.form.versionBParamsList.push({
            value: '',
            key: ''
        });
    },
    methods: {
        handleFlowChange() {
            this.$store.dispatch('setRemainFlowValue', 100);
            this.$store.dispatch('setRemainFlowValue', this.remainFlowValue - this.form.versionAFlowVal);
        },
        handleParamValueInputFocus(event, param, type) {
            if (param.key) {
                if (type === 'a') {
                    this.valuesListA = this.paramObj[param.key].values;
                }
                if (type === 'b') {
                    this.valuesListB = this.paramObj[param.key].values;
                }
            }
        },
        onParamValueChange(paramObj, item) {
            item.paramObj = paramObj;
        },
        onParamChange(param) {
            this.valuesListA = this.paramObj[param.key].values;
            param.value = this.paramObj[param.key].values[0].value;
            param.paramObj = this.paramObj[param.key].values[0];
        },
        addParam(type) {
            if (type === 'a') {
                this.form.versionAParamsList.push({
                    value: '',
                    key: ''
                });
            }

            if (type === 'b') {
                this.form.versionBParamsList.push({
                    value: '',
                    key: ''
                });
            }
        }
    },
    watch: {
        versionAcheck: {
            handler: function(val) {
                if (val) {
                    this.versionBcheck = false;
                } else {
                    this.versionBcheck = true;
                }
            }
        },
        versionBcheck: {
            handler: function(val) {
                if (val) {
                    this.versionAcheck = false;
                } else {
                    this.versionAcheck = true;
                }
            }
        },
        // 'form.versionAFlowVal': function(val) {
        //     console.log(val);
        //     this.getProportion = this.remainProportion - this.form.versionAFlowVal - this.form.versionBFlowVal;
        //     this.versionBFlowVal = this.remainProportion - this.form.versionAParamsList;
        // },
        form: {
            handler: function() {
                let options = {};

                // options.versionName = this.form.versionName;
                // options.paramName = this.form.paramName;
                // // options.paramValue = this.form.paramValue;
                // options.paramValue = this.paramValue;
                // options.versionFlowVal = this.form.versionFlowVal;

                // options.addParamList = this.form.addParamList;
                this.$emit('confirm', options);

                console.log('form data', this.form);
            },
            deep: true
        }
    }
};
</script>

<style lang="scss" scoped>
.no-mbt {
    margin-bottom: 0 !important;
}

.version .flow {
    width: 68px;
}

.version-check,
.version-name,
.version-param,
.version-flow {
    display: flex;
    align-self: flex-start;
}

.version-param {
    flex-direction: column;
}

.version-row {
    margin-left: 156px;
}

.more .param-row.param-more {
    padding-left: 156px;
}

.version .el-checkbox.no-border {
    border: none;
}

.addparam-row {
    margin-bottom: 22px;
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

.version-flow /deep/ .el-input__inner {
    border-right: 0;
    padding-left: 11px;
    padding-right: 0px;
}
</style>
