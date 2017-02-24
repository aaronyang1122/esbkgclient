<template>
  <header id="header" class="app-header navbar">
  	<app-nav-bar></app-nav-bar>
  	<app-collapse></app-collapse>
  </header>
</template>

<script>
	import { AppCollapse, AppNavBar } from './components/'
	export default {
	  components: {
	    AppCollapse,
	    AppNavBar
	  }
	}
</script>
