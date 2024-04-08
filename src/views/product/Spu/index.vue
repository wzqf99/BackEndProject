<!--
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-21 17:34:05
 * @LastEditors: wzqf99 1073626828@qq.com
 * @LastEditTime: 2024-04-06 20:27:27
 * @FilePath: \Project_BackEnd\vue-admin-template\src\views\product\Spu\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
        <template>
            <div>
                <el-card class="card_one">
                    <CategorySelect @getCategoryId="getCategoryId" :show="!show"></CategorySelect>
                </el-card>
                <el-card class="card_two"> <!--三部分进行切换 -->
                    <!-- 第一部分 展示spu列表以及添加按钮 -->
                    <div v-show="scene == 0">
                        <!-- 添加按钮 -->
                        <el-button @click="addSpu" type="primary" icon="el-icon-plus"
                            :disabled="!category3Id">添加SPU</el-button>
                        <!-- spu列表 -->
                        <el-table border style="width: 100%" :data="records">
                            <el-table-column type="index" width="180" align:center>
                            </el-table-column>
                            <el-table-column prop="spuName" label="spu名称" width="180">
                            </el-table-column>
                            <el-table-column prop="description" label="spu描述">
                            </el-table-column>
                            <el-table-column prop="caozuo" label="操作">
                                <template slot-scope="{row,$index}">
                                    <!-- 将来用hintButton替换 -->
                                    <hint-button type="success" icon="el-icon-plus" title="添加sku"></hint-button>
                                    <el-button @click="updateSpu(row)" type="warning" icon="el-icon-edit"
                                        title="修改spu"></el-button>
                                    <el-button type="info" icon="el-icon-warning-outline"
                                        title="查看当前(类)spu全部(实例)sku"></el-button>
                                    <el-button type="danger" icon="el-icon-delete" title="删除spu"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 分页器 -->
                        <el-pagination style="text-align: center" @size-change="handleSizeChange"
                            @current-change="getSpuList" :current-page="page" :page-sizes="[3, 5, 10]"
                            :page-size="limit" layout=" prev,pager,next,jumper,->,sizes,total" :total="total">
                        </el-pagination>
                    </div>
                    <!-- 第二部分 添加spu与修改spu -->
                    <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
                    <!-- 第三部分 修改sku -->
                    <SkuForm v-show="scene == 2"></SkuForm>
                </el-card>
            </div>
        </template>

    </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
    name: "Spu",
    components: {
        SkuForm,
        SpuForm
    },
    data() {
        return {
            category1Id: '',
            category2Id: '',
            category3Id: '',
            show: true,
            page: 1, // 分页器当前第几页
            limit: 3, //每页展示几条数据
            records: [], //spu列表的数据
            total: 0,
            scene: 0 // 0 展示spu列表   1 展示添加spu修改spu 2 展示修改sku
        }
    },
    methods: {
        getSpuList(pages = 1) {
            this.page = pages
            const { page, limit, category3Id } = this
            this.$API.spu.reqSpuList(page, limit, category3Id).then((res) => {
                if (res.code == 200) {
                    console.log(res.data)
                    this.records = res.data.records
                    this.total = res.data.total
                }
            })
        },
        getCategoryId({ categoryId, level }) {
            if (level == 1) {
                this.category1Id = categoryId
                this.category2Id = ''
                this.category3Id = ''
            } else if (level == 2) {
                this.category2Id = categoryId
                this.category3Id = ''
            } else {
                this.category3Id = categoryId
                this.getSpuList()
            }
        },
        handleSizeChange(limit) {
            this.limit = limit
            this.getSpuList()
        },
        // 添加按钮的回调 添加spu
        addSpu() {
            this.scene = 1
        },
        // 修改spu
        updateSpu(row) {
            this.scene = 1
            //在父组件中通过ref获取子组件 可以拿到他的属性 也可以调用他的方法(在其中发请求)
            this.$refs.spu.initSpuData(row)
        },
        // 自定义事件回调 spuForm
        changeScene(scene) {
            this.scene = scene
        }
    }
}
</script>

<style>
.card_two {
    margin: 10px 0
}
</style>