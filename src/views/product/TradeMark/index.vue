<!--
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-21 17:34:07
 * @LastEditors: wzqf99 1073626828@qq.com
 * @LastEditTime: 2024-03-28 16:55:05
 * @FilePath: \Project_BackEnd\vue-admin-template\src\views\product\TradeMark\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
        <!-- 
            表格组件
            data:表格所要展示的数据（数组）
            border 表格带边框

            el-table-colum 按列展示数据 一个el-table-colum标签代表一列
                type：index 为表格自动设置序号
                prop: 对应数据中的字段名(键名)
                label:当前列的最顶层(当前类别)
                align 对齐方式
                width 宽度
         -->
        <el-button class="el-icon-plus" type="primary" @click="showDialog">添加商品</el-button>
        <!--  -->
        <el-table :data="list" border style="width: 100%">
            <el-table-column type="index" label="序号" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="width">
            </el-table-column>
            <el-table-column prop="logoUrl" label="品牌logo" width="width">
                <template slot-scope="{row,$index}"> <!-- elem封装的作用域插槽 -->
                    <!-- row 是 每一条数据 {} -->
                    <img :src="row.logoUrl" alt="" width="130px" height="100px">
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作">
                <template slot-scope="{row,$index}"> <!-- elem封装的作用域插槽 -->
                    <el-button type="warning" icon="el-icon-edit" size="mini"
                        @click="updataTradeMarkItem(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                        @click="deleteTradeMarkItem(row)">删除</el-button>
                </template>

            </el-table-column>
        </el-table>
        <!--
             参数
            current-page 当前第几页
            page-size  代表一页展示几条数据
            page-sizes  代表可以设置一页展示几条数据 [3条，5条，10条]
            pager-count  按钮的数量  连续页码数 = 按钮数量-2
            layout  表示分页器的布局
        -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            style="margin-top:50px; text-align: center;" :current-page="1" :page-size="2" :pager-count="7"
            layout="prev, pager, next ,jumper,->,sizes,total" :total="30" :page-sizes="[3, 5, 10]">
        </el-pagination>

        <!-- 模态框
            Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
         -->
        <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <!-- form表单 用v-model收集数据-->
            <el-form style="width:70%" :model="tmForm" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>

                <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
                    <!-- :on-success="handleAvatarSuccess" 可以检测到上传成功 当图片上传成功会执行一次
                        :before-upload="beforeAvatarUpload" 可以在上传图片之前 执行一次-->
                    <!-- 上传图片需要发送请求 action:用于上传图片 需要发请求-->
                    <el-upload class="avatar-uploader" action="/brand-api/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMarkItem">确 定</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "TradeMark",
    data() {
        return {
            //代表分页器第几页
            page: 1,
            //代表当前页展示几条数据
            limit: 3,
            //数据总条数
            total: 0,
            //列表展示的数据
            list: [],
            //是否展示模态框 默认false
            dialogFormVisible: false,
            //上传图片使用的属性
            imageUrl: '',
            //收集品牌信息
            tmForm: {
                tmName: '哔哩哔哩',
                logoUrl: ''
            },
            //验证规则
            rules: {
                //品牌名称验证
                tmName: [
                    /* blur失焦 change文本发生变化 */
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                ],
                //品牌logo验证
                logoUrl: [
                    { required: true, message: '请选择图片', trigger: 'change' }
                ],
            }
        }
    },
    mounted() {
        this.getPageList()
    },
    methods: {
        //获取品牌的接口
        getPageList(pager = 1) {
            const { page, limit } = this
            console.log(page, limit);
            this.$API.tradeMark.reqTradeMarkList(page, limit)
                .then((res) => {
                    if (res.code == 200) {
                        this.total = res.data.total
                        this.list = res.data.records
                    }
                })
        },
        //当前页数发生变化时触发
        handleCurrentChange(pager) {
            this.page = pager
            this.getPageList(pager)
        },
        //当分页器 某页 展示 数据条数发生变化 的时候会触发
        handleSizeChange(limit) {
            this.limit = limit
            //保持页码不变
            this.getPageList(this.page)
        },
        //点击添加品牌按钮
        showDialog() {
            this.dialogFormVisible = !this.dialogFormVisible
            this.tmForm = { tmName: '', logoUrl: '' }
        },
        //图片上传成功的回调
        handleAvatarSuccess(res, file) {
            //res 上传成功之后返回的数据 res.data是图片在服务器上的地址
            this.tmForm.logoUrl = res.data
        },
        //图片上传之前的回调
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //添加品牌与修改品牌
        addOrUpdateTradeMarkItem() {
            this.$refs.ruleForm.validate((success) => {
                if (success) {
                    this.dialogFormVisible = false //验证通过关闭模态框
                    console.log('校验通过', success)
                    //验证成功后再根据是否有id发送添加或者修改请求
                    if (this.tmForm.id) {
                        this.$API.tradeMark.reqUpdateTradeItem(this.tmForm).then(
                            (res) => {
                                if (res.code == 200) {
                                    this.$message(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
                                    this.getPageList()
                                }
                            }
                        )
                    } else {
                        this.$API.tradeMark.reqAddTradeItem(this.tmForm).then(
                            (res) => {
                                if (res.code == 200) {
                                    this.$message(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
                                    this.getPageList()
                                }
                            }
                        )
                    }
                } else {
                    console.log('校验未通过')
                    return false
                }
            })

        },
        //修改品牌(获取品牌数据)
        updataTradeMarkItem(row) {
            //当前用户操作的这一项品牌
            this.dialogFormVisible = true

            //将服务器返回的品牌的信息 直接赋值给了tmForm 
            /* this.tmForm = row */

            //浅拷贝
            this.tmForm = { ...row }
        },
        //删除品牌
        deleteTradeMarkItem(row) {
            const currentId = row.id
            this.$API.tradeMark.reqDeleteTradeItem(currentId).then((res) => {
                if (res.code == 200) {
                    this.$message('删除成功')
                    this.getPageList()
                }
            })
        }
    },
}

</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>