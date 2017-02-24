<!--suppress ALL -->
<template>
	<section :class="[className,{error: error.show}]">
		<label :for='randId'v-if="showLabel">{{label}}</label>
		<div class="input-wrap">
			<input class="form-control no-border no-bg" :placeholder="placeholder" :id="randId" v-type="type" :value="value" v-model='currentValue' v-required="required" />
			<span class="simulated-placeholder" v-if="simulatedPlaceholder" v-show="placeholderTriger">{{placeholder}}</span>
			<a href="" class="icon-close" @click.prevent v-clear="currentValue" v-show="showClear"></a>
      <transition name='slide-fade'>
        <div v-if="error.show" class="error-text">{{error.text}}</div>
      </transition>
		</div>
	</section>
</template>
<script>
	import randString from 'randString'

	export default {
//		props: ['className', 'init', 'required', 'label', 'placeholder', 'clearButton', 'minLength', 'suggestion'],
		props: {
			value: null,
			label: {
				type: String
			},
			className: {
				type: String
			},
			required: {
				type: Boolean
			},
			placeholder: {
				type: String,
				default: ''
			},
			clearButton: {
				type: Boolean,
				default: false
			},
			suggestion: {
				type: Boolean,
				default: false
			},
			minLength: {
				type: Number,
				default: 0
			},
			type: {
				type: String,
				default: 'text'
			}
		},
		data () {
			return {
				placeholderTriger: true,
				currentValue: this.value,
				error: {
				  show: false,
				  text: ''
				}
			}
		},
		computed: {
			showClear () {
				return this.currentValue !== '' && this.clearButton;
			},
			randId () {
				return randString(['letter', 'number'], 32);
			},
			showLabel () {
				if (this.label === undefined) {
					return false;
				} else {
					return true;
				}
			},
			simulatedPlaceholder () {
				// 兼容 IE9
				return !('placeholder' in document.createElement('input'));
			}
		},
		methods: {
			checkValue () {
				if (this.required) {
					this._isEmpty(this._isMin);
				} else {
					this._isMin();
				}
			},
			_isEmpty (callback) {
			  if (this.currentValue.length === 0) {
				  this.error.show = true;
				  this.error.text = '此处不能为空';
				} else {
					this.error.show = false;
				  this.error.text = '';
				  if (callback !== void 0) {
				    callback();
				  } else {
				    return false;
				  }
				}
			},
			_isMin (callback) {
			  if (this.currentValue.length < this.minLength) {
			    this.error.show = true;
				  this.error.text = '输入字符数小于 ' + this.minLength;
			  } else {
			  	this.error.show = false;
				  this.error.text = '';
			   if (callback !== void 0) {
				    callback();
				 } else {
				   return false;
				 }
			  }
			},
			updateValue: function (value) {
	      this.$emit('input', value)
	    }
		},
		directives: {
			required: {
				bind (el, binding) {
//					console.log(binding.value)
					if (binding.value === true) {
						el.setAttribute('required', 'required');
					}
				}
			},
			clear: {
				bind (el, binding, vnode) {
					el.addEventListener('click', function () {
					  el.parentNode.firstChild.focus();
						vnode.context.currentValue = '';
					})
				}
			},
			type: {
				bind (el, binding, vnode) {
					el.setAttribute('type', binding.value);
				}
			}
		},
		watch: {
			currentValue (val, oldVal) {
			  // 检查 currentValue 是否为空
				if (val !== '') {
					this.placeholderTriger = false;
				} else {
					this.placeholderTriger = true;
				}
				// dispath value
				this.updateValue(val);
			}
		},
		created () {
			if (this.currentValue !== '') {
				this.placeholderTriger = false;
			} else {
				this.placeholderTriger = true;
			}
		}
	}
</script>

<style scoped>
  .slide-fade-enter-active {
	  transition: all .3s ease;
	}
	.slide-fade-leave-active {
	  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-active {
	  padding-left: 10px;
	  opacity: 0;
	}
	.input-wrap{
		position: relative;
	}
	.input-wrap input{
		position: relative;
		z-index: 1;
	}
  /* IE10+ */
	::-ms-clear {
	  display: none;
	}
	.simulated-placeholder{
		position: absolute;
		top: 6px;
		left: 12px;
		z-index: 0;
		opacity: 0.5;
		filter: alpha(opacity=50);
	}
	.input-wrap .icon-close{
		color: #ddd;
		position: absolute;
		right: 0;
		top: 10px;
		z-index: 1;
	}
	.error .error-text{
	  color: red;
	}
	.error .input-wrap input{
	  border:1px solid red;
	}
</style>
