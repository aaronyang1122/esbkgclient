import { errorMessage } from '../filters/'

const lazyLoading = (name, index=false) => {
	return resolve => {
		try {
			require.ensure([], () => {
		    resolve(require('../components/views/' + name + (index ? '/index' : '') + '.vue'))
		  })
		}
		catch (e) {
			console.log(e)
			require.ensure([], () => {
		    resolve(require('../components/views/Building.vue'))
		  })
		}
	}
}

const pointerMenuObj = (menu, value) => {
	console.log()
  for (var i = 0; i < menu.length; i++) {
    if (menu[i].name === value) {
      return menu[i]
    } else {
      if (menu[i].hasOwnProperty('children')) {
        return pointerMenuObj(menu[i].children, value)
      }
    }
  }
}

const fullPathArr = (fullpath) => {
	return Array.prototype.filter.call(String.prototype.split.call(fullpath, /\//), (e) => {
  	return e !== ''
  })
}

const currentArr = function (index) {
	index = parseInt(index)
	let _start = (index - 1) * this.pageSize
	let _end = _start + this.pageSize
	return Array.prototype.slice.call(this.mainData, _start, _end)
}

const handleBack = function () {
	this.$router.push({name: this.$route.name, query: { page: 1 }})
	this.searchValue = ''
	this.isSearched = false
}

const findDetailListIndex = function (item) {
	return Array.prototype.findIndex.call(this.detailData, (e) => {
		return e.name === item
	})
}

const showEdit = (name, rules) => {
	return !Array.prototype.some.call(rules, (e, i, arr) => {
		return e === name
	})
}

const options = {
	sex: [
		{
			value: 0,
			label: '男'
		},
		{
			value: 1,
			label: '女'
		}
	],
	usertype: [
		{
			value: 0,
			label: '管理员'
		},
		{
			value: 1,
			label: '普通用户'
		}
	],
	status: [
		{
			value: 0,
			label: '0'
		},
		{
			value: 1,
			label: '1'
		}
	],
	department: [
		{
			value: 0,
			label: '部门-0'
		},
		{
			value: 1,
			label: '部门-1'
		},
		{
			value: 2,
			label: '部门-2'
		},
		{
			value: 3,
			label: '部门-3'
		}
	],
	category: [
		{
			value: "0",
			label: '射击类'
		},
		{
			value: "1",
			label: '情景类'
		},
		{
			value: "2",
			label: '赛车类'
		}
	]
}

const handleDetail = function (index, row, _options) {
	this.detailData = []
	_options.exclude = _options.exclude || []
	for (let key in row) {
		if (!Array.prototype.some.call(_options.exclude, (e) => {
			return e === key
		})) {
			let _obj = {name: key, content: row[key], edit: false, newVaule: '', id: row[_options.id]}
			if (options.hasOwnProperty(key)) {
				_obj.newOptions = options[key]
			}
			this.detailData.push(_obj)
		}
	}
  this.dialogTableVisible = true
}

const handleCurrentChange = function (val) {
	this.currentPage = val
  this.$router.push({name: this.$route.name, query: { page: val }})
  this.currentData = currentArr.call(this, val)
}

const handleSizeChange = function (val) {
	this.pageSize = val
  this.currentData = currentArr.call(this, this.$route.query.page)
}

const createFilter = (queryString) => {
  return (e) => {
    return e.name.indexOf(queryString.toLowerCase()) >= 0;
  }
}

const querySearch = function (queryString, cb) {
  let _data = this.mainData
  let results = queryString ? _data.filter(createFilter(queryString)) : _data
  // callback default param get key is 'value', so we can rewrite it
  results = Array.prototype.map.call(results, (e) => {
  	e.value = e.name
  	return e
  })
  this.searchList = results
  cb(results)
}

const handleSelect = function (item) {
	this.currentData = [item]
	this.isSearched = true
	this.$router.push({name: this.$route.name, query: { search: item.name }})
}

const handleDelete = function (index, row, options) {
	options.remove = options.remove || false
	// first popup a confirm
	this.$confirm(options.tips, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
  	// Yes
  	// start request
  	this.$http.delete(options.api,
        options.data,
		{
			before (request) {
				// before request show loading
				this.loading = true
  		}
		}).then((res) => {
			// close loading
	  	this.loading = false
	  	// change item status to be del
	  	if (options.remove) {
	  		this.$http.get(options.listApi).then(
		  		(res) => {
		  			// refresh mainData success
		  			this.mainData = res.body.content
		  			// refresh currentData
		  			this.currentData = currentArr.call(this, this.$route.query.page)
		  			this.totalItems = res.body.content.length
		  			// show success message
		  			this.$message({
		          message: '删除成功!',
		          type: 'success'
		        })
		  		}, () => {
		  			this.$message({
		          message: '获取数据失败，请刷新浏览器',
		          type: 'error'
		        })
		  		})
	  	} else {
	  		Array.prototype.forEach.call(this.mainData, (e, i, arr) => {
		  		if (e[options.id] === row[options.id]) {
		  			e.status = 1
		  		}
		  	})
	  		
	  		// show success message
		  	this.$message({
	        message: '删除成功!',
	        type: 'success'
	      })
	  	}
	  }, (err) => {
	  	// close loading
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
      message: '已取消删除'
    })          
  })
}

const handleSubmit = function (options) {
	// submit
	this.$refs.form.validate((valid) => {
    if (valid) {
    	// valid success
      this.$http.post(options.api,
      options.data,
      {
      	before (request) {
				// before request show loading
				this.formloading = true
  		}
		}).then((res) => {
			// close loading
	  	this.formloading = false
	  	this.$http.get(options.listApi).then(
	  		(res) => {
	  			// refresh mainData success
	  			this.mainData = res.body.content
	  			// refresh currentData
	  			this.currentData = currentArr.call(this, this.$route.query.page)
	  			this.totalItems = res.body.content.length
	  			// show success message
	  			this.$message({
	          message: '添加成功!',
	          type: 'success'
	        })
	  			// dialog close
	  			this.dialogFormVisible = false
	  		}, () => {
	  			this.$message({
	          message: '获取数据失败，请重试',
	          type: 'error'
	        })
	  		}
	  	)
	  }, (err) => {
	  	// close loading
	  	this.formloading = false
	  	// show err message
	  	this.$message({
        message: errorMessage(err.body),
        type: 'error'
      })
      // print the err to console
	  });
    } else {
      console.log('error submit!!');
      return false;
    }
  })
}

const handleEdit = function (index, row, options) {
	// edit
	if (row.newValue !== undefined) {
		// submit some edit
		var _data = {}
		_data[row.name] = row.newValue
//		'/api/updateUser'
		this.$http.post(options.api,
      options.data,
      {
      	before (request) {
					this.editloading = true
  		}
		}).then((res) => {
			row.newValue = ''
			// success
			this.editloading = false
			// update mainData
	  	Array.prototype.forEach.call(this.mainData, (e, i, arr) => {
	  		if (e[options.id]=== row.id) {
	  			e[row.name] = res.body.content[0][row.name]
	  			e.updatetime = res.body.content[0].updatetime
	  		}
	  	})
	  	// update detailData
	  	this.detailData[findDetailListIndex.call(this, row.name)].content = res.body.content[0][row.name]
	  	// update updatetime
	  	this.detailData[findDetailListIndex.call(this, 'updatetime')].content = res.body.content[0].updatetime
	  	// close edit
	  	row.edit = false
	  	// show success message
	  	this.$message({
        message: '修改成功!',
        type: 'success'
      })
		}, (err) => {
			row.newValue = ''
			this.editloading = false
			// error
			this.$message({
        message: errorMessage(err.body),
        type: 'error'
      })
		})
	} else {
		// check empty
		this.$message({
      message: '您没有输入任何内容，请输入后再提交',
      type: 'warning'
    })
	}
}

const initList = function (options) {
	this.$router.push({name: this.$route.name, query: { page: 1 }})
	// get data
	this.$http.get(options.api, {
		before (request) {
			// before request show loading
			this.loading = true
		}
	}).then((res) => {
		// close loading
		this.loading = false
		// load main data		
		if (options.filter) {
			// filter main data
			options.filter.forEach((item) => {
				res.body.content.forEach((e, i) => {
					res.body.content[i][item.key] = res.body.content[i][item.key] === '' ? [] : res.body.content[i][item.key].split(',')
					res.body.content[i][item.key] = res.body.content[i][item.key].map((k) => {
						let _k = {}
						this[item.std].forEach((l) => {
							if (k === l.name) {
								_k.name = l.name
								_k.id = l[item.id]
							}
						})
						return _k
					})
				})
			})
		} else if (options.additem) {
			options.additem.forEach((item) => {
				// maindata
				res.body.content.forEach((e, i) => {
					e[item.name] = this[item.std].filter(l => e[item.id] === l.id)
				})
			})
		}
		this.mainData = res.body.content
		// static pagination
		this.currentData = currentArr.call(this, this.$route.query.page)
		// return main data's length
		this.totalItems = res.body.content.length
  }, (err) => {
  	// close loading
  	this.loading = false
  	// show err message
  	this.$message({
      message: err,
      type: 'error'
    })
    // print the err to console
    console.log(err)
  });
}

const handleRoute = function () {
	if (this.$route.query.hasOwnProperty('page')) {
		this.currentData = currentArr.call(this, this.$route.query.page)
		this.currentPage = parseInt(this.$route.query.page)
	}
}

const getURL = function (options) {
	let _this = this
  return new Promise(function (resolve, reject) {
		_this.$http.get(options.api,
			{
				before (request) {
					// before request show loading
					_this.loading = true
				}
			}).then(
				(res) => {
					res.body.content.forEach((e) => {
						e.id = e[options.copy]
					})
					_this.$store.dispatch(options.set, res.body.content)
					resolve(res.body.content)
				},
				(err) => {
					_this.$message({
			      message: '获取失败，请刷新重试',
			      type: 'error'
			    })
					console.warn(err)
					reject(err)
				})
  })
}

const formatMenuList = function (list) {
	return Array.prototype.map.call(list, (e, i, arr) => {
		let _item = {}
		let Upcase = (str) => str.replace(/^\S/, (s) => s.toUpperCase())
		_item.name = e.name
		_item.path = e.path
		_item.meta = {
			title: e.name,
			icon: 'el-icon-document'
		}
		_item.component = lazyLoading(Upcase(e.name));
		return _item
	})
}

// Menu should have 2 levels.
const generateRoutesFromMenu = function (menu = [], routes = []) {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.children, routes)
    }
  }
  return routes
}

const requireAuth = (isAuth, store) => {
	return function (to, from, next) {
	  if (isAuth) {
	  	if (to.name === 'main') {
				next({name: store.getters.defaultItem})
			} else {
				next()
			}
	  } else {
	    next({
	    	name: 'signin'
	    })
	  }
	}
}

const _some = function (item) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].name === item && !this[i].hasOwnProperty('children')) {
			return true
		} else {
			if (this[i].children) {
				return _some.call(this[i].children, item)
			}
		}
	}
}

export {
	lazyLoading,
	pointerMenuObj,
	fullPathArr,
	currentArr,
	handleBack,
	findDetailListIndex,
	showEdit,
	handleDetail,
	handleCurrentChange,
	handleSizeChange,
	querySearch,
	handleSelect,
	handleDelete,
	handleSubmit,
	handleEdit,
	initList,
	handleRoute,
	formatMenuList,
	generateRoutesFromMenu,
	requireAuth,
	_some,
	getURL
}
