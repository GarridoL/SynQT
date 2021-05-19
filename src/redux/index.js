import AsyncStorage from '@react-native-community/async-storage';
import Data from 'services/Data';
import {Helper, Color} from 'common';

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  UPDATE_USER: 'UPDATE_USER',
  SET_THEME: 'SET_THEME',
  SET_LAYER: 'SET_LAYER',
  VIEW_MENU: 'VIEW_MENU',
  SET_MESSENGER_GROUP: 'SET_MESSENGER_GROUP',
  UPDATE_MESSENGER_GROUP: 'UPDATE_MESSENGER_GROUP',
  SET_MESSAGES_ON_GROUP: 'SET_MESSAGES_ON_GROUP',
  UPDATE_MESSAGES_ON_GROUP: 'UPDATE_MESSAGES_ON_GROUP',
  UPDATE_MESSAGE_BY_CODE: 'UPDATE_MESSAGE_BY_CODE',
  UPDATE_MESSAGES_ON_GROUP_BY_PAYLOAD: 'UPDATE_MESSAGES_ON_GROUP_BY_PAYLOAD',
  SET_STATUS_SEARCH: 'SET_STATUS_SEARCH',
  SET_CREATE_STATUS: 'SET_CREATE_STATUS',
  SET_LOCATION: 'SET_LOCATION',
  SET_DEVICE_LOCATION: 'SET_DEVICE_LOCATION',
  SET_DEFAULT_ADDRESS: 'SET_DEFAULT_ADDRESS',
  SET_TEMP_MEMBERS: 'SET_TEMP_MEMBERS',
  SET_SHOW_SETTINGS: 'SET_SHOW_SETTINGS',
  SET_CURRENT_TITLE: 'SET_CURRENT_TITLE',
  SET_SELECTED: 'SET_SELECTED',
  SET_COMMENTS: 'SET_COMMENTS'
};

export const actions = {
  login: (user, token) => {
    return {type: types.LOGIN, user, token};
  },
  logout() {
    return {type: types.LOGOUT};
  },
  updateUser: user => {
    return {type: types.UPDATE_USER, user};
  },
  setTheme(theme) {
    return {type: types.SET_THEME, theme};
  },
  setLayer(layer) {
    return {type: types.SET_LAYER, layer};
  },
  viewMenu(isViewing){
    return {type: types.VIEW_MENU, isViewing}
  },
  setMessengerGroup(messengerGroup) {
    return {type: types.SET_MESSENGER_GROUP, messengerGroup};
  },
  updateMessengerGroup(messengerGroup) {
    return {type: types.UPDATE_MESSENGER_GROUP, messengerGroup};
  },
  updateMessagesOnGroupByPayload(messages) {
    return {type: types.UPDATE_MESSAGES_ON_GROUP_BY_PAYLOAD, messages};
  },
  setMessagesOnGroup(messagesOnGroup) {
    return {type: types.SET_MESSAGES_ON_GROUP, messagesOnGroup};
  },
  updateMessagesOnGroup(message) {
    return {type: types.UPDATE_MESSAGES_ON_GROUP, message};
  },
  updateMessageByCode(message) {
    return {type: types.UPDATE_MESSAGE_BY_CODE, message};
  },
  setMessenger(unread, messages) {
    return {type: types.SET_MESSAGES, unread, messages};
  },
  setStatusSearch(statusSearch) {
    return {type: types.SET_STATUS_SEARCH, statusSearch};
  },
  setCreateStatus(createStatus) {
    return {type: types.SET_CREATE_STATUS, createStatus};
  },
  setLocation(location) {
    return {type: types.SET_LOCATION, location};
  },
  setDeviceLocation(deviceLocation) {
    return {type: types.SET_DEVICE_LOCATION};
  },
  setDefaultAddress(defaultAddress) {
    return {type: types.SET_DEFAULT_ADDRESS, defaultAddress}
  },
  setTempMembers(tempMembers) {
    return {type: types.SET_TEMP_MEMBERS, tempMembers}
  },
  setShowSettings(showSettings) {
    return {type: types.SET_SHOW_SETTINGS, showSettings}
  },
  setCurrentTitle(currentTitle) {
    return {type: types.SET_CURRENT_TITLE, currentTitle}
  },
  setSelected(selects) {
    return {type: types.SET_SELECTED, selects}
  },
  setComments(comments) {
    return {type: types.SET_COMMENTS, comments}
  }
};

const initialState = {
  token: null,
  user: null,
  theme: null,
  layer: null,
  isViewing: false,
  messenger: null,
  messengerGroup: null,
  messagesOnGroup: {
    groupId: null,
    messages: null,
  },
  unReadMessages: [],
  statusSearch: null,
  createStatus: false,
  location: null,
  deviceLocation: null,
  defaultAddress: null,
  tempMembers: [],
  showSettings: false,
  currentTitle: null,
  selects: null,
  comments: []
};

storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(`${Helper.APP_NAME}${key}`, value);
  } catch (e) {
    // saving error
  }
};

const reducer = (state = initialState, action) => {
  const { type, user, token } = action;
  const { theme, layer } = action;
  const { isViewing, request, defaultAddress } = action;
  const {messengerGroup, messagesOnGroup} = action;
  const {messages, unread, message} = action;
  const { statusSearch } = action;
  const { createStatus } = action;
  const {location, size} = action;
  const {deviceLocation} = action;
  const {tempMembers} = action;
  const {showSettings} = action;
  const {currentTitle} = action;
  const {selects} = action;
  const {comments} = action;
  switch (type) {
    case types.LOGOUT:
      AsyncStorage.clear();
      return Object.assign({}, initialState);
    case types.LOGIN:
      storeData('token', token);
      console.log('LOGIN', true);
      Data.setToken(token);
      return {...state, user, token};
    case types.UPDATE_USER:
      return {
        ...state,
        user,
      };
    case types.SET_THEME:
      console.log('tertiary', theme);
      storeData('primary', theme.primary);
      storeData('secondary', theme.secondary);
      storeData('tertiary', theme.tertiary);
      storeData('fourth', theme.fourth);
      storeData('gradient', JSON.stringify(theme.gradient));
      Color.setPrimary(theme.primary);
      Color.setSecondary(theme.secondary);
      Color.setTertiary(theme.tertiary);  
      Color.setFourth(theme.fourth);
      if(theme.primary === '#4CCBA6'){
        Color.setGradient(['#987BE7', '#b1f2e0', '#4CCBA6'])
      }else if (theme.primary === '#FFCC00'){
        Color.setGradient(['#987BE7', '#ffeb96', '#FFCC00'])
      }else if(theme.primary === '#F88BFF'){
        Color.setGradient(['#987BE7', '#eb97f0', '#f22bff'])
      }else{
        Color.setGradient(['#987BE7', '#9276E6', '#5741D7'])
      }
      return {
        ...state,
        theme,
      };
    case types.SET_LAYER:
      return {
        ...state,
        layer,
      };
    case types.VIEW_SHARE:
      console.log("[IS_VIEWING]", isViewing);
      return {
        ...state,
        isViewing
      }
    case types.SET_MESSAGES:
      let messenger = {
        unread,
        messages,
      };
      console.log('messenger', true);
      return {
        ...state,
        messenger,
      };
    case types.SET_MESSENGER_GROUP:
      return {
        ...state,
        messengerGroup,
      };
    case types.UPDATE_MESSENGER_GROUP:
      return {
        ...state,
        messengerGroup: {
          ...state.messengerGroup,
          created_at_human: messengerGroup.created_at_human,
          rating: messengerGroup.rating,
          status: parseInt(messengerGroup.status),
          validations: messengerGroup.validations,
        },
      };
    case types.SET_MESSAGES_ON_GROUP:
      return {
        ...state,
        messagesOnGroup,
      };
    case types.UPDATE_MESSAGES_ON_GROUP:
      let updatedMessagesOnGroup = null;
      if (state.messagesOnGroup != null) {
        let oldMessages = state.messagesOnGroup.messages;
        if (oldMessages == null || oldMessages.length == 0) {
          console.log(message, 'message');
          updatedMessagesOnGroup = {
            ...state.messagesOnGroup,
            messages: oldMessages.push(message),
          };
        } else {
          if (
            parseInt(message.id) !=
            parseInt(oldMessages[oldMessages?.length - 1].id)
          ) {
            updatedMessagesOnGroup = {
              ...state.messagesOnGroup,
              messages: oldMessages.push(message),
            };
          } else {
            updatedMessagesOnGroup = {
              ...state.messagesOnGroup,
            };
          }
        }
      } else {
        let temp = [];
        temp.push(message);
        updatedMessagesOnGroup = {
          groupId: parseInt(message.messenger_group_id),
          messages: temp,
        };
      }
      return {
        ...state,
        updatedMessagesOnGroup,
      };
    case types.SET_STATUS_SEARCH:
      return {
        ...state,
        statusSearch,
      };
    case types.SET_CREATE_STATUS:
      return {
        ...state,
        createStatus,
      };
    case types.SET_LOCATION:
      return {
        ...state,
        location,
      };
    case types.SET_DEVICE_LOCATION:
      return {
        ...state,
        deviceLocation};
    case types.SET_DEFAULT_ADDRESS: 
      return {
        ...state,
        defaultAddress
      };
    case types.SET_SIZE: 
      return {
        ...state,
        size
      }
    case types.SET_TEMP_MEMBERS: 
      return {
        ...state,
        tempMembers
      }
    case types.SET_SHOW_SETTINGS: 
      return {
        ...state,
        showSettings
      }
    case types.SET_CURRENT_TITLE: 
      return {
        ...state,
        currentTitle
      }
    case types.SET_SELECTED: 
      return {
        ...state,
        selects
      }
    case types.SET_COMMENTS: 
      return {
        ...state,
        comments
      }
    default:
      return {...state, nav: state.nav};
  }
};
export default reducer;