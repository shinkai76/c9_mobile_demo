<template>
    <div id="Login">
        <div class="login-wrap">
            <input type="text"
                   placeholder="用户名"
                   class="login-input"
                   v-model.trim="loginForm.user_name"
            >
            <input type="password"
                   placeholder="密码"
                   class="login-input"
                   v-model="loginForm.password"
            >
            <input type="text"
                   v-if="!isDDLogin"
                   placeholder="企业ID"
                   class="login-input"
                   v-model.trim="loginForm.set_of_book"
            >
            <input type="hidden"
                   v-model="captcha_id"
            >
            <input type="text" class="login-input"
                   v-if="!isDDLogin"
                   v-model="captcha_solution"
                   autocomplete="off"
                   placeholder="请输入验证码"
            >
            <img alt="点击刷新" id="ych_img" :src="captcha_url" title="点击刷新" @click="getCaptcha" />
            <van-button size="large" class="login-submit" @click="onLogin()">登录</van-button>
        </div>
    </div>
</template>

<script>
import { setToken, removeToken } from '@/utils/auth'
import { GetParamFromUrl } from '@/utils/app'
import * as dd from 'dingtalk-jsapi';

export default {
    name: 'Login',
    data () {
        return {
            loginForm: {
                user_name: 'yy',
                password: 'Bb.123456',
                set_of_book: 'c9',
            },
            captcha_id: '',
            captcha_solution: '',
            captcha_url: '',
            isDDLogin: false,

        }
    },
    created() {
        this.isDDLogin = dd.env.platform !== 'notInDingTalk'
        this.getSettings()
        this.checkLoginType()
    },
    mounted () { // 请求数据之后的页面其他逻辑
        removeToken()
    },
    activated () {},
    deactivated () {},
    methods: {
        checkLoginType () {
            const set_of_book = GetParamFromUrl('set_of_book')
            const corpid = GetParamFromUrl('corpid')
            if (this.isDDLogin) {
                this.DDLogin(set_of_book, corpid)
            }
        },
        DDLogin (set_of_book, corpid) {
            let _this = this
            dd.ready(function () {
                dd.runtime.permission.requestAuthCode({
                    corpId: corpid,
                    onSuccess: async function (result) {
                        _this.$axios({
                            url: '/api/login',
                            method: 'POST',
                            data: { 'dingtalk_code': result.code, set_of_book }
                        }).then(result => {
                            const user_id = result.id
                            if ( user_id != null ) {
                                _this.afterLogin(result)
                            } else {
                                alert('登录名或密码错误')
                            }
                        }).catch((err)=> {
                            console.log(err)
                        })
                    },
                    onFail: function (err) {
                        console.log('DD login failed:', err)
                    }
                })
            })
        },
        getSettings () {
            this.$axios({
                url: '/settings'
            }).then(res => {
                res.extensions.map(e => {
                    if ( e.package === 'ych') {
                        let app_key = e.app_key || true
                        this.setHeadScript(app_key)
                    }
                    if ( e.package === 'captcha' && !this.isDDLogin) {
                        this.getCaptcha()
                    }
                })
            })
        },
        setHeadScript(app_key){
            if (document.getElementById('J_secure_sdk_v2')) {
                return
            }
            var sdk = "http://g.tbcdn.cn/sj/securesdk/0.0.3/securesdk_v2.js";
            if (window.location.protocol == "https:"){
                sdk = "https://g.alicdn.com/sj/securesdk/0.0.3/securesdk_v2.js";
            }

            let script = document.createElement("script")
            script.setAttribute('data-appkey', app_key)
            script.setAttribute('id', 'J_secure_sdk_v2')
            script.type = "text/javascript"
            script.src = sdk
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        onLogin () {
            let form = new FormData()
            for ( let key in this.loginForm ) {
                form.append(key, this.loginForm[key])
            }
            form.append('captcha_id', this.captcha_id)
            form.append('captcha_solution', this.captcha_solution)
             this.$axios({
                url: '/api/login',
                method: 'POST',
                data: form,
                headers: { 'Device': 'scanner' }
            }).then(res=> {
                if (res) {
                    this.afterLogin(res)
                }
             }).catch(()=> {
                 this.getCaptcha()
             })
        },
        afterLogin(_LoginInfo) {
            setToken(_LoginInfo.token)
            let _cache
            this.$axios({
                url: '/api/cache'
            }).then(res=> {
                res.userinfo = _LoginInfo
                _cache = res
                window.localStorage.setItem('Cache', JSON.stringify(_cache))
                let userName = this.loginForm.user_name
                let setOfBook = this.loginForm.set_of_book
                let loginInfo = {
                    userName,
                    setOfBook
                }
                window.sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
                window.sessionStorage.setItem('isLogin', true)
                console.log('loginInfo', loginInfo)
                this.$router.replace('/dashboard')
            })
        },
        getCaptcha () {
            this.captcha_solution = ''
            this.$axios({
                url: '/captchas/new'
            })
                .then(data => {
                    let captcha_id = data
                    var src = '//' + window.location.host + '/captchas/' + captcha_id
                    this.captcha_id = captcha_id
                    this.captcha_url = src
                })
        }
    }
}
</script>

<style scoped lang="less">
#Login {
    height: 100%;

    .login-wrap {
        position: relative;
        width: 40%;
        min-width: 270px;
        margin: 0 auto;
        padding-top: 15vh;

        .login-input {
            border: 1px solid #ccc;
            width: 100%;
            padding: 0.1rem;
            margin: 0.1rem 0;
        }

        .login-submit {
            margin-top: 45vh;
            width: 100%;
        }
    }
}

</style>
