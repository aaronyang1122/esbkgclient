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
                        <el-form-item label="链接">
                            <el-input v-model="item.link" auto-complete="off" placeholder="例：链接"></el-input>
                        </el-form-item>
                        <el-form-item label="PC中文" :prop="'items.' + index + '.imgpc.ch'" :rules="{required: true, trigger: 'change'}">
                            <el-input v-model="item.imgpc.ch" auto-complete="off"></el-input>
                            <el-upload action="/api/upload/section" :on-success="handleSuccess.bind(undefined, index, 'imgpc.ch')" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                                <div v-if="item.imgpc.ch" class="picProview">
                                    <img :src="item.imgpc.ch">
                                </div>
                                <el-button size="small" type="primary" :loading="uploading">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="PC英文" :prop="'items.' + index + '.imgpc.en'" :rules="{required: true, trigger: 'change'}">
                            <el-input v-model="item.imgpc.en" auto-complete="off"></el-input>
                            <el-upload action="/api/upload/section" :on-success="handleSuccess.bind(undefined, index, 'imgpc.en')" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                                <div v-if="item.imgpc.en" class="picProview">
                                    <img :src="item.imgpc.en">
                                </div>
                                <el-button size="small" type="primary" :loading="uploading">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="Mobile中文" :prop="'items.' + index + '.imgmobile.ch'" :rules="{required: true, trigger: 'change'}">
                            <el-input v-model="item.imgmobile.ch" auto-complete="off"></el-input>
                            <el-upload action="/api/upload/section" :on-success="handleSuccess.bind(undefined, index, 'imgmobile.ch')" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                                <div v-if="item.imgmobile.ch" class="picProview">
                                    <img :src="item.imgmobile.ch">
                                </div>
                                <el-button size="small" type="primary" :loading="uploading">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="Mobile英文" :prop="'items.' + index + '.imgmobile.en'" :rules="{required: true, trigger: 'change'}">
                            <el-input v-model="item.imgmobile.en" auto-complete="off"></el-input>
                            <el-upload action="/api/upload/section" :on-success="handleSuccess.bind(undefined, index, 'imgmobile.en')" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                                <div v-if="item.imgmobile.en" class="picProview">
                                    <img :src="item.imgmobile.en">
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
    import { imgSource } from '../../../common/common'

    export default {
        data () {
            return {
                loading: false,
                formloading: false,
                uploading: false,
                form: {
                    items: [
                        {
                            imgpc: {
                                ch: "",
                                en: ""
                            },
                            imgmobile: {
                                ch: "",
                                en: ""
                            },
                            link: ""
                        },
                        {
                            imgpc: {
                                ch: "",
                                en: ""
                            },
                            imgmobile: {
                                ch: "",
                                en: ""
                            },
                            link: ""
                        },
                        {
                            imgpc: {
                                ch: "",
                                en: ""
                            },
                            imgmobile: {
                                ch: "",
                                en: ""
                            },
                            link: ""
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

                imgSource.call(file).then(
                    (obj) => {
                        this.form.items[index][tag.split('.')[0]].height = obj.imgHeight;
                    },
                    () => {
                        this.$message.error('图片尺寸获取失败！');
                    }
                )
                this.form.items[index][tag.split('.')[0]][tag.split('.')[1]] = response.path;
            },
            beforeUpload (file) {
                const PIC = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!PIC) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 1000Kb!');
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
        watch: {
            'form' (val, oldVal) {
                console.log(val)
            }
        },
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


