##form清除验证
 watch: {
    'form.productID': function(val) {
      this.form.breedingRecordList = [{ cubsBatch: '', number: '' }];
      this.$nextTick(function() {
        this.$refs.form.clearValidate();
      });
    },
    $route: function() {
      this.setViewPage();
    }
  },
  
   async show(data) {
      this.visible = true;
      this.form = Object.deepClone(this.formModle);
      await this.$nextTick();
      this.$refs.form.clearValidate();
      let userInfo = this.$storage.get('userInfo');
      this.form.person = userInfo.userName;
      this.timeFn();
      if (data) {
        this.editFn(data);
      }
    }

##数组的find方法
  watch: {
    baseID: function(val) {
    
      this.baseInfo = this.baseAry.find(element => element.baseID == val);
     return xxxxx
    }
  },
  ##element v-for加表单验证
    <div class="listitem" v-for="(item,index) in form.enclosureList" :key="index">
          <div class="ihover" v-if="form.enclosureList.length>1" @click="delJs(index)">
            <i class="cjm-icon-reduce "></i>
          </div>
          <cjm-form-item label="圈舍名称" :prop="'enclosureList.' + index + '.value'" :rules="{
      required: true, message: '圈舍名称不能为空', trigger: 'blur'
    }" style="width:90%;">
            <cjm-input type="text" v-model="item.enclosureName"></cjm-input>
          </cjm-form-item>
          <cjm-form-item label="圈舍面积（亩）" :prop="'enclosureList.' + index + '.value'" :rules="{
      required: true, message: '圈舍面积不能为空', trigger: 'blur'
    }" style="width:90%;">
            <cjm-input type="text" v-model="item.enclosureArea"></cjm-input>
          </cjm-form-item>
        </div>
##promise 和async await 
我写过很大型的异步逻辑，中间一层用到Promise.all，同时外层和内层都用await，用非常美观的函数式风格实现，举例如下（该例子先取得一组用户名，然后向数据库查询这些用户的分数，返回其中分数超过50的用户）：

let fn = async () => {
    let loginNames = await getLoginNames();
    let result = (await Promise.all(
        loginNames.map(async name => {
            let user = await db.collection("users").findOne({loginName: name});
    	    return user.score > 50 ? user : null;
        })
    )).filter(m => m !== null);
    return result;
};


    validateForm() {
      return new Promise(resolve => {
        this.$refs.form
          .validate()
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      });
    },
      async submit(callback) {
      const valid = await this.validateForm();
      if (valid) {
        try {
          await this.$refs.recordEdit.submit();
          this.visible = false;
          this.$emit('save-success');
        } catch (err) {}
      }
      callback();
    },
##获取url中的参数
  function getUrlParam(name) {
      //构造一个含有目标参数的正则表达式对象  
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      //匹配目标参数  
      var r = window.location.search.substr(1).match(reg);
      //返回参数值  
      if (r != null) return unescape(r[2]);
      return null;
    };
##vue中解决object中属性改变试图不改变的方法
 1.方案一：利用Vue.set(object,key,val)
 例：Vue.set(vm.obj,'k1','v1')
 2方案二：利用this.$set(this.obj,key,val)
 例：this.$set(this.obj,'k1','v1')
 3方案三：利用Object.assign({}，this.obj)创建新对象
 例：  
this.obj.k1='v1'；
this.obj = Object.assign({}, this.obj)
或
this.obj = Object.assign({}, this.obj,{'k1','v1'})
