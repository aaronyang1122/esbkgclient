const filterEmpty = (row, column) => {
	switch (column.property) {
		case 'level':
		 return filterLevel(row[column.property])
	}
	switch (row[column.property]) 
	{
		case null:
		case '':
			return '—'
		default:
			return row[column.property]
	}
}

const filterDetail = (name, content) => {
	if (content === null || content === '') {
		return '—'
	} else {
		switch (name) {
			case 'sex':
				return filterSex(content);
			case 'usertype':
				return filterUsertype(content);
			default:
				return content
		}
	}
}

const filterSex = (e) => {
	switch (e) {
		case 0:
			return "男";
		case 1:
			return "女";
		default:
			return e
	}
}

const filterUsertype = (e) => {
	switch (e) {
		case 0:
			return "管理员";
		case 1:
			return "普通用户";
		default:
			return e
	}
}

const filterLevel = (e) => {
	switch (e) {
		case 0:
			return "一级菜单";
		case 1:
			return "二级菜单";
		default:
			return e
	}
}

const filterRowDisable = (row, index) => {
  if (row.status === 1) {
    return 'disable';
  }
  return '';
}

const errorMessage = (err) => {
	let _code = encodeURIComponent(err).match(/(SQLSTATE%5B)(\d*)%5D/)[2]
	let _item = encodeURIComponent(err).match(/(%26%23039%3Buq_)(\w*)%26%23039%3B/)[2]
	let _str = ''
	switch (_code) {
		case '42S22':
		_str = '提交表单含未知项';
		break;
		case '23000':
		_str = '数据库中已有此';
		break;
		default:
		_str = _code
	}
	switch (_item) {
		case 'name':
		_str += '用户名';
		break;
		case 'sndaid':
		_str += '盛大ID';
		break;
		case 'email':
		_str += 'email';
		break;
		default:
		_str += _item
	}
	return _str
}

const sortByTime = (data) => {
	// 根据创建时间由高到低排序
	return Array.prototype.sort.call(data, (a, b) => {
		let exp = new RegExp('(\\d{1,4})|(\\d{2,4})', 'g');
		let arr1 = a.createtime.match(exp)
		let arr2 = b.createtime.match(exp)
		let d1 = new Date(arr1[0], arr1[1], arr1[2], arr1[3], arr1[4], arr1[5])
		let d2 = new Date(arr2[0], arr2[1], arr2[2], arr2[3], arr2[4], arr2[5])
		return d2.getTime() - d1.getTime()
	})
}

export {
	filterEmpty,
	filterRowDisable,
	errorMessage,
	sortByTime,
	filterDetail
}
