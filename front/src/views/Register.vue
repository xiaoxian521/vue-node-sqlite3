<template>
  <div class="register" :style="{ height: totalHeight }">
    <Form
      ref="formCustom"
      :model="formCustom"
      :rules="ruleCustom"
      :label-width="80"
      class="TopCon"
      @submit.native.prevent="createAccount()"
    >
      <div class="topBorder">
        <FormItem prop="user">
          <Input
            type="text"
            v-model="formCustom.user"
            placeholder="Username"
          ></Input>
        </FormItem>
        <FormItem prop="passwd">
          <Input
            type="password"
            v-model="formCustom.passwd"
            placeholder="Password"
            password
          ></Input>
        </FormItem>
        <FormItem prop="passwdCheck">
          <Input
            type="password"
            v-model="formCustom.passwdCheck"
            placeholder="Password Again"
            password
          ></Input>
        </FormItem>
        <FormItem prop="mail">
          <Input
            v-model="formCustom.mail"
            placeholder="E-mail"
            @keyup.enter.native="handleSubmit('formCustom')"
          ></Input>
        </FormItem>
      </div>
      <FormItem class="bottomBorder">
        <!-- 登录 -->
        <Button
          :style="{ backgroundColor: '#A5D3DF' }"
          @click="handleSubmit('formCustom')"
        >
          <span>Login</span>
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
const client = require("../client")
export default {
  name: "register",
  data() {
    //密码格式验证
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"))
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck")
        }
        callback()
      }
    }
    //两次密码是否一致验证
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"))
      } else if (value !== this.formCustom.passwd) {
        callback(new Error("The two input passwords do not match!"))
      } else {
        callback()
      }
    }
    return {
      errors: [],
      formCustom: {
        user: "",
        passwd: "",
        passwdCheck: "",
        mail: "",
      },
      ruleCustom: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
        ],
        passwd: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }],
        mail: [
          {
            required: true,
            message: "Mailbox cannot be empty",
            trigger: "blur",
          },
          { type: "email", message: "Incorrect email format", trigger: "blur" },
        ],
      },
      totalHeight: "",
    }
  },
  created() {
    let bodyHeight = document.body.clientHeight - 1 + "px"
    this.totalHeight = bodyHeight
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          //用户注册接口
          client.createAccount(
            this.formCustom.user,
            this.formCustom.passwd,
            this.formCustom.passwdCheck,
            this.formCustom.mail,
            (errors, id) => {
              if (errors.length == 0) {
                let personConRegister = {
                  user: this.formCustom.user,
                }
                let personlists = JSON.parse(
                  localStorage.getItem("persons") || "[]"
                )
                personlists.unshift(personConRegister)
                localStorage.setItem("persons", JSON.stringify(personlists))
                this.$Message.success("Created!")
                this.formCustom = ""
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
  },
}
</script>

<style lang ='scss' scoped>
.register {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/registerImg.png");
  background-attachment: fixed;
  background-size: cover;
  .TopCon {
    width: 470px;
    height: 300px;
    background-color: rgba(62, 110, 144, 0.6);
    border-radius: 8%;
    .topBorder {
      width: 90%;
      margin-left: -4%;
      margin-top: 5%;
    }
    .bottomBorder {
      width: 100%;
      display: flex;
      margin: 0 auto;
      justify-content: space-between;
      .ivu-btn {
        width: 200px;
        margin-left: -21%;
      }
    }
  }
}
</style>