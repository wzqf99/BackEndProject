<template>
    <div>
        <el-form ref="form" label-width="80px" v-model="spu">

            <el-form-item label="SPU名称"> <!-- spu名称 表单 -->
                <el-input placeholder="spu名称" v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌"> <!-- 下拉框 -->
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option v-for="(arr, index) in tradeMarkList" :key="arr.id" :label="arr.tmName" :value="arr.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述"> <!-- spu描述 表单域 -->
                <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
            </el-form-item>
            <el-form-item label="图片"> <!-- spu图片 照片墙 -->
                <!-- file-list是图片数据的对象数组,每个对象都要有name和url字段  on-preview预览图片触发，on-remove删除图片触发 -->
                <el-upload action="/brand-api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性"> <!-- 表格 -->
                <el-select :placeholder="`还有${unSelectAttr.length}条未选择`" v-model="attrId">
                    <el-option v-for="(unselect, index) in unSelectAttr" :key="unselect.id" :label="unselect.name"
                        :value="unselect.id">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
                <el-table :data="spu.spuSaleAttrList" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="180">
                    </el-table-column>
                    <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
                        <template slot-scope="{row,$index}">
                            <el-tag :key="tag.id" v-for="tag in row.spuSaleAttrValueList" closable
                                :disable-transitions="false" @close="handleClose(tag)">{{ tag.saleAttrValueName }}
                            </el-tag>
                            <!-- 编辑模式中的输入模式 -->
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                                ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm">
                            </el-input>
                            <!-- 编辑模式中的展示模式 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">
                                + New Tag
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作">
                        <el-button type="danger" icon="el-icon-delete"></el-button>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">保存</el-button>
                <el-button type="danger" @click="$emit('changeScene', 0)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Item from '@/layout/components/Sidebar/Item.vue';

export default {
    name: 'SpuForm',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            tradeMarkList: [], //存储品牌信息
            spuImageList: [], //存储spu图片的数据
            saleAttrList: [], // 销售属性列表
            brand: '',
            attrId: '',
            // 当点击修改时 向服务器发起请求 覆盖原数据(数据结构基本一致)
            // 当点击添加时 直接用spu这个
            spu: { //修改spu时发请求需要上传的数据
                "category3Id": 0,
                "spuName": "string",
                "description": "string",
                /*  "id": 0, */
                // 品牌id
                "tmId": 0,
                // spu图片的数据
                "spuImageList": [
                    {
                        "id": 0,
                        "imgName": "string",
                        "imgUrl": "string",
                        "spuId": 0
                    }
                ],
                // 平台属性以及属性值的数据
                "spuSaleAttrList": [
                    {
                        "baseSaleAttrId": 0,
                        "id": 0,
                        "saleAttrName": "string",
                        "spuId": 0,
                        "spuSaleAttrValueList": [
                            {
                                "baseSaleAttrId": 0,
                                "id": 0,
                                "isChecked": "string",
                                "saleAttrName": "string",
                                "saleAttrValueName": "string",
                                "spuId": 0
                            }
                        ]
                    }
                ],
            },
            dynamicTags: ['标签一', '标签二', '标签三'],
            inputVisible: false,
            inputValue: '',
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 初始化spuform数据
        async initSpuData(spuData) {

            // 获取spu信息的数据
            let spuResult = await this.$API.spu.reqSpu(spuData.id)
            if (spuResult.code == 200) {
                this.spu = spuResult.data
            }

            // 获取spu品牌信息
            try {
                let TrademarkResult = await this.$API.spu.reqTrademarkList();
                if (TrademarkResult.code == 200) {
                    this.tradeMarkList = TrademarkResult.data
                }
            } catch (error) {
                // 在这里处理错误  
                console.error('获取商标列表时发生错误:', error);
                // 你可以根据需要进一步处理错误，例如抛出错误、记录日志等  
                // throw error; // 如果你希望在外部捕获这个错误，可以选择重新抛出  
            }

            // 获取spu图片信息
            let spuImgResult = await this.$API.spu.reqSpuImageList(spuData.id)
            if (spuImgResult.code == 200) {
                let list = spuImgResult.data
                list.forEach(element => {
                    element.name = element.imgName
                    element.url = element.imgUrl
                });
                this.spuImageList = list
            }
            // 获取平台的全部销售属性
            let saleResult = await this.$API.spu.reqGetBaseSaleAttrList()
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data
            }
        },
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },

    },
    computed: {
        unSelectAttr() {
            // 三个属性  颜色 版本 尺码 this.saleAttrList 包含这三个[{name:'颜色',id:1},{name:'版本',id:2},{name:'尺码',id:3}]
            let result = this.saleAttrList.filter(
                (item) => {
                    return this.spu.spuSaleAttrList.every((item1) => {
                        return item.name != item1.saleAttrName
                    })
                }
            )
            return result
        }
    }
}
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>