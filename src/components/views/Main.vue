<template>
	<div class="index">
		<app-header></app-header>
		<app-asider></app-asider>
		<app-main></app-main>
		<app-footer></app-footer>
	</div>
</template>
<script>
	import { AppAsider, AppFooter, AppMain, AppHeader } from '../layout/'
	
	export default {
		components: {
			AppAsider,
			AppFooter,
			AppMain,
			AppHeader
		},
		created () {
//			console.log('index')
		}
	}
</script>