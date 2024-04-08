<!--
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-18 17:27:35
 * @LastEditors: wzqf99 1073626828@qq.com
 * @LastEditTime: 2024-04-06 17:04:54
 * @FilePath: \Project_BackEnd\note.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
   -->

   ### 项目结构
   build
    -index.js
   ### mock
    -模拟的数据
   ### node_modules
    -项目依赖
   ### public
    -静态资源
   ### src
    -api:涉及请求相关
    -assets:放一些静态资源
    -components:全局组件
    -icons:矢量图
    -layout:放置了一些组件和混入
    -router:创建路由实例,完成路由初始化以及相关组件配置
    -store:状态管理仓库vueX

    -utils:
        -auth.js 对外暴露操作cookie与token的函数
        -request.js 对axios二次封装(初始化实例,配置请求拦截器与响应拦截器)
        -validata.js 表单验证
    -views:放置路由组件
    -App.vue:根组件
    ### 
    -main.js:入口文件
    -permissiong.js:鉴权，路由守卫相关
    -settings.js:项目配置项
   
    webpack可检测到的环境 开发环境 生产环境 测试环境 通过process.env得知当前环境
    .env.development:
    .env.production:
    .env.staging:


### 登录功能
#### 一般流程
完成静态组件
获取表单项数据(账号，密码)
在表单组件中派发action(点击登录按钮),
action中引入登录接口函数 login
在action中发出请求(调用login函数)
成功则在响应体中拿到token,commit(调用)mutation中的SET_TOEKN函数
在mutation中保存数据(token)
#### 此处流程
将mock的数据改为真实接口:重写请求接口函数的请求地址(url)
完善请求拦截器和响应拦截器
配置代理跨域(vue.config.js中的deserve proxy )

### 路由搭建
创建路由组件product /Sku /Spu /Attr /TradeMark
对组件进行路由信息注册
结构为 product路径 展示layout组件 整体框架
product下的四个二级路由 /Sku /Spu /Attr /TradeMark
对应展示组件为layout中的 AppMain

### 品牌管理组件TradeMark
#### 品牌列表数据展示
+ 完成获取数据的api
  - 因为端口8510跨域问题,配置一个新的代理
  - 创建一个新的axios实例，将原先的文件(request.js)复制一份为requestBrand.js，只改baseUrl
  - 以这个baseUrl开头的所有请求 在vue.config中配置一个新的proxy代理
  - 将requestBrand.js引入,根据文档书写 发送对应请求api
  - 将四个二级路由组件放到一起,集中暴露api,并且挂在到vue原型上
+ ==用饿了么ui table组件与button组件完成页面==
+ 在组件中直接找到vue原型身上的发送请求的api,发送请求
+ 拿到数据后根据el-table-column渲染数据的规则进行渲染数据
+ 根据el-pagination的事件,完成切换页面的函数 以及 切换当前页渲染条数切换对应的函数
#### 品牌列表数据的添加,修改与删除(以及校验)
+ 用饿了么ui Dialog组件完成添加与修改的模态框(静态)
  - 为修改按钮和添加按钮添加事件 改变dialogFormVisible的值(为true时弹出模态框)
+ 添加品牌与修改品牌流程
  - 书写api
  - 收集表单数据
  - 点击确定按钮时发出请求
    - 详细步骤(添加品牌)
    - 在data中添加tmform 为一个品牌数据的信息
    - api 根据后端接口可知 添加品牌无需带tmform.id,修改品牌需要带上tmform.id
    - 点击添加按钮时唤出模态框,此时需要清除原先tmform的数据
    - 在模态框的表单中输入的数据通过v-model更新到tmform中的tmform.tmName
    - 通过饿了么 组件el-upload的action属性上传图片(通过发请求),将返回的数据res.data(图片地址)记录到tmform.logoUrl
    - 当点击确定按钮后,带着tmform,发送添加数据的请求
    - 详细步骤(修改品牌)
    - 当点击修改按钮时,通过作用域插槽将row(当前这一项品牌数据信息)传入要调用的函数中,更新tmform的值
    - 当点击去顶按钮后,带着tmform,发送修改数据的请求
    - ==添加品牌和修改品牌都在点击确定按钮的事件中，所以要通过是否携带tmfrom.id来判断发送哪个请求==
+ 删除品牌流程
    - 书写api
    - 在组件中书写点击删除按钮时触发的函数(通过插件将row/当前数据传入)
    - 拿到当前这条数据的id,调用删除请求,响应成功后调用发送获取当前页数据的亲够 
+ 为表单添加校验规则

  - 为要添加校验规则的表单标签el-form添加:rules="rules"属性 与此对应的rules数据(验证规则)放到data中
  - 给el-form的子节点 待验证项el-form-item添加prop="tmName" tmName即rules数据的成员
  - 通过给表单标签打上ref,通过ref拿到要验证真实节点
  - this.$refs.form.validate((success)=>{if(success){}else{} }) success即验证的结果
  - 自定义验证
### 平台属性管理组件Attr
#### 组件(三级联动组件和属性展示组件)
##### 三级联动
+ 将三级联动组件封装为一个全局组件(静态)
  - 在components文件中创建一个文件CategorySelect
  - 在main.js中引入组件并实例化
      import CategorySelect from '@/components/CategorySelect
      Vue.component(CategorySelect.name, CategorySelect)
  - 在attr组件中引入CategorySelect组件<CategorySelect></CategorySelect>
  - categorySelect组件中使用 饿了么 表单组件完成静态
+ 三级联动动态组件
  - 写获取三级数据对应的三个请求 
  - 当加载CategorySelect组件时,在mounted钩子中发送第一个请求,拿到第一级数据,通过v-for渲染数据
  - 当第一个下拉框中的el-option的值发生变化时,发送第二个请求,拿到第二级数据,通过v-for渲染数据
  - 当第二个下拉框中的el-option的值发生变化时,发送第三个请求,拿到第三级数据,通过v-for渲染数据
  - ==收集三级数据的id==
    - 给el-form设置:model="cForm"
    - 给el-select设置v-model="cForm.category1Id"
    - 动态获取el-option的value值 :value="c1.id"
  - 通过自定义事件将三级id传给父组件Attr
##### 属性展示
###### 完成属性展示的静态组件(包含的元素)
+ 两个主要部分(属性展示)(增加与修改属性)
+ 属性展示
  - 添加属性的按钮(el-button)
  - 属性展示的表格(el-table)
    - 表格第三个元素包含着el-tag
    - 表格第四个元素包含==修改属性与删除属性按钮==
+ 增加与修改属性
  - 获取属性值的表单
  - 展示属性值数组的表格
  - 添加,保存和取消的按钮
###### 属性展示的动态部分
+ 当在categorySelect中拿到一二三级分类的id后,发出请求拿到对应属性的数据
+ 属性展示部分
  - 将属性在el-table中展示
    - 对于tag部分,通过插槽将当前这项(数组的一个成员)的数据传入el-tag中 通过v-for遍历这项的attrValueList(由n个属性值对象组成的数组)生产对应数量的tag
+ 增加与修改属性部分
  - 增加与修改共用同一个模板(addUpdateAttrList组件,别名)
  - 新属性的流程 (数据源是attrInfo,结构上是请求回来数据attrList(数组)的每一个对象的一个成员(数组))
    - 获取属性名(v-model)
    - 点击添加属性按钮,切换到添加属性值的组件
    - 点击添加属性值按钮,对应表格会出现当前要添加项(属性值的收集用表单el-input,通过插槽将数据传入,然后v-model双向绑定)
    - 每点击一次添加属性值按钮,就会向属性对应的==属性值数组==中添加(push)一个属性值对象(valueName置为空,当输入时通过v-model获取数据)
  - 增加与修改时,取消了本次添加,再次添加时上一次的数据没有清理
    - 解决方案
      - 当点击==添加按钮==属性时==重置属性值==数组,同时记录三级数据的id
  - 修改属性的流程 (数据源是请求回来的数据attrList)
    - 修改属性需要通过插槽将当前项的数据==属性渲染表的数据attrList==传入
    - 然后将数据通过深拷贝赋值给attrInfo(响应式数据),深拷贝不影响原来的数据attrList,所以当在ddUpdateAttrList组件修改了数据但未保存的情况下返回属性展示页面,属性以及属性值tag也不会因为响应式联动而改变
    - 然后就能在==addUpdateAttrList组件==中渲染出来
+ 增加与修改==addUpdateAttrList组件==的查看与编辑模式切换
  - 
  
### SPU组件(除了三级联动部分,有三部分内容)
#### spu列表展示
+ 静态
+ 动态展示
  -
#### 添加spu&&修改spu
#### 添加sku 