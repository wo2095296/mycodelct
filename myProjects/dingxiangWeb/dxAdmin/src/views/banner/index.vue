<template>
  <div class="newsindexout">
    <nz-list :requestUrl="$apiUrl.COMMON.LIST" ref="list" :beforeSearch="beforeSearchFn" :needAdvancedSearch="false" :needBaseSearch="false">
      <div slot="operate">
        <nz-button type="primary" size="small" @click="addArticle">
          <i class="nz-icon-add"></i>新建
        </nz-button>

      </div>
      <template slot="tableColumns">
        <nz-table-column type="index" label="序号" min-width="120" width="150"></nz-table-column>
        <nz-table-column prop="CreateTime" min-width="120" label="创建时间"></nz-table-column>
        <nz-table-column prop="ArticleTitle" min-width="120" label="标题"></nz-table-column>
        <nz-table-column prop="ArticleShortContent" min-width="120" label="内容摘要">
          <template slot-scope="scope">
            <div v-if="scope.row.Islink==1" @click="jumpUrl(scope.row.ArticleContent)">{{scope.row.ArticleContent}}</div>
            <div v-else>{{scope.row.ArticleShortContent}}</div>
          </template>
        </nz-table-column>
        <nz-table-column min-width="120" label="操作">
          <template slot-scope="scope">
            <nz-button type="text" @click="eitDialog(scope.row)">编辑</nz-button>
            <nz-button type="text" @click="deleteFn(scope.row)">删除</nz-button>
          </template>
        </nz-table-column>
      </template>
    </nz-list>
    <dialog-add ref="dialog" @save-success="refresh" :typeVal="6"></dialog-add>

  </div>
</template>
<script>
import dialogAdd from './dialog.vue';

export default {
  data() {
    return {};
  },
  components: {
    dialogAdd
  },
  methods: {
    jumpUrl(url) {
      window.open(url);
    },
    async deleteFn(row) {
      const result = await this.$message.confirm('真的要删除吗?');
      if (result) {
        const { err, res } = await this.$ajax.get(this.$apiUrl.COMMON.DELTET, { ArticleID: row.ArticleID });
        console.log(err, res);
        if (err) {
          this.$message.showError('删除失败');
        } else {
          this.$message.success('删除成功');
          this.refresh();
        }
      }
    },
    refresh() {
      this.$refs.list.refresh();
    },
    addArticle() {
      this.$refs.dialog.show();
    },
    addLink() {
      this.$refs.dialogUrl.show();
    },
    async eitDialog(row) {
      const { err, res } = await this.$ajax.get(this.$apiUrl.COMMON.GETSINGLE, { ArticleID: row.ArticleID });
      console.log(err, res);
      if (err) {
      } else {
        let data = res.Data.List[0];
        if (data.Islink == 1) {
          this.$refs.dialogUrl.show(data);
        } else {
          this.$refs.dialog.show(data);
        }
      }
    },
    beforeSearchFn() {
      return { ArticleType: 6 };
    }
  },
  mounted() {
    // this.getList();
  }
};
</script>
<style rel='stylesheet/less' lang='less' scoped>
</style>
