import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'

import Webchat from './containers/App'

// https://github.com/babel/babel-loader/issues/401
if (!global._babelPolyfill) {
  require('babel-polyfill')
}

export default class CaiWebchat extends Component {
  render () {
    return (
      <Provider store={store}>
        <Webchat {...this.props} />
      </Provider>
    )
  }
}

const getApplicationParse =  messages  => {
  return new Promise(resolve => {
    if (!window.webchatMethods || !window.webchatMethods.applicationParse) {
      return resolve()
    }
    // so that we process the message in all cases
    setTimeout(resolve, MAX_GET_MEMORY_TIME)
    try {
      const applicationParseResponse = window.webchatMethods.applicationParse(messages)
      if (!applicationParseResponse) {
        return resolve()
      }
      if (applicationParseResponse.then && typeof applicationParseResponse.then === 'function') {
        // the function returned a Promise
        applicationParseResponse
          .then(applicationParse => resolve())
          .catch(err => {
            console.error(FAILED_TO_GET_MEMORY)
            console.error(err)
            resolve()
          })
      } else {
        resolve()
      }
    } catch (err) {
      console.error(FAILED_TO_GET_MEMORY)
      console.error(err)
      resolve()
    }
  })
}


// componentWillReceiveProps(nextProps) {
//   const { messages, show } = nextProps
//   if (messages !== this.state.messages) {
//     getApplicationParse(messages)
//     this.setState({ messages }, () => {
//       const { getLastMessage } = this.props
//       if (getLastMessage) {
//         getLastMessage(messages[messages.length - 1])
//       }
//     })
//   }
//   if (show && show !== this.props.show && !this.props.sendMessagePromise && !this._isPolling) {
//     this.doMessagesPolling()
//   }
// }