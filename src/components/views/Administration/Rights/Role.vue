<template>
  <section class="role-rights">
		<div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">角色映射</h1></div>
		<div class="wrapper-md">
			<!-- search bar -->
		  <el-row>
			  <el-autocomplete class="inline-input" v-model="searchValue" :fetch-suggestions="querySearch" placeholder="请输入要查询的角色名" :trigger-on-focus="false"  @select="handleSelect" style="width: 100%;">
			  	<!--<el-button slot="append" icon="search" @click="test"></el-button>-->
			  </el-autocomplete>
		  </el-row>
		  <!-- / search bar -->
		  
		  <!-- table -->
		  <el-row>
		  	<el-table :data="currentData" v-loading.body="loading" style="width: 100%" border>
			    <el-table-column prop="name" label="角色名" :formatter="filterEmpty" width="200"></el-table-column>
			    <el-table-column label="菜单项" prop="menu">
			    	<template scope="scope">
			    		<!-- tags -->
			    		<el-tag v-for="tag in scope.row.rolemenus" :closable="true" type="primary" :key="tag" :close-transition="false" @close="handleRemoveTag(tag, scope, action.menu.del)" class="tags">
								{{tag.name}}
							</el-tag>
							<!-- / tags -->
			        <el-button size="mini" type="primary" icon="plus" @click="openEdit(scope)" style="margin: 10px 0;">添加</el-button>
			        <el-button size="mini" type="info" icon="edit" @click="openEdit(scope, true)" style="margin: 10px 0;" v-if="scope.row.rolemenus.length > 0">修改</el-button>
			      </template>
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
		<el-dialog :title="detailData.title" v-model="dialogTableVisible" @close="closeDialog">
			<template v-if="isEdit">
				<!-- edit section-->
				<el-table :data="detailData.items" border>
		    	<el-table-column property="name" label="菜单名" width="150"></el-table-column>
		    	<el-table-column property="read" label="读权限">
		    		<template scope="scope">
			        <el-switch on-text="开" off-text="关" v-model="scope.row.read" @change="actionpost(detailData.options, scope)"></el-switch>
			      </template>
		    	</el-table-column>
		    	<el-table-column property="write" label="写权限">
		    		<template scope="scope">
			        <el-switch on-text="开" off-text="关" v-model="scope.row.write" @change="actionpost(detailData.options, scope)"></el-switch>
			      </template>
		    	</el-table-column>
		    </el-table>
		    <!-- / edit section-->
			</template>
			<template v-else>
				<!-- add section-->
				<el-card class="box-card">
			  	<el-form ref="form" :inline="false" label-width="100px" style="width: 100%">
					  <el-form-item :label="detailData.label">
					    <el-select v-model="form.id" :placeholder="detailData.placeholder">
					      <el-option v-for="(item, index) in detailData.items" :label="item.name" :value="item.id"></el-option>
					    </el-select>
					  </el-form-item>
					  <template v-if="detailData.options.name === 'menu'">
					  	<el-form-item label="读权限" >
						    <el-switch on-text="开" off-text="关" v-model="form.read"></el-switch>
						  </el-form-item>
						  <el-form-item label="写权限" >
						    <el-switch on-text="开" off-text="关" v-model="form.write"></el-switch>
						  </el-form-item>
					  </template>
					  <el-form-item>
					    <el-button type="primary" :loading="editloading" :disabled="form.id===''" @click="actionpost(detailData.options)">添加</el-button>
					  </el-form-item>
					</el-form>
				</el-card>
				<!-- / add section -->
			</template>
		</el-dialog>
		<!-- / detail component -->
	</section>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import { currentArr, handleBack, findDetailListIndex, showEdit, handleCurrentChange, handleSizeChange, querySearch, handleSelect, handleEdit, initList, handleRoute, getURL } from '../../../../common/common'
	import { filterEmpty, sortByTime, filterDetail, errorMessage } from '../../../../filters/'
	
 	export default {
		data () {
			return {
				title: '',
				searchValue: '',
				isSearched: false,
				isEdit: false,
				mainData: [],
				currentData: [],
				searchList: [],
				detailData: {
					title: '',
					items: [],
					roleid: '',
					options: {},
					label: '',
					placeholder: ''
				},
				action: {
					menu: {
						list: 'allmenus',
						add: {
							api: '/api/addRoleMenu',
							type: 'add'
						},
						del: {
							api: '/api/deleteRoleMenu',
							type: 'delete'
						},
						update: {
							api: '/api/updateRoleMenu',
							type: 'update'
						}
					}
				},
				currentPage: 1,
				totalItems: 0,
				loading: false,
				editloading: false,
				pageSize: 10,
				dialogTableVisible: false,
				form: {
          id: "",
          read: false,
          write: false
       	}
			}
		},
		methods: {
	  	switchValue (value) {
				switch (value) 
				{
					case 0:
						return false
					case 1:
						return true
				}
	  	},
      filterEmpty,
      filterDetail,
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
      handleReset () {
      	// reset 表单
        this.$refs.form.resetFields();
      },
      closeDialog () {
      	this.form.id = ''
      	this.form.read = false
      	this.form.write = false
      	this.isEdit = false
      },
      handleRemoveTag (tag, scope, options) {
      	let _params = {}
      	switch (scope.column.property) {
      		case 'menu':
      			options.tips = '确定要删除这个菜单吗？'
      			options.list = scope.row.rolemenus
      			_params.roleid = scope.row.roleid
      			_params.menuid = tag.menuid
      			break;
      	}
      	// show confirm
      	this.$confirm(options.tips, '提示', {
			    confirmButtonText: '删除',
			    cancelButtonText: '取消',
			    type: 'warning'
			  }).then(() => {
			  	// Yes
			  	// send a request to del
			  	this.$http.get(options.api, {
						before (request) {
							// before request show loading
							this.loading = true
			  		},
			  		params: _params
					}).then((res) => {
							// success
							this.loading = false
							this.$message({
					      type: 'success',
					      message: '删除成功'
					    })
					    options.list.splice(options.list.indexOf(tag), 1);
					}, (err) => {
				  	this.loading = false
				  	// show err message
				  	this.$message({
			        message: err,
			        type: 'error'
			      })
			      // print the err to console
				    console.log(err)
				  });
			  }).catch(() => {
			  	// No
			    this.$message({
			      type: 'info',
			      message: '已取消'
			    })          
			  })
      },
      openEdit (scope, isEdit) {
//    	scope.column
//      scope.$index
//    	scope.row
				this.dialogTableVisible = true
				this.detailData.title = '角色名： ' + scope.row.name
				this.detailData.roleid = scope.row.roleid
				
				if (isEdit) {
					this.isEdit = true
					this.detailData.items = scope.row.rolemenus
					// transf 'read' & 'write' value '1&0' to 'true & false'
					this.detailData.items.forEach(e => {
						for (let key in e) {
							if (key === 'read' || key === 'write') {
								switch (e[key]) 
								{
									case 0:
										e[key] = false
										break
									case 1:
										e[key] = true
										break
								}
							}
						}
					})
					this.detailData.options = this.action[scope.column.property].update
				} else {
					this.detailData.items = this[this.action[scope.column.property].list]
	      	this.detailData.options = this.action[scope.column.property].add
	      	switch (scope.column.property) {
	      		case 'menu':
	      			this.detailData.label = "添加菜单"
	      			this.detailData.placeholder = "请选择要添加的菜单"
	      			break;
	      	}
				}
				this.detailData.options.name = scope.column.property
      },
      actionpost (options, scope) {
      	let _data = {}
      	// set token
      	_data._token = this.token
      	_data.rolemenuArray = {}
      	// switch data
      	switch (options.type) {
      		case 'add':
      			_data.rolemenuArray.roleid = this.detailData.roleid
      			_data.rolemenuArray.menuid = this.form.id
      			_data.rolemenuArray.read = this.form.read ? 1 : 0
      			_data.rolemenuArray.write = this.form.write ? 1 : 0
      			break;
      		case 'update':
      			_data.roleid = this.detailData.roleid
      			_data.menuid = scope.row.menuid
      			_data.rolemenuArray.read = scope.row.read ? 1 : 0
      			_data.rolemenuArray.write = scope.row.write ? 1 : 0
      			break;
      	}
      	this.$http.post(
      		options.api,
      		_data,
		      {
		      	before (request) {
							// before request show loading
							this.editloading = true
						}
		  		}
      	).then(
      		(res) => {
      			// success
      			switch (options.type) {
		      		case 'add':
		      			this.editloading = false
      					this.dialogTableVisible = false
      					
      					// 取出插入数据的 name
		      			let _name = Array.prototype.find.call(this.detailData.items, (e) => {
		      				switch (options.name) {
					      		case 'menu':
						      		this.$message({
							          message: '成功添加了一个菜单',
							          type: 'success'
							        })
					      			return e.id === this.form.id
					      	}
		      			}).name
		      			
		      			// 插入数据 mainData
		      			Array.prototype.forEach.call(this.mainData, (e, i, arr) => {
						  		if (e['roleid'] === this.detailData.roleid) {
						  			switch (options.name) {
						      		case 'menu':
						      			e.rolemenus.push({
								  				name: _name,
								  				menuid: this.form.id,
								  				read: this.form.read ? 1 : 0,
								  				write: this.form.write ? 1 : 0
								  			})
						      			break;
						      	}
						  		}
						  	})
		      			break;
		      		case 'update':
		      			break;
		      	}
      		}, (err) => {
      			this.editloading = false
      			switch (options.type) 
      			{
      				case 'update':
      					switch (scope.column.property) 
		      			{
		      				case 'write':
		      					scope.row.write = !scope.row.write
		      					break
		      				case 'read':
		      					scope.row.read = !scope.row.read
		      			}
      				break
      			}
      			
      			this.$message({
		          message: errorMessage(err.body),
		          type: 'error'
		      	})
      		}
      	)
      }
   	},
   	computed: {
			...mapGetters({
				token: 'getToken',
	    	allmenus: 'getAllmenus',
	    	allrolemenus: 'getAllrolemenus'
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
   		let _this = this
   		
   		let getMenuslist = getURL.call(this, {
   			api: '/api/menuList',
   			set: 'allmenus',
   			copy: 'menuid'
   		})
   		
   		let getRoleMenus = getURL.call(this, {
   			api: '/api/showRoleMenu',
   			set: 'setRoleMenus',
   			copy: 'roleid'
   		})
   		
   		Promise.all([getMenuslist, getRoleMenus]).then(function (resolve) {
   			// set name to the allrolemenus
   			resolve[1].forEach(e => {
   				resolve[0].forEach(f => {
   					if (f.menuid === e.menuid) {
   						e.name = f.name
   					}
   				})
   			})
				initList.call(_this, {
	   			api: '/api/showRole',
	   			additem: [
	   				{
	   					name: 'rolemenus',
	   					id: 'roleid',
	   					std: 'allrolemenus'
	   				}
	   			]
	   		})
			}).catch(function (err) {
			    console.log(err);
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
	.tab-row {
		padding-top: 20px;
		border-bottom: 1px solid #d3dce6; 
		&:last-child {
	    border-bottom: none;
	  }
	}
	.el-card, .el-menu--horizontal .el-submenu>.el-menu, .el-tabs--border-card {
    box-shadow: none;
	}
	.tags {
		margin: 10px 10px 0 0;
		&:last-child {
		}
	}
</style>