<!--
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-21 17:33:57
 * @LastEditors: gaoming wzqf99@foxmail.com
 * @LastEditTime: 2024-04-07 17:36:44
 * @FilePath: \Project_BackEnd\vue-admin-template\src\views\product\Attr\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
        <el-card class="card_one">
            <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
        </el-card>
        <el-card class="card_two">
            <!-- 展示属性的结构 添加属性按钮 展示属性以及属性值的表格 第一部分-->
            <div v-show="isShowTable">
                <!-- 添加属性按钮 -->
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id"
                    @click="releaseAttrValue">添加属性</el-button>
                <!-- 展示属性以及属性值的表格 -->
                <el-table :data="attrList" height="250" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- row代表传入的当前这一项(attrList数组的一个成员(对象))  attrList由多个结构统一的对象构成-->
                            <el-tag style="margin:0px 10px" type="success"
                                v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id">{{
                attrValue.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="180">
                        <template slot-scope="{row,$index}">
                            <!-- 此处row是从服务器拿到的数据  attrList数组的一个成员(对象) 与attrInfo结构大体相同-->
                            <el-button @click="updateAttr(row)" type="warning" icon="el-icon-edit"
                                size="mini">修改</el-button>
                            <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加与修改属性的结构 第二部分-->
            <div v-show="!isShowTable">
                <!-- 收集属性名称 -->
                <el-form :inline="true" :model="attrInfo" class="demo-form-inline">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 添加属性对应的属性值 -->
                <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName"
                    @click="addAttrValue">添加属性值</el-button>
                <el-button @click="isShowTable = true">取消</el-button>
                <!-- 属性值的表格渲染 -->
                <el-table class="addUpdateAttrList" height="180" border style="margin:20px 0px"
                    :data="attrInfo.attrValueList">
                    <el-table-column type="index" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="name" label="属性值名称" width="width">
                        <!-- 查看与编辑模式的切换 -->
                        <template slot-scope="{row,$index}"> <!-- row是当前这一项 -->
                            <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini"
                                @blur="changeToSpan(row)" @keyup.native.enter="changeToSpan(row)" v-if="row.flag"
                                :ref="$index"></el-input>
                            <span v-else @click="changeToInput(row, $index)" style="display:block" width="100%">{{
                row.valueName
            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" width="180">
                        <template slot-scope="{row,$index}"> <!-- row是当前这一项 -->
                            <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                                <!-- 泡泡弹窗 -->
                                <el-button type="danger" icon="el-icon-delete" slot="reference" size="mini">
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button @click="addOrUpdateAttr" type="primary" icon="el-icon-plus"
                    :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'Attr',
    data() {
        return {
            category1Id: '',
            category2Id: '',
            category3Id: '',
            //接收平台属性 是由n个attrInfo对象组成的数组 
            attrList: [],
            //控制table表格展示与隐藏
            isShowTable: true,
            //控制input与span的切换
            isShowInput: true,
            //收集新增属性||修改属性 
            attrInfo: {
                attrName: "", //属性名
                attrValueList: [        //属性值的集合 属性值有多个 因此是数组
                    //{                   // 每一个属性值是一个对象 { attrId: 0, valueName: ""}
                    //    attrId: 0,      //相应的属性名的id
                    //    valueName: ""
                    //}
                ],
                categoryId: 0,        //三级分类的id
                categoryLevel: 3,     //因为服务器也要区分是几级id
            }
        }
    },
    methods: {
        getCategoryId({ categoryId, level }) {
            if (level == 1) {
                this.category1Id = categoryId
                this.category2Id = ''
                this.category3Id = ''
            } else if (level == 2) {
                this.category2Id = categoryId
                this.category3Id = ''
            } else if (level == 3) {
                this.category3Id = categoryId
                //执行完上一局代码，三级id都从子组件中拿到了 可以发请求
                this.getAttrList()
            }
        },
        //获取平台属性的数据
        getAttrList() {
            this.$API.attr.reqAttrList(this.category1Id, this.category2Id, this.category3Id).then(
                (res) => {
                    if (res.code == 200) {
                        console.log('获取属性成功', res.data)
                        this.attrList = res.data
                    }
                }
            )
        },
        //添加属性值的回调
        addAttrValue() {
            //向属性值数组中添加成员
            //data中的attrInfo是没有id这个属性的，但是此处的是row赋值给了attrInfo
            this.attrInfo.attrValueList.push({ //这里的push是重写过的 是响应式的添加的成员身上有getter setter方法
                attrId: this.attrInfo.id, //对于修改已有属性值时需要带上id,这个id是属性的id
                valueName: "",
                flag: true // 给每个属性值添加一个flag 用于切换查看与编辑模式,
            })
            this.$nextTick(() => {
                //获取相应的input表单元素实现聚焦
                this.$refs[this.attrInfo.attrValueList.length - 1].focus()
            })
        },
        //添加属性按钮的回调 
        releaseAttrValue() {
            //展示添加与修改的页面
            this.isShowTable = false
            //重置属性值数组并记录三级id
            this.attrInfo = {
                attrName: "",
                attrValueList: [
                ],
                categoryId: this.category3Id,
                categoryLevel: 3,
            }
        },
        //修改属性按钮的回调
        updateAttr(row) {
            this.isShowTable = false
            console.log('1@', this.attrInfo)
            console.log('2@', row)
            // 首先要明白渲染属性列表用的数据是attrList 
            // 渲染属性值的列表用的数据是attrInfo
            // 如果只是简单的赋值 this.attrInfo = row 那么attrInfo就指向了attrList的一个成员对象row
            // 当修改属性值的时候 修改的是attrInfo的数据 但这时attrInfo指向了attrList
            // 那么当点击取消按钮时，回到属性列表会发现属性列表也发生了变化(因为属性列表用的数据是attrList)

            // this.attrInfo = { ...row }  只有第一层结构是深拷贝(并未指向row),但是内层的对象依然是浅拷贝

            // 给每个元素添加响应式的flag
            row.attrValueList.forEach(element => this.$set(element, 'flag', false));

            //深拷贝将整个对象创建新的内存放置，不会影响到attrList的数据
            this.attrInfo = cloneDeep(row)

        },
        //失去焦点与按下enter的回调 切换为查看模式
        changeToSpan(row) {
            // row是当前添加的属性值(数组的一个成员(对象)) attrInfo.attrValueList
            if (row.valueName.trim() == '') {
                this.$message('请不要输入空格')
                return;
            }
            let isrepeat = this.attrInfo.attrValueList.some((item) => {
                if (row !== item) { //row是新增的属性，
                    // 这里的意思是遍历数组的元素不是 新增的那个元素(当前操作的元素 row) 时 执行下面的代码  
                    // 总结就是判断新增的元素和之前的元素是否有一样的情况 如果有返回true 证明属性值有重复的情况
                    return row.valueName == item.valueName
                }
            })
            if (isrepeat) {
                this.$message('请不要输入重复的属性值')
                return;
            }
            row.flag = false
        },
        // 点击span 切换为可修改模式
        changeToInput(row, index) {
            row.flag = true
            // 不能直接获取 因为点击span的时候,flag变为真 展示input,但是要经过dom节点的重绘(是回调需要时间)
            // 这样就当点击span的时候 就获取不到input
            // 而nextTick是当节点渲染完毕了之后 执行一次其内的回调
            this.$nextTick(() => {
                //获取相应的input表单元素实现聚焦
                this.$refs[index].focus()
            })

        },
        // pop确认框 点击确定时的回调 删除当前这一项
        deleteAttrValue(index) {
            this.attrInfo.attrValueList.splice(index, 1)
        },
        // 保存按钮,进行添加属性或者修改属性的操作
        addOrUpdateAttr() {
            // 整理参数
            // 属性值为空不能提交
            // 要将flag字段删去
            /*  this.$API.attr.reqAddOrUpdateAttr() */
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
                if (item.valueName != '') {
                    delete item.flag
                    return true
                }
            })
            this.$API.attr.reqAddOrUpdateAttr(this.attrInfo).then((res) => {
                if (res.code == 200) {
                    this.$message({ message: '保存成功', type: 'sucess' })
                    this.getAttrList()
                    this.isShowTable = true
                }
            })
        }




        /*  getCategoryId(IdSet) {
             if (IdSet.level == 1) {
                 this.category1Id = IdSet.categoryId
             } else if (IdSet.level == 2) {
                 this.category2Id = IdSet.categoryId
             } else if (IdSet.level == 3) {
                 this.category3Id = IdSet.categoryId
             }
         } */
    }
}
</script>

<style>
.card_one {
    margin: 20px 0px;
}

.card_two {
    margin: 20px 0px;
}
</style>