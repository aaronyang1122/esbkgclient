<template>
	<section class="role-management">
		<div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">角色管理</h1></div>
		<div class="wrapper-md">
		  <!-- search bar -->
		  <el-row :gutter="20">
		  	<el-col :span="19">
				  <el-autocomplete class="inline-input" v-model="searchValue" :fetch-suggestions="querySearch" placeholder="请输入需要查找的角色名" :trigger-on-focus="false" @select="handleSelect" style="width: 100%;">
				    <!--<el-button slot="append" icon="search"></el-button>-->
				  </el-autocomplete>
		  	</el-col>
 				<el-col :span="5">
 					<el-button type="primary" icon="plus" @click="dialogFormVisible = true">创建角色</el-button>
 				</el-col>
		  </el-row>
		  <!-- / search bar -->
		  
		   <!-- table -->
		  <el-row>
			  <el-table :data="currentData" v-loading.body="loading" style="width: 100%" :row-class-name="filterRowDisable" border>
			    <el-table-column prop="name" label="角色名" :formatter="filterEmpty"></el-table-column>
			    <el-table-column prop="description" label="描述" :formatter="filterEmpty"></el-table-column>
			    <el-table-column prop="member" label="成员" :formatter="filterEmpty"></el-table-column>
			    <el-table-column prop="menus" label="包含菜单" :formatter="filterEmpty"></el-table-column>
			    <el-table-column inline-template :context="_self" label="操作" min-width="90">
			    <div>
			    	<el-button size="small" :plain="true" type="primary"  @click="handleDetail($index, row)">详细</el-button>
	        	<el-button size="small" :disabled="row.status===1" type="danger" @click="handleDelete($index, row)">
	        		<template v-if="row.status===1">
	        			已删除
	        		</template>
	        		<template v-else>
	        			删除
	        		</template>
	        	</el-button>
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
			      	<template v-if="row.name==='status'">
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
		<el-dialog title="创建角色" v-model="dialogFormVisible" @close="handleReset">
			<el-form :model="form" :rules="formrules" ref="form" label-width="90px">
				<el-form-item label="角色名" prop="name" required>
					<el-input v-model="form.name" auto-complete="off" placeholder="例：管理员"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="form.description" auto-complete="off" placeholder="例：管理员是一个伟大的职业"></el-input>
				</el-form-item>
				<el-form-item label="包含菜单" prop="category">
					<el-select v-model="form.category" placeholder="请选择游戏类型">
						<el-option label="菜单1" value="0"></el-option>
						<el-option label="菜单2" value="1"></el-option>
						<el-option label="菜单3" value="2"></el-option>
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
          description: "",
          category: ""
        },
        excludeEdit: ['updatetime', 'createtime', 'operator'], 
        formrules: {
          name: [
            { required: true, 
            	message: '请输入角色名', 
            	trigger: 'blur' 
            }
          ],
          category: [
            { 
            	required: true,
            	message: '请选择包含菜单', 
            	trigger: 'blur, change'
            }
          ],
          description: [
          	{ 
          		required: true,
          		message: '请输入描述',
          		trigger: 'blur'
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
      		id: 'roleid',
      		exclude: ['status']
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
      		tips: '此操作将删除该角色, 是否继续?',
      		api: '/api/deleteRole',
      		listApi: '/api/showRole',
      		id: 'roleid',
      		remove: true
      	})
      },
      handleSubmit () {
      	handleSubmit.call(this, {
      		api: '/api/addRole',
      		listApi: '/api/showRole',
      		data: {
      			_token: this.token,
      			roleArray: this.form
      		}
      	})
      },
      handleEdit (index, row) {
      	let _data = {}
				_data[row.name] = row.newValue
      	handleEdit.call(this, index, row, {
      		api: '/api/updateRole',
      		id: 'roleid',
      		data: {
		      	_token: this.token,
		      	id: row.id,
		      	roleArray: _data
		      }
      	})
      },
      handleReset () {
      	// reset 表单
        this.$refs.form.resetFields();
      }
    },
   	computed: {
			...mapGetters({
	    	token: 'getToken'
	  	}),
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
   			api: '/api/showRole'
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