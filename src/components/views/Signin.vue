<template>
	<div class="container w-xxl w-auto-xs">
		<a href="" class="navbar-brand block m-t">登录</a>
		<div class="m-b-lg">
			<div class="wrapper text-center">
				<strong>智视官网后台管理系统</strong>
			</div>
			<form name="form" class="form-validation">
				<!--<div class="text-danger wrapper text-center">{{message.error}}</div>-->
				<div class="list-group list-group-sm">
					<div class="list-group-item">
						<match-box :clear-button="form.username.clear" :placeholder="form.username.placeholder" v-model="form.username.value" :required="true"></match-box>
					</div>
					<div class="list-group-item">
						<match-box :clear-button="form.password.clear" :placeholder="form.password.placeholder" v-model="form.password.value" :required="true" :type="form.password.type"></match-box>
					</div>
				</div>
			</form>
			<button type="submit" class="btn btn-lg btn-primary btn-block" :loading="loading" @click="submit">登 录</button>
		</div>
		<div class="text-center">
			<p>
				<small class="text-muted">Web app framework base on Bootstrap and Vue<br>© 2017</small>
			</p>
		</div>   
	</div>
</template>
<script>
	import matchBox from '../plugin/MatchBox.vue';
	import store from '../../store';

	export default {
		data () {
			return {
				result: {},
				loading: false,
				form: {
					username: {
						placeholder: '用户名',
						value: '',
						clear: true
					},
					password: {
						placeholder: '密码',
						value: '',
						clear: true,
						type: 'password'
					}
				}
			}
		},
		components: {
			matchBox
		},
		methods: {
			submit () {
				this.test = this.$store.state.login.custom
				// ie9
				if (this.form.username.value === '' || this.form.password.value === '') {
					// throw error
	//  			this.message.error = '用户名、密码不能为空';
					this.$message({
					  message: '用户名、密码不能为空',
					  type: 'error'
					});
				} else {
					this.$http.post(
						'/api/auth',
						{
							username: this.form.username.value,
							password: this.form.password.value
						},
						{
							before (request) {
								this.loading = true
							},
							emulateJSON: true
						}
					).then(
						(res) => {
							switch (res.body.isAuthed) {
								case 0:
								    this.$message({
                                        message: "用户名或密码错误，请重新再试",
                                        type: 'error'
                                    })
                                    break;
                                case 1:
                                    store.dispatch('setLoginStatus', true).then(() => {
                                        this.$router.push({ path: '/' })
                                    })
                                    break;
							}
						},
						(err) => {
							this.loading = false
							// error
							this.$message({
								message: err.body,
								type: 'error'
							})
						}
					)
				}
			}
		},
		watch: {
//			'form.username.value' (val, oldVal) {
//				console.log(val)
//			}
		},
		created () {
//			console.log(this.$store.getters.doneTodos)
		}
	}

</script>

<style>
	.w-xxl {
    width: 360px;
	}
	@media (min-width: 1200px)
	.container {
    width: 1170px;
	}
	@media (min-width: 992px)
	.container {
    width: 970px;
	}
	@media (min-width: 768px)
	.container {
    width: 750px;
	}
	.container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
	}
	*{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
	}
	.navbar-brand {
    display: inline-block;
    float: none !important;
    height: auto;
    padding: 0 20px;
    font-size: 20px;
    font-weight: 700;
    line-height: 50px;
    text-align: center;
	}
	.m-t {
    margin-top: 15px;
	}
	.block {
    display: block;
	}
	.wrapper {
    padding: 15px;
	}
	.text-center {
    text-align: center;
	}
	.list-group {
    border-radius: 2px;
	}
	.list-group {
    padding-left: 0;
    margin-bottom: 20px;
	}


.list-group-item {
    position: relative;
    display: block;
    padding: 10px 15px;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid #ddd;
}
.list-group-item {
    padding-right: 15px;
    border-color: #e7ecee;
}
	.list-group-sm .list-group-item {
    padding: 6px 10px;
}
.list-group-item:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.btn-primary {
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
}
.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}
input, button, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}
.btn-block {
    padding-right: 12px;
    padding-left: 12px;
}
.btn-primary {
    color: #ffffff !important;
    background-color: #7266ba;
    border-color: #7266ba;
}
.btn {
    font-weight: 500;
    border-radius: 2px;
    outline: 0!important;
}
.btn-block {
    display: block;
    width: 100%;
}
.btn-lg, .btn-group-lg > .btn {
    padding: 10px 16px;
    font-size: 18px;
    line-height: 1.3333333;
    border-radius: 6px;
}
.form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}
.form-control {
    border-color: #cfdadd;
    border-radius: 2px;
    border: none;
}
</style>