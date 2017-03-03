<template>
    <section class="customer-management">
        <div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">首页大图管理</h1></div>
        <div class="wrapper-md" v-loading="loading">
            <el-form :model="form" ref="form" label-width="160px">
                <el-card class="box-card" v-for="(item, index) in form.items">
                    <div slot="header" class="clearfix">
                        <span style="font-weight: bold;">位置{{index + 1}}</span>
                    </div>
                    <div>
                        <el-form-item label="标题" :prop="'items.' + index + '.title.ch'" :rules="{required: true, trigger: 'blur'}">
                            <el-input v-model="item.title.ch" auto-complete="off" placeholder="例：标题（中文）"></el-input>
                        </el-form-item>
                        <el-form-item label="Title" :prop="'items.' + index + '.title.en'" :rules="{required: true, trigger: 'blur'}">
                            <el-input v-model="item.title.en" auto-complete="off" placeholder="例：Title（English）"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" :prop="'items.' + index + '.description.ch'" :rules="{required: true, trigger: 'blur'}">
                            <el-input v-model="item.description.ch" auto-complete="off" placeholder="例：描述（中文）"></el-input>
                        </el-form-item>
                        <el-form-item label="Description" :prop="'items.' + index + '.description.en'" :rules="{required: true, trigger: 'blur'}">
                            <el-input v-model="item.description.en" auto-complete="off" placeholder="例：Description（English）"></el-input>
                        </el-form-item>
                        <el-form-item label="logo" :prop="'items.' + index + '.logo'" :rules="{required: true, trigger: 'change'}">
                            <el-input v-model="item.logo" auto-complete="off"></el-input>
                            <el-upload action="/api/upload/section" :on-success="handleSuccess.bind(undefined, index, 'logo')" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                                <div v-if="item.logo" class="picProview">
                                    <img :src="item.logo">
                                </div>
                                <el-button size="small" type="primary" :loading="uploading">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="背景图" :prop="'items.' + index + '.bg'" :rules="{required: true, trigger: 'change'}">
                            <el-input v-model="item.bg" auto-complete="off"></el-input>
                            <el-upload action="/api/upload/section" :on-success="handleSuccess.bind(undefined, index, 'bg')" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                                <div v-if="item.bg" class="picProview">
                                    <img :src="item.bg">
                                </div>
                                <el-button size="small" type="primary" :loading="uploading">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-card>
            </el-form>

            <el-row :gutter="20">
                <el-col :span="24">
                    <el-button type="primary" @click="onSubmit">立即更新</el-button>
                </el-col>
            </el-row>
        </div>

    </section>
</template>
<script type="text/javascript">
    export default {
        data () {
            return {
                loading: false,
                formloading: false,
                uploading: false,
                form: {
                    items: [
                        {
                            title: {
                                ch: "",
                                en: ""
                            },
                            description: {
                                ch: "",
                                en: ""
                            },
                            bg: "",
                            logo: ""
                        },
                        {
                            title: {
                                ch: "",
                                en: ""
                            },
                            description: {
                                ch: "",
                                en: ""
                            },
                            bg: "",
                            logo: ""
                        },
                        {
                            title: {
                                ch: "",
                                en: ""
                            },
                            description: {
                                ch: "",
                                en: ""
                            },
                            bg: "",
                            logo: ""
                        }
                    ]
                }
            }
        },
        methods: {
            handleSuccess (index, tag, response, file, fileList) {
                this.$message({
                    message: response.filename + "上传已经成功",
                    type: 'success'
                });
                response.path = ("/" + response.path.replace(/\\/ig, "/")).replace(/public/ig, "static");
                this.form.items[index][tag] = response.path;
            },
            beforeUpload (file) {
                const PIC = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 0.5;
                if (!PIC) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 500Kb!');
                }
                return PIC && isLt2M;
            },
            handleuploaderror () {
                this.$message.error('上传图片失败');
            },
            onSubmit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http.post(
                                '/api/staticdata/section',
                                this.form,
                                {
                                    before (request) {
                                        this.loading = true;
                                    },
                                    emulateJSON: true
                                }
                        ).then(
                                (res) => {
                                    // success
                                    this.loading = false;
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    })
                                },
                                () => {
                                    // error
                                    this.loading = false
                                    // error
                                    this.$message({
                                        message: '更新失败',
                                        type: 'error'
                                    })
                                }
                        )
                    } else {
                        // not validated
                        console.log('submit is not validate!!');
                        return false;
                    }
                })
            }
        },
        watch: {},
        created () {
            this.$http.get(
                    '/static/data/section.json',
                    {
                        before (request) {
                            this.loading = true;
                        }
                    }
            ).then(
                    (res) => {
                        // success
                        this.loading = false;
                        if (res.body.hasOwnProperty('items')) {
                            this.form = res.body;
                        }
                    },
                    () => {
                        // error
                        this.loading = false
                        // error
                        this.$message({
                            message: '获取失败',
                            type: 'error'
                        })
                    }
            )
        }
    }
</script>

<style scoped lang="less">
    .picProview {
        width: 100%;
        border: 1px dashed #ccc;
        margin-top: 10px;
        padding: 10px;
        img {
            width: 100%;
        }
    }
    .box-card {
        box-shadow: none;
        margin-bottom: 20px;
    }
</style>

<style>
    .el-upload--picture {
        text-align: left;
    }
</style>


