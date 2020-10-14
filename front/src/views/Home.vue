<template>
  <div class="home" :style="{ height: totalHeight }">
    <Form
      ref="formInline"
      :model="formInline"
      :rules="ruleInline"
      class="TopCon"
      @submit.native.prevent="login()"
    >
      <div class="topBorder">
        <FormItem prop="user">
          <Input
            type="text"
            v-model="formInline.user"
            placeholder="Username"
          ></Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="formInline.password"
            placeholder="Password"
            password
            @keyup.enter.native="handleSubmit('formInline')"
          ></Input>
        </FormItem>
      </div>
      <FormItem class="bottomBorder">
        <!-- 登录 -->
        <Button
          :style="{ backgroundColor: '#A5D3DF' }"
          @click="handleSubmit('formInline')"
        >
          <span>Login</span>
        </Button>
        <!-- 注册 -->
        <Button :style="{ backgroundColor: '#A5D3DF' }" @click="jumpRegister">
          <span>Register</span>
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
const client = require("../client")
export default {
  name: "home",
  data() {
    return {
      formInline: {
        user: "",
        password: "",
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur",
          },
        ],
      },
      errors: [],
      totalHeight: "",
    }
  },
  created() {
    let bodyHeight = document.body.clientHeight - 1 + "px"
    this.totalHeight = bodyHeight
  },
  methods: {
    //用户登录
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          //请求登录接口，获取token
          client.login(
            this.formInline.user,
            this.formInline.password,
            (errors, id, username) => {
              if (errors.length == 0) {
                //先将用户信息存储到localStorage
                let personCon = {
                  user: this.formInline.user,
                }
                let personlists = JSON.parse(
                  localStorage.getItem("persons") || "[]"
                )
                personlists.unshift(personCon)
                localStorage.setItem("persons", JSON.stringify(personlists))
                this.formInline = ""
                this.$router.push("/Skill")
              } else {
                this.errors = errors
                this.$Message.error(`${this.errors}`)
              }
            }
          )
        } else {
          this.$Message.error("Fail!")
        }
      })
    },
    //用户注册
    jumpRegister() {
      this.$router.push("Register")
    },
  },
}
</script>

<style lang ='scss' scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/background.png");
  background-attachment: fixed;
  background-size: cover;
  .TopCon {
    width: 470px;
    height: 300px;
    background-color: rgba(62, 110, 144, 0.6);
    border-radius: 8%;
    .topBorder {
      width: 80%;
      margin: 0 auto;
      margin-top: 17%;
    }
    .bottomBorder {
      width: 80%;
      display: flex;
      margin: 0 auto;
      justify-content: space-between;
      .ivu-btn {
        width: 100px;
        margin: 21px;
      }
    }
  }
}
</style>