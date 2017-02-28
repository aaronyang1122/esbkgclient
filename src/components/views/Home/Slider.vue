<template>
    <section class="customer-management">
        <div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">轮播图管理</h1></div>
        <div class="wrapper-md">
            <!-- search bar -->
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-button type="primary" icon="plus" @click="dialogFormVisible = true">添加</el-button>
                    <el-button type="danger" icon="minus" @click="dialogFormVisible = true">删除</el-button>
                </el-col>
            </el-row>
            <!-- / search bar -->

            <!-- table -->
            <el-row>
                <el-table :data="currentData" v-loading.body="loading" style="width: 100%" :row-class-name="filterRowDisable" border @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="index" label="index" width="90"></el-table-column>
                    <el-table-column prop="title.ch" label="标题"></el-table-column>
                    <el-table-column prop="createtime" label="创建时间"></el-table-column>
                    <el-table-column prop="updatetime" label="更新时间"></el-table-column>
                    <el-table-column inline-template :context="_self" label="操作" width="90">
                        <div>
                            <el-button size="small" :plain="true" type="primary"  @click="handleDetail($index, row)">编辑</el-button>
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

        <!-- detail component -->
        <el-dialog title="详细" v-model="dialogTableVisible">
            <el-table :data="detailData" border>
                <el-table-column property="name" label="项" width="150"></el-table-column>
                <el-table-column inline-template label="内容">
                    <section>
                        <template v-if="!row.edit">
                            <span>{{ filterDetail(row.name, row.content) }}</span>
                        </template>
                        <template v-else>
                            <template v-if="row.name==='sex' || row.name==='usertype' || row.name==='status' || row.name==='department'">
                                <el-select v-model="row.newValue" size="small">
                                    <el-option v-for="item in row.newOptions" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                            <template v-else>
                                <el-input :placeholder="row.content.toString()" size="small" v-model="row.newValue"></el-input>
                            </template>
                        </template>
                    </section>
                </el-table-column>
                <el-table-column inline-template label="操作" width="180">
                    <section>
                        <template v-if="!row.edit">
                            <el-button size="small" type="info" @click="row.edit=true" v-if="showEdit(row.name, excludeEdit)">编辑</el-button>
                        </template>
                        <template v-else>
                            <el-button size="small" type="success" @click="handleEdit($index, row)" :loading="editloading">提交</el-button>
                            <el-button size="small" :plain="true" type="primary" @click="row.edit=false">取消</el-button>
                        </template>
                    </section>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- / detail component -->

        <!-- add component -->
        <el-dialog title="添加" v-model="dialogFormVisible" @close="handleReset">
            <el-form :model="form" ref="form" label-width="80px">
                <el-form-item label="标题" prop="title.ch" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.title.ch" auto-complete="off" placeholder="例：标题（中文）"></el-input>
                </el-form-item>
                <el-form-item label="Title" prop="title.en" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.title.en" auto-complete="off" placeholder="e.g. Title（English）"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content.ch" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.content.ch" auto-complete="off" placeholder="例：内容（中文）"></el-input>
                </el-form-item>
                <el-form-item label="Content" prop="content.en" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model.number="form.content.en" auto-complete="off" placeholder="e.g. Content(English)"></el-input>
                </el-form-item>
                <el-form-item label="优先级">
                    <el-input v-model="form.index" auto-complete="off" placeholder="必须是数字"></el-input>
                </el-form-item>
                <el-form-item label="文字位置">
                    <el-select v-model="form.textposition" >
                        <el-option label="上" value="top"></el-option>
                        <el-option label="下" value="bottom"></el-option>
                        <el-option label="左" value="left"></el-option>
                        <el-option label="右" value="right"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Logo" prop="logo" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model="form.logo" auto-complete="off"></el-input>
                    <el-upload action="/api/upload/slider" :on-success="handleLogo" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                        <div v-if="form.logo" class="picProview">
                            <img :src="form.logo">
                        </div>
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品图" prop="prdpic" :rules="{required: true, trigger: 'blur'}">
                    <el-input v-model.number="form.prdpic" auto-complete="off"></el-input>
                    <el-upload action="/api/upload/slider" :on-success="handleProductPic" :on-error="handleuploaderror" accept="image/*" :before-upload="beforeUpload" list-type="picture" :show-file-list="false">
                        <div v-if="form.prdpic" class="picProview">
                            <img :src="form.prdpic">
                        </div>
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmit" :loading="formloading">确 定</el-button>
                <el-button @click="handleReset">重置</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- / add component -->
    </section>
</template>
<script>
	import { mapGetters, mapActions } from 'vuex'
	import { currentArr, handleBack, findDetailListIndex, showEdit, handleDetail, handleCurrentChange, handleSizeChange, querySearch, handleSelect, handleDelete, handleSubmit, handleEdit, initList, handleRoute } from '../../../common/common'
	import { filterEmpty, filterRowDisable, sortByTime, filterDetail } from '../../../filters/'

 	export default {
		data () {
			return {
				searchValue: '',
				isSearched: false,
				mainData: [],
				currentData: [],
				detailData: [],
				currentPage: 1,
				totalItems: 0,
				loading: false,
				formloading: false,
				editloading: false,
				pageSize: 10,
				dialogTableVisible: false,
				dialogFormVisible: false,
				mirroring_logo: "",
				mirroring_prdpic: "",
				multipleSelection: [],
				form: {
                      title: {
                         ch: "",
                         en: ""
                      },
                      content: {
                         ch: "",
                         en: ""
                      },
                      index: "",
                      textposition: "left",
                      logo: "",
                      prdpic: ""

                },
        excludeEdit: ['userid', 'updatetime', 'createtime', 'operator', 'remember_token', 'departmentname', 'rolesname', 'gamesname'],
        formLabelWidth: '120px'
			}
		},
		methods: {
		    handleSelectionChange (val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
		    handleLogo (response, file, fileList) {
                this.$message({
                      message: response.filename + "上传已经成功",
                      type: 'success'
                    });
		        response.path = ("/" + response.path.replace(/\\/ig, "/")).replace(/public/ig, "static");
                this.mirroring_logo = this.form.logo = response.path;
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
			showEdit,
      handleDetail (index, row) {
      	handleDetail.call(this, index, row, {
      		id: 'userid',
      		exclude: ['avatar', 'status']
      	})
      },
      filterEmpty,
      filterDetail,
      filterRowDisable,
      handleCurrentChange (val) {
      	handleCurrentChange.call(this, val)
      },
      handleSizeChange (val) {
      	handleSizeChange.call(this, val)
      },
      querySearch (queryString, cb) {
        querySearch.call(this, queryString, cb)
      },
      handleSelect (item) {
      	handleSelect.call(this, item)
      },
      handleBack () {
      	handleBack.call(this)
      },
      handleDelete (index, row) {
      	handleDelete.call(this, index, row, {
      		tips: '此操作将删除该用户, 是否继续?',
      		api: '/api/slider/delete',
      		listApi: '/api/slider/list',
      		data: {
      		    id: this.multipleSelection.length > 1 ? this.multipleSelection.map((e) => e._id) : this.multipleSelection[0]['_id']
      		},
      		remove: true
      	})
      },
      handleSubmit () {
      	handleSubmit.call(this, {
      		api: '/api/slider/add',
      		listApi: '/api/slider/list',
      		data: this.form
      	})
      },
      handleEdit (index, row) {
      	let _data = {}
				_data[row.name] = row.newValue
      	handleEdit.call(this, index, row, {
      		api: '/api/updateUser',
      		id: 'userid',
      		data: {
		      	_token: this.token,
		      	id: row.id,
		      	userArray: _data
		      }
      	})
      },
      handleReset () {
            // reset 表单
            this.$refs.form.resetFields();
            this.form.logo = this.mirroring_logo
            this.form.prdpic = this.mirroring_prdpic
      }
   	},
   	watch: {
			'mainData' (val, oldVal) {
//				console.log('mainData:' + val)
			},
			'currentData' (val, oldVal) {
//				console.log('currentData:' + val)
			},
			'$route' () {
				handleRoute.call(this)
			}
		},
   	created () {
   		initList.call(this, {
   			api: '/api/slider/list'
   		})
   	}
	}
</script>
<style scoped lang="less">
	.el-pagination {
		padding: 2px 0;
	}
	.el-form {
		width: 440px;
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
</style>
