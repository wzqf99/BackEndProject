<template>
    <div>
        <!-- :inline="true"表元素行内 -->
        <el-form :inline="true" class="demo-form-inline" :model="cForm">
            <el-form-item label="一级分类"> <!-- 饿了么组件 el-select原生的事件change,选中值发生变化时触发 -->
                <el-select :disabled="show" placeholder="请选择" v-model="cForm.category1Id" @change="handler1">
                    <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in list1" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select :disabled="show" placeholder="请选择" v-model="cForm.category2Id" @change="handler2">
                    <el-option :label="c2.name" :value="c2.id" v-for="(c2, index) in list2" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select :disabled="show" placeholder="请选择" v-model="cForm.category3Id" @change="handler3">
                    <el-option :label="c3.name" :value="c3.id" v-for="(c3, index) in list3" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CategorySelect',
    props: ['show'],
    data() {
        return {
            //一级分类的数据
            list1: [],
            //二级分类的数据
            list2: [],
            //三级分类的数据
            list3: [],
            //收集一级二级三级分类的id
            cForm: {
                category1Id: '',
                category2Id: '',
                category3Id: '',
            }
        }
    },
    mounted() {
        this.getCategoryList()
    },
    methods: {
        //获取一级分类数据的方法
        getCategoryList() {
            this.$API.attr.reqCategory1List().then(
                (res) => {
                    if (res.code == 200) {
                        console.log('@', res.data)
                        this.list1 = res.data
                    }
                }
            )
        },
        //一级分类的select事件回调,当一级分类的option发生变化时获取二级分类的数据
        handler1() {
            //清理数组是清理上一次的值
            this.list2 = []
            this.list3 = []
            //清理id是清理页面上二级分类和三级分类的值？ 
            //v-model="cForm.category1Id" 获取的是el-option的value值,清理掉id值由于双向绑定 页面上的值也就为空了
            this.cForm.category2Id = ''
            this.cForm.category3Id = ''

            const { category1Id } = this.cForm
            this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
            this.$API.attr.reqCategory2List(category1Id).then(
                (res) => {
                    if (res.code == 200) {
                        this.list2 = res.data
                        console.log('@@', res.data)
                    }
                }
            )
        },
        //二级分类的select事件回调,获取三级分类的数据
        handler2() {
            this.list3 = []
            this.cForm.category3Id = ''
            const { category2Id } = this.cForm
            this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
            this.$API.attr.reqCategory3List(category2Id).then(
                (res) => {
                    if (res.code == 200) {
                        this.list3 = res.data
                        console.log('@@@', res.data)
                    }
                }
            )
        },
        //三级分类的select事件回调
        handler3() {
            const { category3Id } = this.cForm
            this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
            console.log('已经获取到三级数据')
        }
    },
}
</script>

<style></style>