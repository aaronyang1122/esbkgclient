<template>
    <section class="customer-management">
        <div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">新闻管理</h1></div>
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
                    <el-table-column prop="title.ch" label="标题"></el-table-column>
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
            <el-form :model="form" ref="form" label-width="80px" v-loading="editloading">
                <el-form-item label="标题" prop="title.ch" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.title.ch" auto-complete="off" placeholder="例：标题（中文）"></el-input>
                </el-form-item>
                <el-form-item label="Title" prop="title.en" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.title.en" auto-complete="off" placeholder="e.g. Title（English）"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content.ch" :rules="{required: true, trigger: 'blur'}">
                    <!--<el-input v-model="form.content.ch" auto-complete="off" placeholder="例：内容（中文）"></el-input>-->
                    <quill-editor ref="myTextEditor" v-model="form.content.ch" :config="editorOption" style="height: 400px;"></quill-editor>
                </el-form-item>
                <el-form-item label="Content" prop="content.en" :rules="{required: true, trigger: 'blur'}">
                    <!--<el-input v-model.number="form.content.en" auto-complete="off" placeholder="e.g. Content(English)"></el-input>-->
                    <quill-editor ref="myTextEditor"  v-model="form.content.en" :config="editorOption" style="height: 400px;"></quill-editor>
                </el-form-item>
                <el-form-item label="优先级">
                    <el-input v-model="form.index" auto-complete="off" placeholder="必须是数字"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="img" :rules="{required: true, trigger: 'change'}">
                    <el-input v-model="form.img" auto-complete="off"></el-input>
                    <el-upload action="/api/upload/news" :on-success="handleImage" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                        <div v-if="form.img" class="picProview">
                            <img :src="form.img">
                        </div>
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="isedit" type="primary" @click="handleUpdate" :loading="formloading">更 新</el-button>

                <el-button v-else type="primary" @click="handleSubmit" :loading="formloading">提 交</el-button>

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
                pageSize: 10,
                currentId: "",
                dialogTableVisible: false,
                dialogFormVisible: false,
                isedit: false,
                mirroring_img: "",
                multipleSelection: [],
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent

                            [{'color': []}],          // dropdown with defaults from theme
                            [{'align': []}],

                            ['link', 'image'],

                            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                            [{'header': [1, 2, 3, 4, 5, 6, false]}]
                        ]
                    },
                    placeholder: '请输入内容...'
                },
                form: {
                    title: {
                        ch: "",
                        en: ""
                    },
                    content: {
                        ch: "",
                        en: ""
                    },
                    index: 0,
                    img: ""
                }
            }
        },
        methods: {
            onEditorBlur (editor) {
                console.log('editor blur!', editor)
            },
            onEditorFocus (editor) {
                console.log('editor focus!', editor)
            },
            onEditorReady (editor) {
                console.log('editor ready!', editor)
            },
            onEditorChange ({ editor, html, text }) {
                // console.log('editor change!', editor, html, text)
                this.content = html
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
            handleImage (response, file, fileList) {
                this.$message({
                    message: response.filename + "上传已经成功",
                    type: 'success'
                });
                response.path = ("/" + response.path.replace(/\\/ig, "/")).replace(/public/ig, "static");
                this.mirroring_img = this.form.img = response.path;
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
                    api: '/api/news/delete',
                    listApi: '/api/news/list',
                    data: {
                        id: this.multipleSelection.length > 1 ? this.multipleSelection.map((e) => e._id) : this.multipleSelection[0]['_id']
                    },
                    remove: true
                })
            },
            handleSubmit () {
                handleSubmit.call(this, {
                    api: '/api/news/add',
                    listApi: '/api/news/list',
                    data: this.form
                })
            },
            handleEdit (index, row) {
                this.dialogFormVisible = true;
                this.isedit = true;
                this.currentId = row._id;
                handleEdit.call(this, {
                    api: '/api/news/detail',
                    data: {
                        id: row._id
                    }
                })
            },
            handleUpdate () {
                handleUpdate.call(this, {
                    api: '/api/news/update',
                    listApi: '/api/news/list',
                    data: this.form,
                    query: {
                        id: this.currentId
                    }
                })
            },
            handleReset () {
                // reset 表单
                this.$refs.form.resetFields();
                this.form.logo = this.mirroring_logo;
                this.form.prdpic = this.mirroring_prdpic;
                this.isedit = false;
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
                api: '/api/news/list'
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
</style>
<style>
    .el-upload--picture {
        text-align: left;
    }
    .ql-editing{
        z-index: 1;
    }
    .ql-snow .ql-picker {
        height: auto;
    }
    .ql-toolbar.ql-snow, .ql-container.ql-snow {
        border: 1px solid #bfcbd9;
    }
</style>

