﻿import {Realtime, TextMessage, IMClient} from 'leancloud-realtime'
import AV from 'leancloud-storage'
import {TypedMessagesPlugin, ImageMessage} from 'leancloud-realtime-plugin-typed-messages'

const LCAppId = 'qSOnDMNzKdGGSipnT7OxO7Cb-gzGzoHsz'
const LCAppKey = 'WakeTHDyS6A3QjCfGtQGor0g'
const LCMasterKey = 'n4LgUleKqdD8RVrBl7dBsDvE'

let _instance: IM
let _client

// AV.init({appId: LCAppId, appKey: LCAppKey})

export class IM {
  userId: String

  public static shareIM() {
    if (!_instance) {
      _instance = new IM()
    }
    return _instance
  }

  private constructor() {
  }

  getClient(): Promise<any>{
    return new Promise(async (resolve, reject) => {
      if (!this.userId) {
        console.warn('没登录')
        return reject('没登录')
      }

      if (!_client) {
        let realtime = new Realtime({
          appId: LCAppId,
          plugins: [TypedMessagesPlugin], // 注册富媒体消息插件
          region: 'cn'
        })
        _client = await realtime.createIMClient(this.userId)
      }

      resolve(_client)
    })
  }

  public login(userId) {3
    this.userId = userId

    this.receiveMsg(null)
  }

  public async receiveMsg(callback) {
    let client  = await this.getClient()
    client.on('message', (message, conversation) => {
      callback && callback(conversation, message)
    })
  }

  public async createSingleConversation(toUserId) {4
    let client  = await this.getClient()
    return client.createConversation({
      members: [this.userId, toUserId],
      unique: true
    })
  }

  public sendTextMsg(conversation, text) {
    return conversation.send(new TextMessage(text))
  }
}
