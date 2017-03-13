<template>
    <section class="customer-management">
        <div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">产品管理</h1></div>
        <div class="wrapper-md">
            <!-- search bar -->
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-button type="primary" icon="plus" @click="dialogFormVisible = true">添加</el-button>
                    <el-button type="danger" icon="minus" @click="handleDelete" :disabled="multipleSelection.length===0">删除</el-button>
                </el-col>
            </el-row>
            <!-- / search bar -->

            <!-- table -->
            <el-row>
                <el-table :data="currentData" v-loading.body="loading" style="width: 100%" border @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="index" label="index" width="90"></el-table-column>
                    <el-table-column prop="name.ch" label="产品名"></el-table-column>
                    <el-table-column prop="createtime" label="创建时间"></el-table-column>
                    <el-table-column prop="updatetime" label="更新时间"></el-table-column>
                    <el-table-column inline-template :context="_self" label="操作" width="90">
                        <div>
                            <el-button size="small" :plain="true" type="primary"  @click="handleEdit($index, row)">修改</el-button>
                        </div>
                    </el-table-column>
                </el-table>
            </el-row>
            <!-- / table -->

            <!-- pagination -->
            <el-row>
                <el-pagination layout="sizes, prev, pager, next" :total="totalItems" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :current-page="currentPage"  @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </el-row>
            <!-- / pagination -->
        </div>

        <!-- add component -->
        <el-dialog :title="isedit?'修改':'添加'" v-model="dialogFormVisible" @close="handleReset" size="large">
            <el-form :model="form" ref="form" label-width="120px" v-loading="editloading">
                <el-form-item label="产品名" prop="name.ch" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.name.ch" auto-complete="off" placeholder="例：产品名（中文）"></el-input>
                </el-form-item>
                <el-form-item label="Product Name" prop="name.en" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.name.en" auto-complete="off" placeholder="e.g. Product Name（English）"></el-input>
                </el-form-item>
                <el-form-item label="优先级">
                    <el-input v-model="form.index" auto-complete="off" placeholder="必须是数字"></el-input>
                </el-form-item>
                <el-form-item label="按钮链接">
                    <el-input v-model="form.link" auto-complete="off" placeholder="例：跳转至其他地方，如：商城等的外链"></el-input>
                </el-form-item>
                <el-form-item label="按钮文字">
                    <el-input v-model="form.linktext.ch" auto-complete="off" placeholder="例：按钮文字(中文)"></el-input>
                </el-form-item>
                <el-form-item label="Button Text">
                    <el-input v-model="form.linktext.en" auto-complete="off" placeholder="例：Button Text(English)"></el-input>
                </el-form-item>
                <el-card class="box-card" v-for="(section, index) in form.sections">
                    <div slot="header" class="clearfix">
                        <span style="font-weight: bold;">区块{{index}}</span>
                        <el-button style="float: right;" type="danger" icon="minus" size="mini" v-if="index>0" @click="removeSection(section)">删除</el-button>
                    </div>
                    <div>
                        <el-form-item label="标题" :prop="'sections.' + index + '.title.ch'" :rules="{required: true, trigger: 'blur'}">
                            <el-input v-model="section.title.ch" auto-complete="off" placeholder="例：标题（中文）"></el-input>
                        </el-form-item>
                        <el-form-item label="Title" :prop="'sections.' + index + '.title.en'" :rules="{required: true, trigger: 'blur'}">
                            <el-input v-model="section.title.en" auto-complete="off" placeholder="例：Title（English）"></el-input>
                        </el-form-item>
                        <el-form-item label="标题字体颜色">
                            <el-input v-model="section.titlecolor" auto-complete="off" placeholder="例：#EAA949"></el-input>
                        </el-form-item>
                        <el-form-item label="区块背景颜色">
                            <el-input v-model="section.bgcolor" auto-complete="off" placeholder="例：#FFFFFF"></el-input>
                        </el-form-item>
                        <el-form-item label="内容" :prop="'sections.' + index + '.content.ch'" :rules="{required: true, trigger: 'blur'}">
                            <el-input v-model="section.content.ch" auto-complete="off" placeholder="例：内容（中文）" type="textarea" :rows="2"></el-input>
                        </el-form-item>
                        <el-form-item label="Content" :prop="'sections.' + index + '.content.en'" :rules="{required: true, trigger: 'blur'}">
                            <el-input v-model="section.content.en" auto-complete="off" placeholder="例：Content（English）" type="textarea" :rows="2"></el-input>
                        </el-form-item>
                        <el-form-item label="区块连接">
                            <el-input v-model="section.link" auto-complete="off" placeholder="例：当前区块的连接"></el-input>
                        </el-form-item>
                        <el-form-item label="按钮文字">
                            <el-input v-model="section.linktext.ch" auto-complete="off" placeholder="例：按钮文字(中文)"></el-input>
                        </el-form-item>
                        <el-form-item label="Button Text">
                            <el-input v-model="section.linktext.en" auto-complete="off" placeholder="例：Button Text(English)"></el-input>
                        </el-form-item>
                        <el-form-item label="文字位置">
                            <el-select v-model="section.textposition" >
                                <el-option label="上" value="top"></el-option>
                                <el-option label="下" value="bottom"></el-option>
                                <el-option label="左" value="left"></el-option>
                                <el-option label="右" value="right"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="图片" :prop="'sections.' + index + '.img'" :rules="{required: true, trigger: 'change'}">
                            <el-input v-model="section.img" auto-complete="off"></el-input>
                            <el-upload action="/api/upload/product" :on-success="handleImage.bind(undefined,index)" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                                <div v-if="section.img" class="picProview">
                                    <img :src="section.img">
                                </div>
                                <el-button size="small" type="primary" :load="uploading">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-card>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="isedit" type="primary" @click="handleUpdate" :loading="formloading">更 新</el-button>

                <el-button v-else type="primary" @click="handleSubmit" :loading="formloading">提 交</el-button>

                <el-button @click="addSection">增加区块</el-button>
                <!--<el-button @click="handleReset">重置</el-button>-->
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- / add component -->
    </section>
</template>
<script type="text/javascript">
    import { mapGetters, mapActions } from 'vuex'
    import { handleCurrentChange, handleSizeChange, handleDelete, handleSubmit, handleEdit, initList, handleRoute, handleUpdate } from '../../common/common'

    export default {
        data () {
            return {
                mainData: [],
                currentData: [],
                currentPage: 1,
                totalItems: 0,
                loading: false,
                formloading: false,
                editloading: false,
                uploading: false,
                pageSize: 10,
                currentId: "",
                dialogTableVisible: false,
                dialogFormVisible: false,
                isedit: false,
                mirroring_img: "",
                multipleSelection: [],
                form: {
                    name: {
                        ch: "",
                        en: ""
                    },
                    sections: [
                        {
                            title: {
                                ch: "",
                                en: ""
                            },
                            content: {
                                ch: "",
                                en: ""
                            },
                            img: "",
                            link: "",
                            titlecolor: "#eaa949",
                            bgcolor: "#FFFFFF",
                            linktext: {
                                ch: "",
                                en: ""
                            },
                            textposition: "left"
                        }
                    ],
                    index: 0,
                    link: "",
                    linktext: {
                        ch: "",
                        en: ""
                    }
                }
            }
        },
        methods: {
            addSection () {
                this.form.sections.push({
                    title: {
                        ch: "",
                        en: ""
                    },
                    content: {
                        ch: "",
                        en: ""
                    },
                    img: "",
                    link: "",
                    titlecolor: "#eaa949",
                    bgcolor: "#FFFFFF",
                    linktext: {
                        ch: "",
                        en: ""
                    },
                    textposition: "left"
                })
            },
            removeSection (item) {
                let index = this.form.sections.indexOf(item)
                if (index !== -1) {
                    this.form.sections.splice(index, 1)
                }
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
            handleImage (index, response) {
                this.uploading = false;
                this.$message({
                    message: response.filename + "上传已经成功",
                    type: 'success'
                });
                this.form.sections[index].img = ("/" + response.path.replace(/\\/ig, "/")).replace(/public/ig, "static");
            },
            handleProductPic (response, file, fileList) {
                this.$message({
                    message: response.filename + "上传已经成功",
                    type: 'success'
                });
                response.path = ("/" + response.path.replace(/\\/ig, "/")).replace(/public/ig, "static");
                this.mirroring_prdpic = this.form.prdpic = response.path;
            },
            beforeUpload (file) {
                const PIC = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!PIC) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                this.uploading = true;
                return PIC && isLt2M;
            },
            handleuploaderror () {
                this.$message.error('上传图片失败');
            },
            handleCurrentChange (val) {
                handleCurrentChange.call(this, val)
            },
            handleSizeChange (val) {
                handleSizeChange.call(this, val)
            },
            handleDelete () {
                handleDelete.call(this, {
                    tips: '此操作将从数据库中彻底删除, 是否继续?',
                    api: '/api/product/delete',
                    listApi: '/api/product/list',
                    data: {
                        id: this.multipleSelection.length > 1 ? this.multipleSelection.map((e) => e._id) : this.multipleSelection[0]['_id']
                    },
                    remove: true
                })
            },
            handleSubmit () {
                handleSubmit.call(this, {
                    api: '/api/product/add',
                    listApi: '/api/product/list',
                    data: this.form
                })
            },
            handleEdit (index, row) {
                this.dialogFormVisible = true;
                this.isedit = true;
                this.currentId = row._id;
                handleEdit.call(this, {
                    api: '/api/product/detail',
                    data: {
                        id: row._id
                    }
                })
            },
            handleUpdate () {
                handleUpdate.call(this, {
                    api: '/api/product/update',
                    listApi: '/api/product/list',
                    data: this.form,
                    query: {
                        id: this.currentId
                    }
                })
            },
            handleReset () {
                // reset 表单
                this.$refs.form.resetFields();
                this.isedit = false;
                this.form.sections = [this.form.sections.shift()];
            }
        },
        watch: {
            'mainData' (val, oldVal) {},
            'currentData' (val, oldVal) {},
            '$route' () {
                handleRoute.call(this)
            }
        },
        created () {
            initList.call(this, {
                api: '/api/product/list'
            })
        }
    }
</script>
<style scoped lang="less">
    .el-pagination {
        padding: 2px 0;
    }
    .el-form {
        width: 100%;
    }
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
        &:last-of-type {
            margin-bottom: 0;
        }
    }
</style>
<style>
    .el-upload--picture {
        text-align: left;
    }
</style>


