<template>
    <section>
        <abt-breadcrumb></abt-breadcrumb>
        <abt-steps :active="1"></abt-steps>

        <el-row class="row-content">
            <el-form :model="issueForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <!-- 实验层 -->
                <el-col :span="24" class="explevel">
                    <el-row class="label-row select">
                        <el-form-item label="实验层">
                            <el-select v-model="moduleType" placeholder="请选择" @change="chooseModuleType">
                                <el-option
                                    v-for="item in moduleList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.code"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row class="calc-row">
                        <el-col :span="24">
                            <a href="#">样本量计算器</a>
                        </el-col>
                    </el-row>
                </el-col>

                <!-- 实验配置 -->
                <el-col :span="24" class="exptype">
                    <el-row class="label-row type">
                        <el-form-item label="流量分配方式">
                            <el-select
                                v-model="issueStrategyType"
                                placeholder="请选择"
                                class="flow-type"
                                @change="onIssueStrategyType"
                            >
                                <el-option
                                    v-for="item in issueStrategyTypeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.code"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-show="issueStrategyType == '2'">
                            <el-input
                                placeholder="请输入内容"
                                v-model="remainTrafficProportion"
                                :disabled="true"
                                class="flow"
                            ></el-input>
                        </el-form-item>
                    </el-row>

                    <!-- 标签下发 -->
                    <el-row class="label-row tag" v-show="issueStrategyType === '125'">
                        <el-form-item label="选择标签">
                            <el-cascader
                                :options="tagsList"
                                :props="tagsProps"
                                :show-all-levels="false"
                                v-model="tagTypeList"
                                @change="onTagTypeChanged"
                            ></el-cascader>
                            <!-- <el-select v-model="tagType" placeholder="请选择" class="flow-type">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>

                                <section slot="empty" class="tagslist-empty">
                                    <span class="text">暂无号码包</span><el-link type="primary"> 去添加</el-link>
                                </section>
                            </el-select>-->
                        </el-form-item>
                    </el-row>

                    <!-- 画像下发 -->
                    <el-row class="label-row numpkg" v-show="issueStrategyType === '127'">
                        <el-form-item label="选择画像">
                            <el-select
                                v-model="portraitType"
                                value-key="rule_set_id"
                                placeholder="请选择画像"
                                class="flow-type"
                                @change="onPortraitChanged"
                            >
                                <el-option
                                    v-for="item in portraitsList"
                                    :key="item.rule_set_id"
                                    :label="item.rule_set_name"
                                    :value="item"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>

                    <!-- 号码包下发(FIT 没有号码包) -->

                    <!-- 选择实验模式 -->
                    <el-row class="label-row mode">
                        <el-form-item label="实验模式">
                            <el-radio v-model="expeTypeRadio" label="1" border>公共原始版本实验</el-radio>
                            <el-radio v-model="expeTypeRadio" label="2" border>AB实验</el-radio>
                            <el-radio v-model="expeTypeRadio" label="3" border>AAB实验</el-radio>
                            <el-radio v-model="expeTypeRadio" label="4" border>ABAB实验</el-radio>
                            <el-radio v-model="expeTypeRadio" label="5" border>自定义实验</el-radio>
                        </el-form-item>
                    </el-row>

                    <!-- 加载不同的实验参数模板 -->
                    <section class="config">
                        <origin-version
                            :paramKeyList="paramKeyList"
                            :paramObj="paramObj"
                            :originVersion="originVersion"
                            :remainProportion="remainProportion"
                            v-show="expeTypeRadio == 1"
                            @confirm="onOriginVersionConfirm"
                        ></origin-version>
                        <ab-version
                            v-show="expeTypeRadio == 2"
                            :paramKeyList="paramKeyList"
                            :paramObj="paramObj"
                            :remainProportion="remainProportion"
                        ></ab-version>
                        <aab-version v-show="expeTypeRadio == 3"></aab-version>
                        <abab-version v-show="expeTypeRadio == 4"></abab-version>
                        <custom-version
                            v-show="expeTypeRadio == 5"
                            :versionType="4"
                            :paramKeyList="paramKeyList"
                            :paramObj="paramObj"
                            :remainProportion="remainProportion"
                        ></custom-version>

                        <el-row class="label-row calc-row">
                            <el-col :span="24">
                                <a href="#">版本白名单设置</a>
                            </el-col>
                        </el-row>
                    </section>
                </el-col>

                <!-- 指标 -->
                <el-col :span="24" class="expmeta">
                    <el-row class="label-row time">
                        <el-form-item label="实验时间段">
                            <el-date-picker
                                v-model="expDateRange"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="onExpDateChange"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="emptyDay" placeholder="请选择空跑期">
                                <el-option
                                    v-for="item in emptyDaysList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <section class="tags">
                        <el-row class="label-row polaris">
                            <el-form-item label="实验关注指标">
                                <span class="title">北极星指标</span>
                                <el-tag :key="tag" v-for="tag in polarisIndicatorList" :disable-transitions="false">
                                    {{ tag }}
                                </el-tag>
                            </el-form-item>
                        </el-row>

                        <el-row class="label-row assist">
                            <el-form-item>
                                <span class="title">辅助指标</span>
                                <el-popover placement="bottom-start" width="180" trigger="click">
                                    <el-checkbox-group
                                        v-model="assistIndicatorListChecked"
                                        @change="handleAssistIndicatorChange"
                                        class="add-indicator"
                                    >
                                        <el-checkbox
                                            v-for="indicator in assistIndicatorList"
                                            :label="indicator"
                                            :key="indicator"
                                            >{{ indicator }}</el-checkbox
                                        >
                                    </el-checkbox-group>
                                    <el-button slot="reference" size="small" class="add-indicator-btn"
                                        >+ 添加指标</el-button
                                    >
                                </el-popover>
                                <el-tag
                                    :key="tag"
                                    v-for="tag in assistIndicatorListChecked"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleCloseAssistIndicator(tag)"
                                    >{{ tag }}</el-tag
                                >
                            </el-form-item>
                        </el-row>

                        <el-row class="label-row observe">
                            <el-form-item label>
                                <span class="title">观察指标</span>
                                <el-popover placement="bottom-start" width="180" trigger="click">
                                    <el-checkbox-group
                                        v-model="observeIndicatorListChecked"
                                        @change="handleObserveIndicatorChange"
                                        class="add-indicator"
                                    >
                                        <el-checkbox
                                            v-for="indicator in observeIndicatorList"
                                            :label="indicator"
                                            :key="indicator"
                                            >{{ indicator }}</el-checkbox
                                        >
                                    </el-checkbox-group>
                                    <el-button slot="reference" size="small" class="add-indicator-btn"
                                        >+ 添加指标</el-button
                                    >
                                </el-popover>
                                <el-tag
                                    :key="tag"
                                    v-for="tag in observeIndicatorListChecked"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleCloseObserveIndicator(tag)"
                                    >{{ tag }}</el-tag
                                >
                            </el-form-item>
                        </el-row>
                    </section>
                </el-col>

                <!-- action bar -->
                <el-col :span="24" class="expaction">
                    <el-row class="label-row">
                        <el-button type="primary" @click="preStep">上一步</el-button>
                        <el-button @click="saveExperiment">下一步</el-button>
                    </el-row>
                </el-col>
            </el-form>
        </el-row>
    </section>
</template>

<script>
import API from './api';
import OriginVersion from './components/OriginVersion.vue';
import AbVersion from './components/AbVersion.vue';
import AabVersion from './components/AabVersion.vue';
import AbabVersion from './components/AbabVersion.vue';
import CustomVersion from './components/CustomVersion.vue';
import AbtBreadcrumb from './components/Breadcrumb.vue';
import AbtSteps from './components/Steps.vue';
import { mapState } from 'vuex';

function hasDuplicates(a) {
    return _.uniq(a).length !== a.length;
}

export default {
    data() {
        return {
            formChecked: true,
            originVersion: {},
            checkedCities: [],
            cities: ['上海', '北京', '广州', '深圳'],
            expDateRange: '',
            remainTrafficProportion: 0,
            remainProportion: 0,
            moduleType: '',
            expeTypeRadio: '1',
            moduleList: [],
            issueStrategyTypeList: [],
            issueStrategyType: '',
            paramList: [],
            paramKeyList: [],
            paramObj: {},
            portraitType: '', // 选择的画像
            portraitsList: [], // 画像列表
            numPackage: [], // 号码包列表
            tagTypeList: '', // 选择的标签
            tagsList: [], // 标签列表
            tagsProps: { multiple: true },
            tagsOptions: [],
            props: { multiple: true },
            cascaderValue: [],
            msg: 'create experiment',
            input: '30%',
            radio1: '1',
            emptyDaysList: [
                {
                    value: '0',
                    label: '不需要空跑期'
                }
            ],
            emptyDay: '0',
            startTime: '',
            endTime: '',
            value: '',
            versionConfig: {},
            indicatorList: [],
            polarisIndicatorList: [],
            assistIndicatorList: [],
            assistIndicatorListChecked: [],
            observeIndicatorListChecked: [],
            observeIndicatorList: [] // '模拟指标1', '模拟指标2', '模拟指标3', '模拟指标4', '模拟指标5'
        };
    },
    computed: {
        ...mapState({
            stepOneData: state => state.createExp.createExpData, // 获取step_1表单中的信息
            remainFlowValue: state => state.remainFlowValue
        })
    },
    components: {
        OriginVersion,
        AbVersion,
        AabVersion,
        AbabVersion,
        CustomVersion,
        AbtBreadcrumb,
        AbtSteps
    },
    async created() {
        const editData = await API.loadGrayExperimentDatas({ fexpId: 19 });
        console.log('编辑实验数据', editData);

        API.getCommonConfigDatas().then(res => {
            // 实验层列表
            this.moduleList = res.moduleList;

            // 流量下发类型列表
            this.issueStrategyTypeList = res.issueStrategyTypeList;

            console.log('getCommonConfigDatas', res);
        });

        // 实验关注指标，indicator_type字段：（1：北极星指标，2：辅助指标，3：观测指标）
        const indicatorList = await API.loadExperimentIndicatorDatas();
        this.indicatorList = indicatorList.data.indicator_list;
        indicatorList.data.indicator_list.map(item => {
            if (item.findicator_type === '1') {
                this.polarisIndicatorList.push(item.findicator_name);
            }

            if (item.findicator_type === '2') {
                this.assistIndicatorList.push(item.findicator_name);
            }

            if (item.findicator_type === '3') {
                this.observeIndicatorList.push(item.findicator_name);
            }
        });
        console.log('indicatorList', indicatorList);

        // 获取标签下发
        const tagsList = await API.getIssueTag();
        this.tagsList = tagsList;
        tagsList.map(item => {
            item.label = item.name;
            item.value = item.id + '/' + item.bp_id + '_' + item.name;

            item.children.map(child => {
                child.label = child.name;
                child.value = child.id + '/' + child.bp_id + '_' + child.name;
            });
        });
        console.log('tagsList', tagsList);

        // 获取画像下发
        const portraitsList = await API.getIssuePortrait();
        this.portraitsList = portraitsList.data;
        console.log('portraitsList', portraitsList);
    },
    methods: {
        // 根据画像查可用流量
        async onPortraitChanged(item) {
            if (this.issueStrategyType === '127' && this.portraitType) {
                const res = await API.getTrafficRemainProportion({
                    moduleCode: this.moduleType,
                    issueList: [
                        {
                            typetips: [
                                {
                                    ...item
                                }
                            ],
                            type: this.issueStrategyType
                        }
                    ]
                });

                this.remainProportion = res.remain_traffic_proportion;
                return;
            }

            this.remainProportion = 0;
        },

        // 根据标签查可用流量
        async onTagTypeChanged(val) {
            console.log('onTagTypeChanged', val);
            if (this.issueStrategyType === '125' && this.tagTypeList.length > 0) {
                const typetips = [];
                this.tagTypeList.map(item => {
                    // {tag_id: "27", name: "gz_杭州"}
                    let tip = {};
                    tip.tag_id = item[1].split('/')[0];
                    tip.name = item[1].split('/')[1];
                    typetips.push(tip);
                });

                const res = await API.getTrafficRemainProportion({
                    moduleCode: this.moduleType,
                    issueList: [
                        {
                            typetips: [...typetips],
                            type: this.issueStrategyType
                        }
                    ]
                });

                this.remainProportion = res.remain_traffic_proportion;
                return;
            }

            this.remainProportion = 0;
        },

        // 根据流量下发查可用流量
        async onIssueStrategyType() {
            // 2 比例下发，125 号码包下发，127 画像下发
            if (this.issueStrategyType === '2') {
                const res = await API.getTrafficRemainProportion({
                    moduleCode: this.moduleType, // 模块 code
                    issueList: [
                        {
                            type: this.issueStrategyType // 下发方式code
                        }
                    ]
                });

                this.remainProportion = res.remain_traffic_proportion;
                this.$store.dispatch('setRemainFlowValue', res.remain_traffic_proportion);
                return;
            }

            this.remainProportion = 0;
        },
        // 处理实验日期
        onExpDateChange(val) {
            let days = val || [];

            this.emptyDaysList = [
                {
                    value: '0',
                    label: '不需要空跑期'
                }
            ];

            if (days.length <= 0) {
                this.emptyDay = '0';
                return;
            }

            const a = this.$moment(val[0]);
            const b = this.$moment(val[1]);
            let diffDay = b.diff(a, 'days');

            for (let i = 1; i <= diffDay; i++) {
                this.emptyDaysList.push({
                    value: i + '',
                    label: i + '天'
                });
            }

            this.startTime = this.$moment(a).format('YYYY-MM-DD HH:mm:ss');
            this.endTime = this.$moment(b).format('YYYY-MM-DD HH:mm:ss');
        },

        async chooseModuleType(val) {
            const configDatas = await API.getNewModuleConfigDatas({ moduleCode: val });

            // this.paramList = configDatas.paramList;
            // 实验参数/变量列表（转换数据）
            //  [{"paramCode" : "bg_color", "values" : ["object", "object"]}, {"paramCode" : "font_size", "values" : ["object", "object"]}]
            configDatas.paramList.map(item => {
                if (this.paramObj[item.paramCode]) {
                    this.paramObj[item.paramCode].values.push(item);
                } else {
                    this.paramObj[item.paramCode] = {};
                    this.paramObj[item.paramCode].values = [];
                }
            });

            for (let key in this.paramObj) {
                if (key) {
                    this.paramKeyList.push(key);
                }
            }

            console.log(this.paramKeyList);
            console.log(this.paramObj);

            // 剩余可用流量
            this.remainTrafficProportion = configDatas.remain_traffic_proportion;

            // 查公共原始版本
            const originVersion = await API.newComGrayStrategy({ moduleCode: val });
            this.originVersion = originVersion.data;
        },
        handleCloseAssistIndicator(tag) {
            this.assistIndicatorListChecked.splice(this.assistIndicatorListChecked.indexOf(tag), 1);
            this.assistIndicatorListChecked = this.assistIndicatorListChecked.splice(
                this.assistIndicatorListChecked.indexOf(tag),
                1
            );

            console.log('辅助指标', this.assistIndicatorListChecked);
        },
        handleCloseObserveIndicator(tag) {
            this.observeIndicatorListChecked.splice(this.observeIndicatorListChecked.indexOf(tag), 1);
            this.observeIndicatorListChecked = this.observeIndicatorListChecked.splice(
                this.observeIndicatorListChecked.indexOf(tag),
                1
            );

            console.log('观察指标', this.observeIndicatorListChecked);
        },
        handleAssistIndicatorChange(val) {
            console.log(this.assistIndicatorListChecked);
        },
        handleObserveIndicatorChange(val) {
            console.log(this.observeIndicatorListChecked);
        },
        onOriginVersionConfirm(option) {
            console.log(option);
            this.versionConfig = option;
        },
        async saveExperiment() {
            const data = {
                // 编辑时必填
                fid: '',
                // 实验名
                fexp_name: this.stepOneData.name,
                // 实验创建者
                follower: this.stepOneData.charger,
                // 实验类别（program：后台实验； web：web实验；ui：UI实验；lpo：LPO实验；alg：算法实验），必填'
                fexp_type: this.stepOneData.type,
                // '实验备注',
                fcomment: this.stepOneData.purpose,
                // '实验层code，必填'
                fmodule_code: this.moduleType,
                // 下发方式（2：按比例下发；125：按标签下发；126：按用户包下发；127：按画像规则下发），必填
                fissue_type: this.issueStrategyType,
                // 流量比例，数字，如30%，那么传30即可，必填（version_list 里面的version_percent加总）
                fpercent: '1',
                // 实验模式（1:公共对照组 2:公共对照组与B 3:AB 4:AAB 5:ABAB 6:自定义实验），必填
                fcontrol_type: this.expeTypeRadio,
                // 实验开始时间，格式：yyyy-MM-dd HH:mm:ss，必填
                fstart_time: this.startTime,
                // 实验结束时间，格式：yyyy-MM-dd HH:mm:ss，必填
                fend_time: this.endTime,
                // 空跑期天数，不需要空跑期时传 0
                fempty_days: this.emptyDay,
                // 指标列表
                indicator_list: [],
                // 版本列表
                version_list: []
            };

            data.indicator_list = this.getIndicators();
            data.version_list = this.getVersionList();

            console.log('版本创建上送参数', data);
            if (!this.formChecked) {
                return;
            }
            const res = await API.saveGrayExperiment(data);
            console.log('版本创建结果', res);

            if (res.status === 'success') {
                this.$router.push({
                    path: '/experiment/create/step4',
                    query: {
                        id: res.data.fexp_id,
                        login: res.data.log_id
                    }
                });
            }
        },
        preStep() {
            this.$router.push('/experiment/create');
        },
        getIndicators() {
            const indicators = [];
            this.indicatorList.map(item => {
                if (item.findicator_type === '1') {
                    indicators.push(item);
                }
            });

            this.assistIndicatorListChecked.map(item => {
                this.indicatorList.map(indicator => {
                    if (item === indicator.findicator_name && indicator.findicator_type === '2') {
                        indicators.push(indicator);
                    }
                });
            });

            this.observeIndicatorListChecked.map(item => {
                this.indicatorList.map(indicator => {
                    if (item === indicator.findicator_name && indicator.findicator_type === '3') {
                        indicators.push(indicator);
                    }
                });
            });

            return indicators;
        },

        // 获取下发类型
        getIssue() {
            const issueType = {};

            // 2 比例下发，125 号码包下发，127 画像下发
            if (this.issueStrategyType === '2') {
                // 选择比例下发时固定值：2
                issueType.type = '2';
                //（编辑时候需要传，后端会返回）主键id
                issueType.id = '';
                // 匹配方式，按比例时固定：in
                issueType.operator = 'in';
                //（编辑时候需要传，后端会返回）桶id列表，用;分割
                issueType.compare_value = '';
                // 选择的流量比例
                issueType.serial_number = this.versionConfig.versionFlowVal;
            }

            return issueType;
        },

        // 获取原始公共版本信息
        getVersionList() {
            const versionList = [];
            const version = {
                // 版本主键id，编辑时必填
                id: '',
                // 版本名称，必填
                name: '',
                // 该版本占用流量'
                version_percent: '',
                // 是否是原始版本（1：是；0：否）
                is_original: '',
                // 当实验模式是1原始公共公共对照组时，必填，填入公共对照组版本的id
                control_id: '',
                // 参数列表
                params: [],
                // 下发方式
                issue_list: []
            };

            // 原始公共版本
            if (this.expeTypeRadio === '1') {
                version.id = '';
                version.name = this.versionConfig.versionName;
                version.version_percent = this.versionConfig.versionFlowVal;
                version.is_original = '0';
                version.control_id = this.originVersion.gradStrategyId;

                // 版本参数
                if (this.versionConfig.addParamList.length > 0) {
                    this.versionConfig.addParamList.map(item => {
                        if (!_.has(item, 'paramObj')) {
                            return;
                        }

                        version.params.push({
                            // id: this.versionConfig.paramName.key_id, // 编辑时候用到
                            key_id: item.paramObj.id,
                            param_key: item.key,
                            param_value: item.value
                        });
                    });
                }
                console.log(this.versionConfig.addParamList);
                const paramList = _.map(this.versionConfig.addParamList, 'key');

                if (hasDuplicates(paramList)) {
                    this.formChecked = false;
                    this.$message.error('你选择了相同的实验参数，请查验！');
                    return;
                }
                this.formChecked = true;

                // 版本下发方式
                version.issue_list.push(this.getIssue());
            }
            versionList.push(version);
            console.log('版本列表', versionList);

            return versionList;
        }
    }
};
</script>

<style lang="scss">
@import '../../../assets/scss/variables';

.row-abt {
    padding: 0 24px;
}

.label-row {
    display: flex;
    align-items: center;

    .label {
        text-align: right;
        padding-right: 20px;
    }
}

.explevel {
    padding-top: 20px;
    padding-bottom: 25px;
    border-bottom: 1px solid $borderColor;
    margin-bottom: 22px;

    .select {
        display: flex;
        align-items: center;
    }

    .select .el-form-item {
        display: inline-flex;

        .el-form-item__label {
            width: 156px;
            padding-right: 20px;
        }
    }

    .select .label {
        text-align: right;
        padding-right: 20px;
    }

    .select .el-select {
        width: 524px;
    }

    .calc-row {
        text-align: right;
        padding-right: 20px;
        margin-top: 10px;
    }

    .calc-row a {
        color: $mainColor;
    }
}

.exptype {
    border-bottom: 1px solid $borderColor;
    padding-bottom: 24px;

    .el-cascader {
        width: 524px;
    }

    .label-row {
        display: flex;
    }

    .el-form-item {
        display: inline-flex;

        .el-form-item__label {
            width: 156px;
            padding-right: 20px;
        }
    }

    .flow-type {
        width: 524px;
        margin-right: 10px;
        margin-left: 0;
    }
}

.exptype .type .el-input.flow {
    width: 68px;
}

.exptype .mode {
    .el-radio {
        margin-right: 10px;
        margin-left: 0px;
    }

    .el-radio.is-bordered + .el-radio.is-bordered {
        margin-left: 0;
    }
}

.version .value {
    display: inline-flex;

    .contrastVersion {
        margin-right: 10px;
        width: 168px;
    }

    .contrastVar {
        margin-right: 10px;
        width: 346px;
    }

    .contrastRe {
        margin-right: 10px;
        width: 68px;
    }
}

.version .param-row {
    .version,
    .param-name,
    .param-value {
        width: 168px;
        margin-right: 10px;
    }
}

.version .param-row.param-more {
    .el-select {
        margin-left: 178px;
    }
}

.calc-row {
    text-align: right;
    padding-right: 20px;
    // margin-top: 10px;
}

.calc-row a {
    color: $mainColor;
}

.expmeta {
    border-bottom: 1px solid $borderColor;

    .el-form-item {
        display: inline-flex;

        .el-form-item__label {
            width: 156px;
            padding-right: 20px;
        }
    }

    .add-indicator-btn {
        margin-right: 10px;
    }
}

.expmeta .time {
    display: inline-flex;
    margin-top: 24px;

    .el-form-item {
        display: inline-flex;

        .el-form-item__label {
            width: 156px;
            padding-right: 20px;
        }
    }

    .el-date-editor {
        // width: 385px;
        margin-right: 10px;
    }
}

.expmeta .tags {
    margin-bottom: 24px;

    .label-row {
        margin-bottom: 10px;
    }

    .title {
        display: inline-block;
        width: 90px;
    }

    .el-form-item {
        margin-bottom: 0;
    }

    .el-tag {
        margin-right: 10px;
    }
}

.expmeta .assist,
.expmeta .observe {
    margin-left: 156px;
}

.expaction {
    margin-top: 24px;
    padding-bottom: 56px;
    padding-left: 156px;
}

.add-indicator {
    .el-checkbox {
        display: flex;
        align-items: center;
        padding: 5px;
    }
}

.addparam-row {
    padding-left: 334px;

    /deep/ .el-form-item {
        margin-bottom: 0;
    }

    /deep/ .el-button {
        width: 168px;

        i {
            margin-right: 3px;
        }
    }
}

.tagslist-empty {
    height: 190px;
    display: flex;
    justify-content: center;
    align-items: center;

    .text {
        color: #c0c4cc;
        margin-right: 5px;
    }
}

//
</style>
