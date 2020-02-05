<template>
    <el-form ref="form" :model="form" class="version">
        <div class="version" v-for="(version, index) in versionOptions" :key="index">
            <el-row class="label-row param-row">
                <section class="version-name">
                    <el-form-item :label="index == 0 ? '实验配置' : ' '">
                        <el-input placeholder="请输入内容" v-model="version.name" class="version"></el-input>
                    </el-form-item>
                </section>

                <!-- 新增参数 -->
                <section class="version-param">
                    <el-row class="label-row param-more" v-for="(param, index) in version.paramsList" :key="index">
                        <el-form-item prop="paramName">
                            <el-select
                                v-model="param.key"
                                placeholder="请选择参数名称"
                                class="param-name"
                                @change="onParamChange(param, index)"
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
                                    v-for="item in param.valuesList"
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
                                ></el-input>
                            </el-popover>
                        </el-form-item>
                    </el-row>
                </section>

                <section class="version-flow">
                    <el-form-item class="flow">
                        <el-popover placement="bottom" width="400" trigger="click">
                            剩余流量：{{ remainProportion }}%
                            <el-slider
                                v-model="version.flowVal"
                                show-input
                                :min="0"
                                :max="remainProportion"
                            ></el-slider>
                            <el-input slot="reference" placeholder v-model="version.flowVal">
                                <template slot="append">%</template>
                            </el-input>
                        </el-popover>
                    </el-form-item>
                </section>

                <section class="version-check">
                    <el-form-item>
                        <el-checkbox
                            v-model="version.compareVersion"
                            label="原始版本"
                            border
                            class="no-border"
                        ></el-checkbox>
                    </el-form-item>
                </section>
            </el-row>

            <el-row class="label-row addparam-row">
                <el-form-item>
                    <el-button size="medium" @click="addParam(index)">
                        <i class="el-icon-circle-plus-outline"></i>新增参数</el-button
                    >
                </el-form-item>
            </el-row>
        </div>
        <el-row>
            <el-button @click="addVersion" class="btn-addversion" type="primary">新增版本</el-button>
        </el-row>
    </el-form>
</template>

<script>
export default {
    name: 'header',
    data() {
        return {
            versionOptions: [],
            form: {},
            rules: {}
        };
    },
    props: {
        versionType: {
            type: Number,
            default: 1
        },
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
    created() {
        this.addVersion(this.versionType);
    },
    methods: {
        handleSliderChange(val) {
            console.log(val);
        },

        onParamChange(param, index) {
            param.valuesList = this.paramObj[param.key].values;
            param.value = this.paramObj[param.key].values[0].value;
            param.paramObj = this.paramObj[param.key].values[0];
        },

        onParamValueChange(paramObj, item) {
            item.paramObj = paramObj;
        },

        addVersion(type = 1) {
            // let numOfVersion = 1
            // if (type === 'ab') {
            //     numOfVersion = 2
            // }

            for (let i = 1; i <= type; i++) {
                let versionName = `版本0${this.versionOptions.length + 1}`;
                this.versionOptions.push({
                    name: versionName,
                    paramsList: [
                        {
                            value: '',
                            key: ''
                        }
                    ],
                    flowVal: 0,
                    compareVersion: false
                });
            }
        },

        addParam(index) {
            this.versionOptions[index].paramsList.push({
                value: '',
                key: ''
            });
        }
    },
    watch: {
        versionOptions: {
            handler: function() {
                console.log('versionOptions', this.versionOptions);
            },
            deep: true
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

.btn-addversion {
    margin-left: 334px;
    width: 168px;
}
</style>
