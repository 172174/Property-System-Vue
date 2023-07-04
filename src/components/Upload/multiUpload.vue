<template>

  <div>
    <el-upload
      :action="objdata.host"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="getUploadData"
      :data="objdata"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { Upload } from "element-ui";

export default {
  name: "multiUpload",
  props: {
    //图片属性数组
    value: String,
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      ossUploadUrl: "https://xinyiran-mall.oss-cn-chengdu.aliyuncs.com",
      objdata: {
        OSSAccessKeyId: "",
        policy: "",
        key: "",
        Signature: "",
        dir: "",
        host: "",
      },
      Uuid:"",
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    getUploadData() {
      let _self = this;
      this.Uuid = this.uuid(8,10)
      return new Promise((resolve, reject) => {
        this.$axios
          .get("/upload")
          .then((res) => {
            _self.objdata.OSSAccessKeyId = res.data.data.accessid;
            _self.objdata.policy = res.data.data.policy;
            _self.objdata.Signature = res.data.data.signature;
            _self.objdata.host = res.data.data.host;
            _self.objdata.dir = res.data.data.dir;
            _self.objdata.key = res.data.data.dir +this.Uuid+ "${filename}";
            resolve(true);
          })
          .catch(function (error) {
            reject(false);
          });
      });
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;

      this.dialogVisible = true;
    },
    emitInput(val) {
      this.$emit("input", val);
    },
    handleSuccess(res, file) {
      
      let url = this.objdata.host + "/" + this.objdata.dir +this.Uuid+ file.name;
      console.log(url)
      this.emitInput(url);
    },
    uuid(len, radix) {
      var chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
          ""
        );
      var uuid = [],i;
      radix = radix || chars.length;
      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
      } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
        uuid[14] = "4";
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | (Math.random() * 16);
            uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
          }
        }
      }

      return uuid.join("");
    },
  },
};
</script>
<style>
</style>


