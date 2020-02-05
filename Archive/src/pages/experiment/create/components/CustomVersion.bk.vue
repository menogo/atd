<template>
    <el-form ref="form" :model="form" class="version">
        <div class="version">
            <el-row class="label-row param-row">
                <section class="version-name">
                    <el-form-item label="实验配置">
                        <el-input placeholder="请输入内容" v-model="bVersion" class="version"></el-input>
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
                                    @blur="handleFlowInputBlur"
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
                                @blur="handleFlowInputBlur"
                                @focus="handleFlowInputFocus"
                            >
                                <template slot="append">%</template>
                            </el-input>
                        </el-popover>
                    </el-form-item>
                </section>

                <el-form-item>
                    <el-checkbox v-model="checked" label="原始版本" border class="no-border"></el-checkbox>
                </el-form-item>
            </el-row>

            <el-row class="label-row addparam-row">
                <el-form-item>
                    <el-button size="medium"> <i class="el-icon-circle-plus-outline"></i>新增参数 </el-button>
                </el-form-item>
            </el-row>
        </div>

        <div class="version">
            <el-row class="label-row param-row version-row">
                <section class="version-name">
                    <el-form-item>
                        <el-input placeholder="请输入内容" v-model="bVersion" class="version"></el-input>
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
                                    @blur="handleFlowInputBlur"
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
                                @blur="handleFlowInputBlur"
                                @focus="handleFlowInputFocus"
                            >
                                <template slot="append">%</template>
                            </el-input>
                        </el-popover>
                    </el-form-item>
                </section>

                <el-form-item>
                    <el-checkbox v-model="checked" label="原始版本" border class="no-border"></el-checkbox>
                </el-form-item>
            </el-row>

            <el-row class="label-row addparam-row">
                <el-form-item>
                    <el-button size="medium"> <i class="el-icon-circle-plus-outline"></i>新增参数 </el-button>
                </el-form-item>
            </el-row>
        </div>

        <div class="version">
            <el-row class="label-row param-row version-row">
                <section class="version-name">
                    <el-form-item>
                        <el-input placeholder="请输入内容" v-model="bVersion" class="version"></el-input>
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
                                    @blur="handleFlowInputBlur"
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
                                @blur="handleFlowInputBlur"
                                @focus="handleFlowInputFocus"
                            >
                                <template slot="append">%</template>
                            </el-input>
                        </el-popover>
                    </el-form-item>
                </section>

                <el-form-item>
                    <el-checkbox v-model="checked" label="原始版本" border class="no-border"></el-checkbox>
                </el-form-item>
            </el-row>

            <el-row class="label-row addparam-row">
                <el-form-item>
                    <el-button size="medium"> <i class="el-icon-circle-plus-outline"></i>新增参数 </el-button>
                </el-form-item>
            </el-row>
        </div>

        <div class="version">
            <el-row class="label-row param-row version-row">
                <section class="version-name">
                    <el-form-item>
                        <el-input placeholder="请输入内容" v-model="bVersion" class="version"></el-input>
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
                                    @blur="handleFlowInputBlur"
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
                                @blur="handleFlowInputBlur"
                                @focus="handleFlowInputFocus"
                            >
                                <template slot="append">%</template>
                            </el-input>
                        </el-popover>
                    </el-form-item>
                </section>

                <el-form-item>
                    <el-checkbox v-model="checked" label="原始版本" border class="no-border"></el-checkbox>
                </el-form-item>
            </el-row>

            <el-row class="label-row addparam-row no-mbt">
                <el-form-item>
                    <el-button size="medium"> <i class="el-icon-circle-plus-outline"></i>新增参数 </el-button>
                </el-form-item>
            </el-row>
        </div>
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
    created() {
        this.form.addParamList.push({
            value: '',
            key: ''
        });
    },
    methods: {
        handleSliderChange(val) {
            console.log(val);
        }
    }
};
</script>

<style lang="scss" scoped>
.version .flow {
    width: 68px;
}

.version-wrap {
    display: flex;
}

.version .el-checkbox.no-border {
    border: none;
}

.no-mbt {
    margin-bottom: 0 !important;
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

/deep/.el-form-item__content .el-input-group {
    vertical-align: middle;
}

.version-flow /deep/ .el-input-group__append {
    padding: 0 5px;
}

.version-flow /deep/ .el-input__inner {
    border-right: 0;
    padding-left: 11px;
    padding-right: 0px;
}
</style>
