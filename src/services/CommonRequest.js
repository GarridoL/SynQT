import Api from 'services/api/index.js';
import Config from 'src/config.js';
import { Routes } from 'common';
export default {
  retrieveMessages (messengerGroup, callback, errorCb = null){
    if(messengerGroup == null){
      return
    }
    let parameter = {
      condition: [{
        value: messengerGroup.id,
        column: 'messenger_group_id',
        clause: '='
      }],
      sort: {
        'created_at': 'ASC'
      }
    }
    Api.request(Routes.messengerMessagesRetrieve, parameter, response => {
      if(callback){
        callback(response)
      }
    }, error => {
      if(errorCb){
        errorCb(error)
      }
    });
  },
  updateMessageStatus (parameter, callback){
    Api.request(Routes.messengerMessagesUpdate, parameter, response => {
      if(callback){
        callback(response)
      }
    });
  },
  retrieveMessengerGroup(messengerGroup, user, callback, errorCb = null){
    let parameter = {
      condition: [{
        value: messengerGroup.id,
        column: 'id',
        clause: '='
      }],
      account_id: user.id
    }
    Api.request(Routes.messengerGroupRetrieveByParams, parameter, response => {
      if(callback){
        callback(response)
      }
    }, error => {
      if(errorCb){
        errorCb(error)
      }
    });
  },
  retrieveMessengerGroups(user, callback, errorCb = null){
    let parameter = {
      account_id: user.id,
      code: null
    }
    Api.request(Routes.messengerGroupRetrieve, parameter, response => {
      if(callback){
        callback(response)
      }
    }, error => {
      if(errorCb){
        errorCb(error)
      }
    });
  }
}