<template>
	<section class="user-rights">
		<div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">用户映射</h1></div>
		<div class="wrapper-md">
			<!-- search bar -->
		  <el-row>
			  <el-autocomplete class="inline-input" v-model="searchValue" :fetch-suggestions="querySearch" placeholder="请输入要查询的用户名" :trigger-on-focus="false"  @select="handleSelect" style="width: 100%;">
			  	<!--<el-button slot="append" icon="search" @click="test"></el-button>-->
			  </el-autocomplete>
		  </el-row>
		  <!-- / search bar -->
		  
		  <!-- table -->
		  <el-row>
		  	<el-table :data="currentData" v-loading.body="loading" style="width: 100%" border>
			    <el-table-column prop="name" label="姓名" :formatter="filterEmpty" width="200"></el-table-column>
			    <el-table-column prop="departmentname" label="部门" :formatter="filterEmpty" width="200"></el-table-column>
			    <el-table-column label="关联角色" prop="role">
			    	<template scope="scope">
			    		<!-- tags -->
			    		<el-tag v-for="tag in scope.row.rolesname" :closable="true" type="primary" :key="tag" :close-transition="false" @close="handleRemoveTag(tag, scope, action.role.del)" class="tags">
								{{tag.name}}
							</el-tag>
							<!-- / tags -->
			        <el-button size="mini" type="primary" icon="plus" @click="openEdit(scope)" style="margin: 10px 0;">添加</el-button>
			      </template>
			    </el-table-column>
			    <el-table-column label="关联游戏" prop="game">
						<template scope="scope">
							<!-- tags -->
							<el-tag v-for="tag in scope.row.gamesname" :closable="true" type="primary" :key="tag" :close-transition="false" @close="handleRemoveTag(tag, scope, action.game.del)" v-on:click="a(scope)" class="tags">
								{{tag.name}}
							</el-tag>
							<!-- / tags -->
							<el-button size="mini" type="primary" icon="plus" @click="openEdit(scope)" style="margin: 10px 0;">添加</el-button>
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
			<el-card class="box-card">
		  	<!-- tab1 -->
			  	<el-form ref="form" :inline="false" label-width="100px" style="width: 100%">
					  <el-form-item :label="detailData.label">
					    <el-select v-model="form.id" :placeholder="detailData.placeholder">
					      <el-option v-for="(item, index) in detailData.items" :label="item.name" :value="item.id"></el-option>
					    </el-select>
					  </el-form-item>
					  
					  <template v-if="detailData.options.name === 'game'">
					  	<el-form-item label="读权限" >
						    <el-switch on-text="开" off-text="关" v-model="form.read"></el-switch>
						  </el-form-item>
						  <el-form-item label="写权限" >
						    <el-switch on-text="开" off-text="关" v-model="form.write"></el-switch>
						  </el-form-item>
					  </template>
					  
					  <el-form-item>
					    <el-button type="primary" :loading="editloading" :disabled="form.id===''" @click="actionAdd(detailData.options)">添加</el-button>
					  </el-form-item>
					</el-form>
			  <!-- / tab1 -->
			</el-card>
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
				mainData: [],
				currentData: [],
				searchList: [],
				detailData: {
					title: '',
					items: [],
					userid: '',
					options: {},
					label: '',
					placeholder: ''
				},
				action: {
					role: {
						list: 'allroles',
						add: {
							api: '/api/addUserRole'
						},
						del: {
							api: '/api/deleteUserRole'
						}
					},
					game: {
						list: 'allgames',
						add: {
							api: '/api/addUserGame'
						},
						del: {
							api: '/api/deleteUserGame'
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
      },
      handleRemoveTag (tag, scope, options) {
      	let _params = {}
      	switch (scope.column.property) {
      		case 'role':
      			options.tips = '确定要删除这个角色吗？'
      			options.list = scope.row.rolesname
      			_params.uid = scope.row.userid
      			_params.rid = tag.id
      			break;
      		case 'game':
      			options.tips = '确定要删除这个游戏吗？'
      			options.list = scope.row.gamesname
      			_params.userid = scope.row.userid
      			_params.gameid = tag.id
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
      openEdit (scope) {
//    	scope.column
//      scope.$index
//    	scope.row
console.log(scope)
      	this.dialogTableVisible = true
      	this.detailData.title = '用户名： ' + scope.row.name
      	this.detailData.items = this[this.action[scope.column.property].list]
      	
      	this.detailData.options = this.action[scope.column.property].add
      	this.detailData.options.name = scope.column.property
      	this.detailData.userid = scope.row.userid
      	switch (scope.column.property) {
      		case 'role':
      			this.detailData.label = "添加角色"
      			this.detailData.placeholder = "请选择要添加的角色"
      			break;
      		case 'game':
      			this.detailData.label = "添加游戏"
      			this.detailData.placeholder = "请选择要添加的游戏"
      			break;
      	}
      },
      actionAdd (options) {
      	let _data = {}
      	// set token
      	_data._token = this.token
      	
      	// switch data
      	switch (options.name) {
      		case 'role':
      			_data.userroleArray = {}
      			_data.userroleArray.userid = this.detailData.userid
      			_data.userroleArray.roleid = this.form.id
      			break;
      		case 'game':
      			_data.userGameArray = {}
      			_data.userGameArray.userid = this.detailData.userid
      			_data.userGameArray.gameid = this.form.id
      			_data.userGameArray.read = this.form.read ? 1 : 0
      			_data.userGameArray.write = this.form.write ? 1 : 0
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
      			this.editloading = false
      			this.dialogTableVisible = false
      			
      			// 取出插入数据的 name
      			let _name = Array.prototype.find.call(this.detailData.items, (e) => {
      				switch (options.name) {
			      		case 'role':
				      		this.$message({
					          message: '成功添加了一个角色',
					          type: 'success'
					        })
			      			return e.roleid === this.form.id
			      		case 'game':
			      			this.$message({
					          message: '成功添加了一个游戏',
					          type: 'success'
					        })
			      			return e.gameid === this.form.id
			      	}
      			}).name
      			
      			// 插入数据 mainData
      			Array.prototype.forEach.call(this.mainData, (e, i, arr) => {
				  		if (e['userid'] === this.detailData.userid) {
				  			switch (options.name) {
				      		case 'role':
				      			e.rolesname.push({
						  				name: _name,
						  				id: this.form.id
						  			})
				      			break;
				      		case 'game':
				      			e.gamesname.push({
						  				name: _name,
						  				id: this.form.id
						  			})
				      			break;
				      	}
				  		}
				  	})
      		}, (err) => {
      			this.editloading = false
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
	    	allroles: 'getAllroles',
	    	allgames: 'getAllgames'
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
   		
   		let getGameslist = getURL.call(this, {
   			api: '/api/gameList',
   			set: 'allgames',
   			copy: 'gameid'
   		})
   		
   		let getRoleslist = getURL.call(this, {
   			api: '/api/showRole',
		   	set: 'allroles',
		   	copy: 'roleid'
   		})
   		
   		Promise.all([getGameslist, getRoleslist]).then(function () {
				initList.call(_this, {
	   			api: '/api/showUserAuth',
	   			filter: [
	   				{
	   					key: 'rolesname',
	   					id: 'roleid',
	   					std: 'allroles'
	   				},
	   				{
	   					key: 'gamesname',
	   					id: 'gameid',
	   					std: 'allgames'
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