<template>
<div>
  <el-select class="typeSelect" v-model="selectValue" placeholder="请选择">
    <el-option v-for="item in options" :key="item.selectValue" :label="item.label" :value="item.selectValue"></el-option>
  </el-select>
  <el-input placeholder="请输入内容" clearable class="searchInput"> </el-input>
  <el-button type="primary" size="medium" class="searchBtn" ><i class="el-icon-search"></i>搜索</el-button>
  <el-button type="primary" size="medium" class="addBtn" @click="dialogVisible = true"><i class="el-icon-edit"></i>添加</el-button>
  <el-button type="primary" size="medium" class="addBtn" ><i class="el-icon-download"></i>导出表格</el-button>
  
  <el-table class="elTable"
    :data="tableData"
    border
    stripe
    :span-method="objectSpanMethod"
    :max-height="windowHeight"  
    >
    <el-table-column
      fixed="left"
      prop="id"
      label="序号"
      width="50">
    </el-table-column>
    <el-table-column
      fixed="left"
      prop="indentId"
      label="定单编号"
      width="230">
    </el-table-column>
    <el-table-column
      prop="materialsId"
      label="物料编码"
      width="130">
    </el-table-column>
    <el-table-column
      prop="ProductName"
      label="产品名称"
      width="200">
    </el-table-column>
    <el-table-column
      prop="type"
      label="规格型号"
      width="310">
    </el-table-column>
    <el-table-column
      prop="number"
      label="订单数量"
      width="80">
    </el-table-column>
    <el-table-column
      prop="tableNumber"
      label="表号要求"
      width="300">
    </el-table-column>
    <el-table-column
      prop="require"
      label="配件及其他要求"
      width="741">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="190">
      <template slot-scope="scope">
        <el-button class="dele" size="small" type="primary" plain @click="dialogVisible = true">编辑</el-button>
        <el-button class="dele" size="small" type="danger" plain>删除</el-button>
      </template>
    </el-table-column>

  </el-table>

  <el-dialog
    title="添加新数据"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="120px" class="demo-ruleForm">
      <el-form-item label="订单编号" prop="pass1">
        <el-input type="text" v-model="ruleForm2.pass1" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="物料编码" prop="pass2">
        <el-input type="text" v-model="ruleForm2.pass2" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="产品名称" >
        <el-input type="text" v-model="ruleForm2.pass1" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="规格型号" >
        <el-input type="text" v-model="ruleForm2.pass1" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="物料编码" prop="pass3">
        <el-input type="number" v-model="ruleForm2.pass3" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="配件及其他要求">
        <el-input v-model.number="ruleForm2.pass4" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="表号要求" >
        <el-input v-model.number="ruleForm2.pass1" type="text" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm2')">立刻添加</el-button>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</div>

</template>

<script>

  export default {

    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 7) { //第几列
          if (rowIndex == 4 ) { //第几行
            return {
              rowspan: 2, //合并行数
              colspan: 1 //合并的列数
            };
          } else if(rowIndex == 5) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible = false;
            this.$message({
              message: '数据添加成功',
              type: 'success'
            })
          } else {
            this.$message.error('数据添加失败，请重新添加')
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    data() {
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入订单编号'));
        }else if(value.length < 5) {
          callback(new Error('请输入正确订单编号'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入物料编码'));
        } else if(value.length < 4) {
          callback(new Error('请输入正确物料编码'));
        } else {
          callback();
        }
      };
      var validatePass3 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入订单数量'));
        } else if(value < 0 && value > 100000000) {
          callback(new Error('请输入正确订单数量'));
        } else {
          callback();
        }
      };
      return {
        windowHeight: 700,
        block:[],
        tableData: [{
            id: 1,
            indentId: 'C-B1-YZHXGS-8-170708',
            materialsId: 'C0102878',
            ProductName: '光电直读智能基表',
            type: 'LXSG-20D3C/ZD（R80/无接帽/二极磁钢）',
            number: 7800,
            require: '1）字面只印4个圈，字面图纸号：YL8.314.901，中心轮采用：1100的磁钢；2）壳体下部各13D3C/20D3C通用，流量按R80；3）脱磁：15:3000l/h  20:5000l/h；4）无接帽；5）盖板、叶轮与13D3通用，6）13D3d铜锁紧环',
            tableNumber: '壳体编号：E170812201-E170820000'
          }, {
            id: 2,
            indentId: 'F-A-FF-8-170413',
            materialsId: 'C0124200',
            ProductName: '预装远传水表ControlAgua',
            type: 'LXSY-13D/S/F（大小头/R160/10L/脉冲/客户商标黑色表盖/13D6a带阀NPT接管+两角塑料螺帽）',
            number: 15000,
            require: '字面加条形码，图纸号：YL8.314.1012；条形码编号：18XXXXXXXXXXXX（14位数，178代表年份+6位表号+3位流量等级+3位水表口径，如第一只表编号为：18000001160015) ；ControlAgua商标黑色表盖表罩',
            tableNumber: '字面刻表号：18 000001-18 015000，与条形码需要一一对应；塑料铅封号：446842-461841'
          }, {
            id: 3,
            indentId: 'C-A-MAR-1-180103',
            materialsId: 'C0101313',
            ProductName: 'SIMAR',
            type: 'LXS-25D1（SIMAR蓝色表盖）',
            number: 300,
            require: '字面图纸号：YL8.314.686',
            tableNumber: '18 006562-18 006861'
          }, {
            id: 4,
            indentId: 'C-A-MAR-1-180103',
            materialsId: 'C0102182',
            ProductName: 'SIMAR',
            type: 'LXSG-20D1（SIMAR蓝色表盖/5位字轮）',
            number: 200,
            require: '字面图纸号：YL8.314.156',
            tableNumber: '18 008862-18 009061'
          }, {
            id: 5,
            indentId: 'C-A-PK-1-180105',
            materialsId: 'C0102580',
            ProductName: '单流冷水表DEKACT',
            type: 'LXSG-32D3（铜本色/黑色六牙指针）',
            number: 100,
            require: '提供电子版流量检测记录；单流干式不打铅封；',
            tableNumber: '字面刻表号：058400301-058400400'
          },
          {
            id: 6,
            indentId: 'C-A-PK-1-180105',
            materialsId: 'C0102584',
            ProductName: '单流冷水表DEKACT',
            type: 'LXSG-32D3（铜本色/黑色六牙指针）',
            number: 100,
            require: '提供电子版流量检测记录；单流干式不打铅封；',
            tableNumber: '字面刻表号：058400501-058400600'
          }],
          options:[{
            selectValue: "订单编号",
            label: "订单编号"
          },{
            selectValue: "物料编码",
            label: "物料编码"
        }],
        selectValue: '',
        ruleForm2: {
          pass1: '',
          pass2: '',
          pass3: '',
          pass4: ''
        },
        rules2: {
          pass1: [
            { validator: validatePass1, trigger: 'blur' }
          ],
          pass2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          pass3: [
            { validator: validatePass3, trigger: 'blur' }
          ]
        },
        dialogVisible: false
      }
    }
  }
</script>
<style>
  .elTable{
    margin: 10px 0 0 60px;
    width: 90%;
  }
  .el-table .cell, .el-table th div{
    text-align: center;
  }
  .addBtn, .searchBtn{
    margin: 30px 0 0 10px;
  }
  .searchInput{
    width: 380px;
    margin: 30px 0 0 10px;
  }
  .typeSelect{
    width: 160px;
    margin: 30px 0 0 60px
  }

</style> 
