 <template>
	<section class="index">
		<div id="content" class="app-content">
	  	<div class="app-content-body ">
	  		<router-view></router-view>
			</div>
	 </div>
	</section>
</template>

<script type="text/javascript">
</script>

<style>
	.bg-light.lter, .bg-light .lter {
    background-color: #f6f8f8;
	}
	.b-b {
    border-bottom: 1px solid #dee5e7;
	}
	.wrapper-md {
    padding: 20px;
	}
	.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>