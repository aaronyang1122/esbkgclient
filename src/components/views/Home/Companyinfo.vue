<template>
    <section class="customer-management">
        <div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">公司信息管理</h1></div>
        <div class="wrapper-md" v-loading="loading">
            <el-form ref="form" :model="form" label-width="160px">
                <el-form-item label="公司简介" prop="intro.ch" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.intro.ch" placeholder="公司简介（中文）" type="textarea" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="Company Introduction" prop="intro.en" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.intro.en" placeholder="Company Introduction（English）" type="textarea" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="公司地址" prop="address.ch" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.address.ch" placeholder="公司地址（中文）"></el-input>
                </el-form-item>
                <el-form-item label="Company Address" prop="address.en" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.address.en" placeholder="Company Address（English）"></el-input>
                </el-form-item>
                <el-form-item label="二维码" prop="qrcode" :rules="{required: true, trigger: 'change'}">
                    <el-input v-model="form.qrcode" placeholder="二维码图片"></el-input>
                    <el-upload action="/api/upload/qrcode" :on-success="handleSuccess.bind(this,'qrcode')" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                        <div v-if="form.qrcode" class="picProview">
                            <img :src="form.qrcode">
                        </div>
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="电话" prop="tel" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.tel" placeholder="+86 021-8888-8888"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.email" placeholder="someone@some.com"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即更新</el-button>
                </el-form-item>
            </el-form>
        </div>

    </section>
</template>
<script type="text/javascript">
    import { mapGetters, mapActions } from 'vuex'
    import { handleCurrentChange, handleSizeChange, handleDelete, handleSubmit, handleEdit, initList, handleRoute, handleUpdate } from '../../../common/common'

    export default {
        data () {
            return {
                loading: false,
                formloading: false,
                editloading: false,
                form: {
                    intro: {
                        ch: "",
                        en: ""
                    },
                    address: {
                        ch: "",
                        en: ""
                    },
                    qrcode: "",
                    tel: "",
                    email: ""
                }
            }
        },
        methods: {
            handleSuccess (tag, response, file, fileList) {
                this.$message({
                    message: response.filename + "上传已经成功",
                    type: 'success'
                });
                response.path = ("/" + response.path.replace(/\\/ig, "/")).replace(/public/ig, "static");
                this.form[tag] = response.path;
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
                            '/api/uploadcompanyinfo',
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
                    '/static/data/companyinfo.json',
                    {
                        before (request) {
                            this.loading = true;
                        }
                    }
            ).then(
                    (res) => {
                        // success
                        this.loading = false;
                        this.form = res.body;
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
</style>

<style>
    .el-upload--picture {
        text-align: left;
    }
</style>
