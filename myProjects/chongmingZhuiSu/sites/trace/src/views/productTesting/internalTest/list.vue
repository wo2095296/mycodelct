<template>
  <div>
    <div v-if="currentPage=='list'">
      <cjm-list ref="list" :request-url="requestUrl" :need-advanced-search="true"
                :need-base-search="true">
        <div slot="operate">
          <cjm-button type="primary" @click="addTest" power-code="addInternalTest"><i class="cjm-icon-add"></i>添加检测</cjm-button>
        </div>
        <div slot="search">
          <cjm-search-item label="产品名称" search-key="productID" v-model="search.productID">
            <cjm-remote-select v-model="search.productID"
                               :remote-url="$globalData.get('trace', 'apiUrl').autoComplete.PRODUCT"></cjm-remote-select>
          </cjm-search-item>
        </div>
        <template slot="tableColumns">
          <cjm-table-column prop="orgName" label="关联机构" width=""></cjm-table-column>
          <cjm-table-column prop="productBatchCode" label="产品批次" width=""></cjm-table-column>
          <cjm-table-column prop="productName" label="产品名称" width=""></cjm-table-column>
          <cjm-table-column prop="createBy" label="操作人" width=""></cjm-table-column>
          <cjm-table-column prop="createTime" label="操作时间" width=""></cjm-table-column>
          <cjm-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <cjm-tooltip content="编辑">
                <cjm-button type="text" @click="editTest(scope.row)" power-code="internalTestEdit">编辑</cjm-button>
              </cjm-tooltip>
              <cjm-tooltip content="删除">
                <cjm-button type="text" @click="deleteTest(scope.row)" power-code="internalTestDelete">删除</cjm-button>
              </cjm-tooltip>
              <cjm-tooltip content="下载" v-if="scope.row.hasFile!=0">
                <cjm-button type="text" @click="showFileList(scope.row.id)" power-code="internalTestDownload">下载</cjm-button>
              </cjm-tooltip>
            </template>
          </cjm-table-column>
        </template>
      </cjm-list>
    </div>
    <div v-if="currentPage=='edit'">
      <add-test></add-test>
    </div>
    <cjm-dialog title="下载文件"  :height="height" :visible.sync="downloadFileDialog" :show-footer="showFooter">
      <test-file-list ref="testFileList" v-if="downloadFileDialog"></test-file-list>
    </cjm-dialog>
  </div>
</template>
<script>
  import pageSwitch from 'framework/mixins/pageSwitch';
  import add from './add';
  import testFileList from '../testFile-download-list';
  export default {
    components: {
      'add-test': add,
      'test-file-list': testFileList
    },
    mixins: [pageSwitch],
    data() {
      return {
        search: {
          productID: ''
        },
        downloadFileDialog: false,
        showFooter: false,
        height: 500,
        currentPage: 'list',
        requestUrl: this.$globalData.get('trace', 'apiUrl').productTesting.GET_PRODCUT_TEST_LIST + '&object=1'
      }
    },
    methods: {
      addTest(){
        this.pushPage('edit', '新增');
      },
      editTest(row){
        this.pushPage('edit', '编辑', {id: row.id});
      },
      deleteTest(row){
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.get(this.$globalData.get('trace', 'apiUrl').productTesting.DELETE_TEST, {id: row.id}).then((r) => {
            if (r.resultCode == '200') {
              this.$refs.list.refresh();
              this.$message.success('删除成功');
            } else {
              this.$message.error('删除失败');
            }
          });
        }).catch(() => {
          this.$message.warning('已取消删除操作');
        });
      },
      showFileList(id){
        this.downloadFileDialog = true;
        this.$nextTick(() => {
          this.$refs.testFileList.init(id);
        });
      },
      pageSwitched(codes){
        this.currentPage = codes.length > 0 ? codes[0] : 'list';
      }
    }
  }
</script>
<style>
</style>
