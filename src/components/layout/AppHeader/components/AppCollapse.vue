<template>
	<div class="collapse pos-rlt navbar-collapse box-shadow bg-white-only">
		<section class="navbar-right">
			<!--<span class="hidden-sm hidden-md mg-r-15">{{ username }}</span>-->
			<el-button type="primary" size="small" class="navbar-btn" @click="logout">退出</el-button>
		</section>
  </div>
</template>

<script>
	const _init = Object.assign({
		// default params
			user: '游客',
			logout: null
		}, window.initConfig || {})
	
	export default {
		data () {
			return {
				username: _init.user
			}
		},
		methods: {
			logout () {
				_init.logout()
			}
		}
	}
</script>

<style scoped>
	.navbar-btn {
    margin-top: 8px;
    margin-bottom: 8px;
	}
	.mg-r-15 {
    margin-right: 8px;
	}
</style>
