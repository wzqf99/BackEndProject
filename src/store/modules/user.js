/*
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-18 17:19:12
 * @LastEditors: wzqf99 1073626828@qq.com
 * @LastEditTime: 2024-03-21 16:57:36
 * @FilePath: \Project_BackEnd\vue-admin-template\src\store\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  // 外层login和内层login不一样
  // {commit} = context -- commit = context.commit
  async login({ commit }, userInfo) {
    try {
      const { username, password } = userInfo;
      console.log('开始登录', userInfo);
      const result = await login({ username: username.trim(), password: password.trim() });
      console.log('登录结果', result);
      if (result.code === 20000) {
        console.log('登录成功');
        commit('SET_TOKEN', result.data.token);
        setToken(result.data.token);
        return 'ok';
      } else {
        console.log('登录失败', result);
        return Promise.reject(new Error('登录失败: ' + result.message));
      }
    } catch (error) {
      console.error('在 login action 中捕获到错误:', error);
      return Promise.reject(error);
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data) //要在.then()中获取
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户退出登录
  async logout({ commit, state }) {
    try {
      await logout(state.token)
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } catch (error) {
      console.error('在 login action 中捕获到错误:', error);
      return Promise.reject(error);
    }
  },

  /*

    logout({commit,state}){
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
      })
    }






  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  */

  // remove token
  resetToken({ commit }) {

    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

