<template>
	<section class="role-management">
		<div class="bg-light lter b-b wrapper-md"><h1 class="m-n font-thin h3">日志查看</h1></div>
		<div class="wrapper-md">
		  <el-row>
	  		<el-input placeholder="请输入需要查找的关键词" v-model="searchBar" style="width: 100%">
			    <el-button slot="append" icon="search"></el-button>
			  </el-input>
		  </el-row>
		  <el-table :data="tableData" stripe style="width: 100%">
		    <el-table-column prop="operation" label="操作项"></el-table-column>
		    <el-table-column prop="operator" label="操作者"></el-table-column>
		    <el-table-column prop="date" label="时间"></el-table-column>
		    <el-table-column inline-template :context="_self" label="操作状态">
		    	<div>
		    		<el-tag type="success">成功</el-tag>
		    		<el-tag type="warning">警告</el-tag>
		    		<el-tag type="danger">失败</el-tag>
		    	</div>
		    </el-table-column>
		    <el-table-column inline-template :context="_self" label="操作" min-width="30">
			    <div>
	        	<el-button size="small":plain="true" type="primary" @click="handleEdit($index, row)">详细</el-button>
	      	</div>
		  	</el-table-column>
		  </el-table>
		</div>
	</section>
</template>

<script>
	export default {
		data () {
			return {
				searchBar: '',
				tableData: [
					{
						operation: 'View',
						operator: 'yangjian',
						date: '2016/11/26',
						status: 'success'
					},
					{
						operation: 'View',
						operator: 'yangjian',
						date: '2016/11/26',
						status: 'success'
					}
				]
			}
		},
		methods: {
      handleEdit (index, row) {
        console.log(index, row);
      },
      handleDelete (index, row) {
        console.log(index, row);
      }
    }
	}
</script>