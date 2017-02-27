<template>
	<aside id="aside" class="app-aside hidden-xs bg-dark">
      <div class="aside-wrap">
        <div class="navi-wrap">
					<el-menu :default-active="currentItem" @open="handleOpen" @close="handleClose" theme="dark" :router="true">
						<template v-for="(item, index) in menu">
							<!-- has subitems -->
							<el-submenu :index="item.name" v-if="item.children && item.children.length">
				      	<template slot="title"><i :class="item.meta.icon"></i>{{item.meta.title}}</template>
				      	<template v-for="(subItem, subIndex) in item.children">
				      		<template v-if="subItem.hasOwnProperty('children')">
				      			<el-submenu index="subItem.name">
						          <template slot="title">{{subItem.meta.title}}</template>
						          <el-menu-item v-for="(thdItem, thdIndex) in subItem.children" :index="thdItem.name" :route="{path: item.path + '/' + subItem.path + '/' + thdItem.path}">{{thdItem.meta.title}}</el-menu-item>
						        </el-submenu>
				      		</template>
				      		<template v-else>
				      			<el-menu-item-group>
						      		<el-menu-item :index="subItem.name" :route="{path: item.path + '/' + subItem.path}">{{subItem.meta.title}}</el-menu-item>
					      		</el-menu-item-group>
				      		</template>
				      	</template>
				      </el-submenu>
				      <!-- else -->
				      <el-menu-item :index="item.name" v-else :route="{path: item.path}"><i :class="item.meta.icon"></i>{{item.meta.title}}</el-menu-item>
						</template>   
			   	</el-menu>
        </div>
      </div>
  </aside>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import { pointerMenuObj, fullPathArr } from '../../common/common'
	
  export default {
  	computed: {
			...mapGetters({
	    	menu: 'menuitems',
	    	currentItem: 'defaultItem'
	  	})
  	},
    methods: {
      handleOpen (key, keyPath) {
//      console.log(key, keyPath, this.$route);
      },
      handleClose (key, keyPath) {
//      console.log(key, keyPath);
      }
    },
	  created () {
  			this.$store.dispatch('setDefaultItem', this.$route.name)
	  },
	  watch: {
			'$route' () {
				this.$store.dispatch('setDefaultItem', this.$route.name)
			}
		}
  }
</script>

<style>
	.el-menu-item-group__title {
		padding-top: 0px;
	}
</style>