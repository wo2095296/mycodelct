<template>
  <div>
    <cjm-list ref="list"
              :request-url="apiUrl.codeGeneration.GET_LIST_FOR_CORP"
              :need-advanced-search="true"
              v-show="currentPage==='list'"
              base-search-placeholder="输入生码批次、品牌搜索">
      <div slot="search">
        <cjm-search-item label="生码批次" search-key="batchID" v-model="search.batchID">
          <cjm-input v-model="search.batchID"></cjm-input>
        </cjm-search-item>
        <cjm-search-item label="审核状态" search-key="isApprove" v-model="search.isApprove">
          <cjm-enum-select v-model="search.isApprove"
                           enum-name="生码审核状态"
                           enum-namespace="code"
                           :clearable="true"></cjm-enum-select>
        </cjm-search-item>
        <cjm-search-item label="创建时间" search-key="createTime" v-model="search.createTime">
          <cjm-date-picker v-model="search.createTime" type="daterange"></cjm-date-picker>
        </cjm-search-item>
      </div>
      <template slot="tableColumns">
        <cjm-table-column prop="batchID" label="批次号" width="100" sortable="custom"></cjm-table-column>
        <cjm-table-column prop="brandName" label="品牌" width="100" sortable="custom"></cjm-table-column>
        <!--<cjm-table-column label="区块链验证" sortable="custom" min-width="100">-->
          <!--<template slot-scope="scope">-->
              <!--<span-->
                <!--v-if="scope.row.blockChainStatus != -2 && scope.row.blockChainStatus != 1 && scope.row.blockChainStatus != 0 && scope.row.blockChainStatus != -1">区块链校验中<span-->
                <!--class="cjm-check-loading"><i></i><i></i><i></i></span></span>-->
            <!--<span v-if="scope.row.blockChainStatus == -1">未上链</span>-->
            <!--<div v-if="scope.row.blockChainStatus == 0">-->
              <!--<i class="cjm-icon-warn icon-error"></i>-->
              <!--<cjm-tooltip class="item" effect="light" content="数据与区块链上信息不符，点击可查看" placement="right-start">-->
                <!--<cjm-button type="text" @click="blockChainView(scope.row)">验证未通过-->
                <!--</cjm-button>-->
              <!--</cjm-tooltip>-->
            <!--</div>-->
            <!--<div v-if="scope.row.blockChainStatus == 1">-->
              <!--<i class="cjm-icon-confirm icon-passed"></i>-->
              <!--<cjm-tooltip class="item" effect="light" content="数据与区块链上信息吻合，点击可查看" placement="right-start">-->
                <!--<cjm-button type="text" @click="blockChainView(scope.row)">验证通过</cjm-button>-->
              <!--</cjm-tooltip>-->
            <!--</div>-->
          <!--</template>-->
        <!--</cjm-table-column>-->
        <cjm-table-column prop="batchNumber" label="生码量" width="100" sortable="custom"
                          :formatter="formatterBatchNumber"></cjm-table-column>
        <cjm-table-column prop="isAlterApproved" label="审核状态" width="110"
                          enum-name="生码变更审核状态" enum-namespace="code"></cjm-table-column>
        <cjm-table-column prop="labelType" label="标签类型" min-width="160"></cjm-table-column>
        <cjm-table-column prop="logisticsCodeType" label="物流码类型" min-width="140"></cjm-table-column>
        <cjm-table-column prop="correlativeProduct" label="关联产品" min-width="140"></cjm-table-column>
        <cjm-table-column prop="createTime" label="创建时间" width="160" sortable="custom"></cjm-table-column>
        <cjm-table-column prop="lastUpdateTime" label="最后更新时间" width="160" sortable="custom"></cjm-table-column>
        <cjm-table-column label="操作" width="130" fixed="right" :show-overflow-tooltip="false">
          <template slot-scope="scope">
            <cjm-button type="text" power-code="CorpCodeGenerationEdit" @click="edit(scope.row.id)"
                        v-if="scope.row.functionType.indexOf('1')>=0">编辑
            </cjm-button>
            <cjm-button type="text" power-code="CorpCodeGenerationMicroPageEdit"
                        @click="editMicroPage(scope.row.id, scope.row.microPageID)">编辑微页
            </cjm-button>
          </template>
        </cjm-table-column>
      </template>
    </cjm-list>

    <cjm-dialog ref="editDialog"
                title="编辑生码批次"
                :visible.sync="dialogVisible"
                :height="800"
                :ok-handler="submit">
      <edit ref="editPage"></edit>
    </cjm-dialog>

    <iframe :src="iframeUrl"
            frameborder="0"
            width="100%"
            height="600"
            v-if="currentPage==='microPage'"></iframe>
    <div v-if="currentPage == 'antiFakeBlockChain'">
      <antifake-block-chain-view></antifake-block-chain-view>
    </div>
  </div>
</template>

<script>
  import Edit from './editForCorp.vue'
  import pageSwitch from 'framework/mixins/pageSwitch'
  import antifakeBlockChainView from 'base/views/blockChain/antiFake-block-chain-view.vue'
  export default{
    components: {
      Edit,
      antifakeBlockChainView
    },
    mixins: [pageSwitch],
    data(){
      return {
        enums: this.$globalData.get('code', 'enums'),
        apiUrl: this.$globalData.get('code', 'apiUrl'),
        //是否显示弹框
        dialogVisible: false,
        //搜索项
        search: {
          batchID: '',
          isApprove: '',
          createTime: ''
        },
        currentPage: 'list',
        verifyChainBlockCount: 0 //验证区块请求计数
      }
    },
    computed: {
      iframeUrl(){
        const params = this.getPageParams('microPage');
        return `../../Module/WeixinManage/MicroPageEdit.aspx?AdhibitionType=2&ModuleID=${params.id || ''}&MicroPageID=${params.pageID || ''}`;
      }
    },
    methods: {
      //格式化列表数据
      formatListData(data){
        let list = this.$refs.list;
        this.verifyChainBlockCount += 1;
        this.asynchronousRequest(list, data);
        return Object.deepClone(data);
      },
      //区块链验证开始异步请求
      asynchronousRequest(list, data){
        let groupNumber = 5, count = Math.ceil(data.length / groupNumber);
        this.asynchronousRequestItem(this.verifyChainBlockCount, list, data, 1, count, groupNumber);
      },
      //区块链异步的单个请求
      asynchronousRequestItem(verifyChainBlockCount, list, data, index, count, groupNumber){
        let param = data.slice((index - 1) * groupNumber, index * groupNumber);
        this.loadAntiFakeVerifyResult(param).then((antiFakeVerifyData) => {
          let nowData = Object.deepClone(list.tableData);
          for (var i = 0; i < nowData.length; i++) {
            let blockChainStatus = antiFakeVerifyData[nowData[i].id];
            if (blockChainStatus) {
              nowData[i].blockChainStatus = blockChainStatus;
            }
          }
          this.$nextTick(() => {
            list.tableData = nowData;
          });
          if (index < count && verifyChainBlockCount == this.verifyChainBlockCount) {
            this.asynchronousRequestItem(verifyChainBlockCount, list, data, index + 1, count, groupNumber);
          }
        }).catch(() => {
          //当异常时继续执行下一步的请求
          if (index < count && verifyChainBlockCount == this.verifyChainBlockCount) {
            this.asynchronousRequestItem(verifyChainBlockCount, list, data, index + 1, count, groupNumber);
          }
        });
      },
      //加载区块链验证结果
      loadAntiFakeVerifyResult(data){
        let params = [];
        for (var i = 0; i < data.length; i++) {
          params.push(data[i].id);
        }
        return new Promise((resolve) => {
          this.$ajax.post(this.$globalData.get('code', 'apiUrl').codeGeneration.ANTI_FAKE_VERIFY, {codeGenerationIDs: params}).then((res) => {
            if (res.resultCode == 200) {
              let antiFakeVerifyData = res.data;
              resolve(antiFakeVerifyData);
            }
          });
        });
      },
      //查看区块链
      blockChainView(row){
        this.pushPage('antiFakeBlockChain', '防伪区块链', {codeGenerationID: row.id});
      },
      //编辑
      edit(id){
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.editPage.editForm(id);
        })
      },
      //编辑微页
      editMicroPage(id, pageID){
        this.pushPage('microPage', '编辑微页', {id, pageID});
      },
      //编辑提交
      submit(callback){
        this.$refs.editPage.submit().then(() => {
          this.dialogVisible = false;
          this.$refs.list.refresh();
          callback();
        }).catch((error) => {
          if (error) {
            this.$message.error(error.message);
          }
          callback();
        })
      },
      //格式化生码量
      formatterBatchNumber(row, column, cellValue){
        if (cellValue >= 10000) {
          let num1 = Math.floor(cellValue / 10000);
          let num2 = cellValue % 10000;
          return num1 + '万' + (num2 !== 0 ? num2 : '');
        }
        return cellValue;
      },
      pageSwitched(codes){
        this.currentPage = codes.length > 0 ? codes[0] : 'list';
        if (this.currentPage === 'list' && this.$refs.list) {
          this.$refs.list.refresh();
        }
      }
    },
    created(){
      window.addEventListener('message', function (e) {
        console.log(e.data);
      })
    }
  }
</script>

<style rel='stylesheet/less' lang='less' scoped>
  .icon-passed {
    color: #057748;
  }

  .icon-error {
    color: #F44336;
  }

  .cjm-check-loading {
    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      margin: 0 2px;
      border-radius: 50%;
      opacity: 0;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      &:nth-child(1) {
        background-color: #88ceff;
        animation-name: cjmCheckLoading1;
      }
      &:nth-child(2) {
        background-color: #4bb5ff;
        animation-name: cjmCheckLoading2;
      }
      &:nth-child(3) {
        background-color: #009cff;
        animation-name: cjmCheckLoading3;
      }
    }
    @keyframes cjmCheckLoading1 {
      0% {
        opacity: 0;
      }
      30% {
        opacity: 1;
      }
    }

    @keyframes cjmCheckLoading2 {
      33% {
        opacity: 0;
      }
      60% {
        opacity: 1;
      }
    }

    @keyframes cjmCheckLoading3 {
      63% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
