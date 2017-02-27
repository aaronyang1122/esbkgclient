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
                <el-table :data="currentData" v-loading.body="loading" style="width: 100%" :row-class-name="filterRowDisable" border>
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
            <el-row v-if="!isSearched">
                <el-pagination layout="sizes, prev, pager, next" :total="totalItems" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :current-page="currentPage"  @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </el-row>
            <el-row v-if="isSearched">
                <el-button @click="handleBack">返回</el-button>
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
        <el-dialog title="添加用户" v-model="dialogFormVisible" @close="handleReset">
            <el-form :model="form" :rules="formrules" ref="form" label-width="80px">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="form.name" auto-complete="off" placeholder="例：zhangsan"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" auto-complete="off" placeholder="例：张三"></el-input>
                </el-form-item>
                <el-form-item label="盛大ID" prop="sndaid">
                    <el-input v-model.number="form.sndaid" auto-complete="off" placeholder="例：123456"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="department">
                    <el-input v-model="form.department" auto-complete="off" placeholder="例：数据部"></el-input>
                </el-form-item>
                <el-form-item label="职位名称" prop="jobtitle">
                    <el-input v-model="form.jobtitle" auto-complete="off" placeholder="例：开发工程师"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model.number="form.phone" auto-complete="off" placeholder="例：8888888"></el-input>
                </el-form-item>
                <el-form-item label="分机" prop="extension">
                    <el-input v-model.number="form.extension" auto-complete="off" placeholder="例：000"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" auto-complete="off" placeholder="例：someone@somemail.com"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model.number="form.qq" auto-complete="off" placeholder="例：12345"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择性别">
                        <el-option label="男" :value="0"></el-option>
                        <el-option label="女" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户类型" prop="usertype">
                    <el-select v-model="form.usertype" placeholder="请选择用户类型">
                        <el-option label="管理员" :value="0"></el-option>
                        <el-option label="普通用户" :value="1"></el-option>
                    </el-select>
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
				form: {
                      name: "",
                      nickname: "",
                      sndaid: "",
                      password: "",
                      department: "",
                      jobtitle: "",
                      phone: "",
                      extension: "",
                      email: "",
                      qq: "",
                      sex: "",
                      usertype: ""
                },
        excludeEdit: ['userid', 'updatetime', 'createtime', 'operator', 'remember_token', 'departmentname', 'rolesname', 'gamesname'],
        formrules: {
          name: [
            { required: true,
            	message: '请输入用户名',
            	trigger: 'blur'
            }
          ],
          nickname: [
            {
            	required: true,
            	message: '请输入昵称',
            	trigger: 'blur'
            }
          ],
          sndaid: [
            {
            	required: true,
            	type: 'number',
            	message: '请输入盛大ID',
            	trigger: 'blur'
            },
            {
            	type: 'number',
            	message: '纯数字不包含其他字符',
            	trigger: 'blur,change'
            }
          ],
          password: [{ required: false }],
          department: [{ required: false }],
          jobtitle: [{ required: false }],
          phone: [{ required: false }],
          extension: [{ required: false }],
          qq: [{ required: false }],
          usertype: [{ required: false }],
          email: [
            {
            	required: true,
            	message: '请输入邮箱',
            	trigger: 'blur'
            },
            {
            	type: 'email',
            	message: '请输入正确的邮箱地址',
            	trigger: 'blur,change'
            }
          ]
        },
        formLabelWidth: '120px'
			}
		},
		methods: {
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
      		api: '/api/deleteUser',
      		listApi: '/api/showUserAuth',
      		id: 'userid',
      		remove: true
      	})
      },
      handleSubmit () {
      	handleSubmit.call(this, {
      		api: '/api/addUser',
      		listApi: '/api/showUserAuth',
      		data: {
      			_token: this.token,
      			userArray: this.form
      		}
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
      }
   	},
   	computed: {
	  	sortMainData () {
	  		return sortByTime(this.mainData)
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
<style scoped>
	.el-pagination {
		padding: 2px 0;
	}
	.el-form {
		width: 440px;
	}
</style>
