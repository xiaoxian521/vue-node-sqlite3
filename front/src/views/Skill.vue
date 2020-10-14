<template>
  <div class="skill" :style="{height:totalHeight}">
    <h1>{{user}}</h1>
    <div @click="logout">
      <Icon type="md-power" size="30" />
    </div>
    <!-- ADD INFO -->
    <Row class="addInfo">
      <form @submit.prevent="createTweet()">
        <Col span="4">
          <Input v-model="message" class="firstItem" placeholder="Please enter the date" />
        </Col>
        <Col span="4">
          <Input v-model="orders" class="secondItem" placeholder="Please enter money" />
        </Col>
        <Col span="4">
          <Input v-model="payMethod" class="thirdItem" placeholder="Please enter pay methods" />
        </Col>
        <Col span="2">
          <input type="submit" value="ADD" class="beautifyBtn"></input>
        </Col>
      </form>
      <Col span="8">
        <Input search class="searchItem" v-model="searchId" placeholder="Please enter the query id"/>
        <div class="actionScope" @click="instance('success')"></div>
      </Col>
    </Row>
    <div class="showInfo">
      <Table border :columns="columns12" :data="dataList">
        <template slot-scope="{ row }" slot="message">
          <strong>{{ row.message }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button  size="small" style="margin-right: 5px" @click="alterData(row.id)" class="update">Alter</Button>
          <Button  size="small" @click="remove(row.id)" class="delete">Delete</Button>
        </template>
      </Table>
    </div>
    <!-- Modify user dialog -->
    <el-dialog
      title="Modify User Dialog"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" @submit.prevent="modifyTweet()">
    <el-form-item label="Date：" label-width="100px">
    <el-input v-model="modifyMessage"></el-input>
    </el-form-item>
    <el-form-item label="Expenditure/Income：" label-width="100px">
    <el-input v-model="modifyOrders"></el-input>
    </el-form-item>
    <el-form-item label="Type Of Payment：" label-width="100px">
    <el-input v-model="modifyPayMethod"></el-input>
    </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="modifyTweet">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
const client = require("../client")
export default {
  data() {
    return {
      user: "",
      totalHeight: "",
      accountId: 1,
      message: "",
      orders: "",
      payMethod: "",
      searchId: "",
      createdAt: "",
      // 控制修改用户对话框的显示于隐藏
      editDialogVisible: false,
      modifyId: "",
      modifyMessage: "",
      modifyOrders: "",
      modifyPayMethod: "",
      dataList: [],
      errors: [],
      columns12: [
        {
          title: "ID",
          key: "id",
        },
        {
          title: "Date",
          slot: "message",
        },
        {
          title: "Expenditure/Income",
          key: "orders",
        },
        {
          title: "Type Of Payment",
          key: "payMethod",
        },
        {
          title: "Remarks",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
    }
  },
  created() {
    this.getUserName()
    //元素创建完后调整背景图片大小与屏幕一样高
    let bodyHeight = document.body.clientHeight - 1 + "px"
    this.totalHeight = bodyHeight
    this.showTweet()
  },
  methods: {
    //退出登录，清除localStorage中的用户信息并跳转到登录页
    logout() {
      localStorage.removeItem("persons")
      this.$router.push("/")
    },
    //从localStorage中获取登录用户名
    getUserName() {
      //如果用户名未登录，返回空。做判断防止报错
      let judegExist = JSON.parse(localStorage.getItem("persons"))
      if (judegExist) {
        this.user = JSON.parse(localStorage.getItem("persons"))[0].user
      } else {
        return false
      }
    },
    //数据删除
    remove(id) {
      let filtersIndex = id
      let judegExist = JSON.parse(localStorage.getItem("persons"))
      if (judegExist) {
        client.getDelTweets(filtersIndex, (errors, tweets) => {
          this.$message.success("Delete Success")
          this.showTweet()
        })
      } else {
        this.$message.error("Delete Fali Please Login First")
      }
    },
    //添加数据(并作出判断为输入框必须有值))
    createTweet() {
      let judegExist = JSON.parse(localStorage.getItem("persons"))
      if (judegExist) {
        client.createTweet(
          this.accountId,
          this.message,
          this.orders,
          this.payMethod,
          (errors, id) => {
            if (
              errors.length == 0 &&
              this.message !== "" &&
              this.orders !== "" &&
              this.payMethod !== ""
            ) {
              this.$message({
                message: "Add success！",
                type: "success",
              })
              this.message = ""
              this.orders = ""
              this.payMethod = ""
              //添加后再此调用改方法，显示最新数据
              this.showTweet()
            } else {
              this.errors = errors
              this.$message.error("Add fali")
            }
          }
        )
      } else {
        this.$message.error("Add Fali Please Login First")
      }
    },
    //将数据进行展示
    showTweet() {
      client.getAllTweets((errors, tweets) => {
        if (errors.length == 0) {
          this.dataList = tweets
          console.log(tweets)
        } else {
          this.errors = errors
        }
      })
    },
    //根据ID进行搜索
    instance(type) {
      let judegExist = JSON.parse(localStorage.getItem("persons"))
      if (judegExist) {
        client.getSearchTweets(this.searchId, (errors, tweets) => {
          if (errors.length == 0) {
            const title = "Query Success"
            const content = `<p>ID is：${tweets.id}</p><p>Date：${tweets.message}</p>
            <p>Expenditure/Income：${tweets.orders}</p><p>Type Of Payment：${tweets.payMethod}</p>`
            switch (type) {
              case "info":
                this.$Modal.info({
                  title: title,
                  content: content,
                })
                break
              case "success":
                this.$Modal.success({
                  title: title,
                  content: content,
                })
                break
            }
          } else {
            this.errors = errors
            this.$message.error("no data")
          }
        })
      } else {
        this.$message.error("Query Fali Please Login First")
      }
    },
    //根据ID进行修改
    alterData(id) {
      client.getSearchTweets(id, (errors, tweets) => {
        if (errors.length == 0) {
          this.createdAt = tweets.createdAt
        } else {
          console.log(errors)
        }
        this.modifyId = id
        this.editDialogVisible = true
      })
    },
    modifyTweet() {
      client.modifyTweet(
        this.modifyId,
        this.accountId,
        this.modifyMessage,
        this.createdAt,
        this.modifyOrders,
        this.modifyPayMethod,
        (errors, modifyId) => {
          if (errors.length == 0) {
            this.$message({
              message: "Modify success！",
              type: "success",
            })
            //添加后再此调用改方法，显示最新数据
            this.showTweet()
          } else {
            this.errors = errors
            this.$message.error("Add fali")
          }
        }
      )
    },
  },
  //当页面不是登录页，即使更新用户信息
  watch: {
    "$route.path"(newVal, oldVal) {
      if (newVal !== "/") {
        this.getUserName()
      } else {
        return false
      }
    },
  },
}
</script>

<style lang ='scss' scoped>
.skill {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/CRUD.png");
  background-attachment: fixed;
  background-size: cover;
  h1 {
    &:nth-child(1) {
      position: absolute;
      top: 40px;
      right: 150px;
    }
  }
  .ivu-icon {
    position: absolute;
    top: 45px;
    right: 100px;
    &:hover {
      cursor: pointer;
    }
  }
  .showInfo {
    width: 80%;
    height: 400px;
    margin-top: 100px;
  }
  .addInfo {
    width: 80%;
    height: 50px;
    position: absolute;
    top: 130px;
    .firstItem,
    .secondItem,
    .thirdItem {
      width: 200px;
      padding-right: 20px;
    }
    .searchItem {
      width: 200px;
      margin-left: 252px;
    }
  }
  .beautifyBtn {
    width: 60px;
    height: 30px;
    background: #fc5c7d; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #6a82fb,
      #fc5c7d
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #6a82fb,
      #fc5c7d
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: white;
    border: none;
    border-radius: 5px;
  }
  .update {
    color: white;
    background: #fc5c7d;
    background: -webkit-linear-gradient(to right, #6a82fb, #fc5c7d);
    background: linear-gradient(to right, #6a82fb, #fc5c7d);
  }
  .delete {
    color: white;
    background: #ff512f;
    background: -webkit-linear-gradient(to right, #dd2476, #ff512f);
    background: linear-gradient(to right, #dd2476, #ff512f);
  }
  .actionScope {
    width: 40px;
    height: 30px;
    position: absolute;
    opacity: 0;
    z-index: 999;
    top: 2px;
    right: -80px;
  }
}
</style>