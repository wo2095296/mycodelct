<template>
  <div class="card">
    <div class="mycardwrap"  v-for="(item,index) in listInfoAry" :data-pid="item.ProductID" >
    <div class="cardtop">
<carditem :cardinfo="item" >

</carditem>
    </div>
    <div class="cardbottom">
<qrcodep :idval="item.ProductID" :pcurl="urlFn(item.PCUrl,item.ProductID,item.Clicks,1)" :mallurl="urlFn(item.MallUrl,item.ProductID,item.Clicks,3)" :traceurl="urlFn(item.TraceUrl,item.ProductID,item.Clicks,2)"></qrcodep>
    </div>
    </div>
 </div>

</template>

<script>
import carditem from "./carditem";
import qrcodep from "./qrcode";

export default {
  props: {
    listInfoAry: {
      //信息
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      morePath: "",
      myindex: 0
    };
  },
  computed: {},
  components: {
    carditem,
    qrcodep
  },
  methods: {
    urlFn(url, id, clicks,type) {
      if (url) {
        let urlstr = encodeURIComponent(url);
        let urlstrp = `${location.protocol}//${
          location.host
        }/Click.aspx?ID=${id}&type=${type}`;
        
        return urlstrp;
      }
    }
  },
  created() {},
  mounted() {}
};
</script>


<style lang="scss" scoped="" type="text/css">
@import "static/style/_var.scss";

.mycardwrap {
  // @include wh(273px, 426px);
  width:273px;
  min-height:403px;
  @include ov;
  border: 1px solid #ccc;
  @include pr;
  @include float;
  margin-right: 18px;
  margin-bottom: 50px;
}

.sycp,
.egoods {
  .card {
    margin-right: 14px;
  }
}
#listsuyan,
#listegoods {
  .mycardwrap {
    width: 273px;
    margin-left: 19px;
    margin-right: 0;
  }
  .mycardwrap:last-child {
    margin-right: 0;
  }
}
</style>
