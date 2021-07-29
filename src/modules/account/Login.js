import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { View , TextInput , Image, TouchableHighlight, Text, ScrollView, Platform} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Style from './Style.js';
import { Spinner } from 'components';
import PasswordWithIcon from 'components/InputField/Password.js';
import CustomError from 'components/Modal/Error.js';
import Api from 'services/api/index.js';
import CommonRequest from 'services/CommonRequest.js';
import { Routes, Color, Helper, BasicStyles } from 'common';
import Header from './Header';
import config from 'src/config';
import Pusher from 'services/Pusher.js';
import SystemVersion from 'services/System.js';
import { Player } from '@react-native-community/audio-toolkit';
import OtpModal from 'components/Modal/Otp.js';
import LinearGradient from 'react-native-linear-gradient'
import SocialLogin from './SocialLogin'
import {Notifications, NotificationAction, NotificationCategory} from 'react-native-notifications';
import PasswordInputWithIconLeft from 'components/InputField/PasswordWithIcon.js';
import TextInputWithIcon from 'components/InputField/TextInputWithIcon.js';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faComments, faArrowRight, faUser} from '@fortawesome/free-solid-svg-icons';
import Button from '../generic/Button.js'
import { Dimensions } from 'react-native';
import { fcmService } from 'services/broadcasting/FCMService';
import { localNotificationService } from 'services/broadcasting/LocalNotificationService';

const width = Math.round(Dimensions.get('window').width);
class Login extends Component {
  //Screen1 Component
  constructor(props){
    super(props);
    this.state = {
      username: null,
      password: null,
      isLoading: false,
      token: null,
      error: 0,
      isResponseError: false,
      isOtpModal: false,
      blockedFlag: false,
      notifications: []
    };
    this.audio = null;
    this.registerNotificationEvents();
  }
  
  async componentDidMount(){
    this.setState({error: 0})
    this.getTheme()
    if(config.versionChecker == 'store'){
      // this.setState({isLoading: true})
      SystemVersion.checkVersion(response => {
        // this.setState({isLoading: false})
        console.log(response);
        if(response == true){
          this.getData();
        }
      })
    }else{
      this.getData(); 
    }
    this.audio = new Player('assets/notification.mp3');
    const initialNotification = await Notifications.getInitialNotification();
    if (initialNotification) {
      this.setState({notifications: [initialNotification, ...this.state.notifications]});
    }
  }

  getTheme = async () => {
    try {
      const primary = await AsyncStorage.getItem(Helper.APP_NAME + 'primary');
      const secondary = await AsyncStorage.getItem(Helper.APP_NAME + 'secondary');
      const tertiary = await AsyncStorage.getItem(Helper.APP_NAME + 'tertiary');
      const fourth = await AsyncStorage.getItem(Helper.APP_NAME + 'fourth');
      const gradient = await AsyncStorage.getItem(Helper.APP_NAME + 'gradient');
      if(primary != null && secondary != null && tertiary != null) {
        const { setTheme } = this.props;
        setTheme({
          primary: primary,
          secondary: secondary,
          tertiary: tertiary,
          fourth: fourth,
          gradient: JSON.parse(gradient)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  retrieveSystemNotification = () => {
    let parameter = {
      condition: [{
        value: '%' + Platform.OS + '%',
        clause: 'like',
        column: 'device'
      }],
      sort: {
        created_at: 'desc'
      }
    }
    Api.request(Routes.systemNotificationRetrieve, parameter, response => {
      const { setSystemNotification } = this.props;
      if(response.data.length > 0){
        setSystemNotification(response.data[0])
      }else{
        setSystemNotification(null)
      }
    }, error => {
      console.log('error', error)
    });
  }

  redirectToDrawer = (payload) => {
    const { user } =  this.props.state;
    if(user !== null){
      let route = ''
      switch(payload){
        case 'Messenger':
          route = 'Messenger'
          break;
        case 'request':
          route = 'Requests'
          const { setSearchParameter } = this.props;
          let searchParameter = {
            column: 'id',
            value: notification.payload_value
          }
          setSearchParameter(searchParameter)
          break;
        case 'ledger':
          route = 'Dashboard'
          break
      }
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction); 
    }
  }

  registerNotificationEvents() {
    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      this.setState({
        notifications: [...this.state.notifications, notification]
      });

      completion({alert: notification.payload.showAlert, sound: true, badge: false});
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      if(notification.extra != ''){
        this.redirectToDrawer(notification.extra)
      }
      completion();
    });
  }

  requestPermissions() {
    Notifications.registerRemoteNotifications();
  }

  sendLocalNotification(title, body, route) {
    Notifications.postLocalNotification({
        title: title,
        body: body,
        extra: route
    });
  }


  test = () => {
    if(config.TEST == true){
      const { setLayer } = this.props;
      setLayer(0)
      this.props.navigation.navigate('drawerStack');
      return true;
    }
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  }

  playAudio = () => {
    if(this.audio){
      this.audio.play();
    }
  }

  managePusherResponse = (response) => {
    const { user } = this.props.state;
    const data = response.data;
    if(user == null){
      return;
    }
    if(response.type == Helper.pusher.notifications){
      console.log(Helper.pusher.notifications, response);
      if(user.id == parseInt(data.to)){
        const { notifications } = this.props.state;
        const { updateNotifications } = this.props;
        console.log('notif pusher', data)
        this.sendLocalNotification(data.title, data.description, data.payload)
        updateNotifications(1, data);
        this.playAudio()
      }
    }else if(response.type == Helper.pusher.messages){
      console.log(Helper.pusher.messages, response);
      const { messagesOnGroup } = this.props.state;
      const { updateMessagesOnGroup } = this.props;
      if(parseInt(data.messenger_group_id) == messagesOnGroup.groupId &&
        parseInt(data.account_id) != user.id){
        this.playAudio();
        updateMessagesOnGroup(data);
        this.sendLocalNotification('Messenger', data.account.username  + 'sent a message: '  + data.message, 'Messenger')
      }else if(parseInt(data.messenger_group_id) != messagesOnGroup.groupId &&
        parseInt(data.account_id) != user.id){
        this.sendLocalNotification('Messenger', data.account.username  + 'sent a message: '  + data.message, 'Messenger')
        const { setMessenger } = this.props;
        const { messenger } = this.props.state;
        var unread = parseInt(messenger.unread) + 1;
        setMessenger(unread, messenger.messages);
      }
    }else if(response.type == Helper.pusher.messageGroup){
      console.log(Helper.pusher.messageGroup, response);
      const { updateMessengerGroup, updateMessagesOnGroupByPayload } = this.props;
      const { messengerGroup } = this.props.state;
      if(parseInt(data.id) == parseInt(messengerGroup.id)){
        this.playAudio();
        updateMessengerGroup(data)
        if(data.message_update == true){
          // update messages
          const { messengerGroup } = this.props.state;
          CommonRequest.retrieveMessages(messengerGroup, messagesResponse => {
            updateMessagesOnGroupByPayload(messagesResponse.data)
          })
        }
      }else{
        const { setMessenger } = this.props;
        const { messenger } = this.props.state;
        var unread = parseInt(messenger.unread) + 1;
        setMessenger(unread, messenger.messages);
      }
    }else if(response.type == Helper.pusher.systemNotification){
      this.sendLocalNotification(data.title, data.description, 'requests')
    }
  }

  retrieveUserData = (accountId) => {
    console.log('=============', accountId, Helper.retrieveDataFlag);
    if(Helper.retrieveDataFlag == 1){
      this.setState({isLoading: false});
      const { setLayer } = this.props;
      setLayer(0)
      this.props.navigation.navigate('drawerStack');  
    }else{
      const { setNotifications, setMessenger } = this.props;
      let parameter = {
        account_id: accountId
      }
      this.retrieveSystemNotification();
      this.setState({isLoading: true});
      Api.request(Routes.notificationsRetrieve, parameter, notifications => {
        setNotifications(notifications.size, notifications.data)
        Api.request(Routes.messagesRetrieve, parameter, messages => {
          setMessenger(messages.total_unread_messages, messages.data)
          this.setState({isLoading: false});
          Pusher.listen(response => {
            this.managePusherResponse(response)
          });
          // this.props.navigation.replace('loginScreen')
          this.checkOtp()
        }, error => {
          this.setState({isResponseError: true})
        })
      }, error => {
        this.setState({isResponseError: true})
      })
    }
  }

  onRegister = (token) => {
    console.log("[App] onRegister", token)
  }

  onOpenNotification = (notify) => {
  }

  onNotification = (notify) => {
    const { user } = this.props.state;
    let data = null
    if(user == null || !notify.data){
      return
    }
    data = notify.data
    let topic = data.topic.split('-')
    switch(topic[0].toLowerCase()){
      case 'message': {
          const { messengerGroup } = this.props.state;
          let members = JSON.parse(data.members)
          console.log('members', members)
          if(messengerGroup == null && members.indexOf(user.id) > -1){
            console.log('[messengerGroup] on empty', data)
            const { setUnReadMessages } = this.props;
            setUnReadMessages(data)
            return
          }
          if(parseInt(data.messenger_group_id) === messengerGroup.id && members.indexOf(user.id) > -1){
            if(parseInt(data.account_id) != user.id){
              const { updateMessagesOnGroup } = this.props;
              updateMessagesOnGroup(data); 
            }
            return
          }
        }
        break
      case 'comments': {
        const { setComments } = this.props;
        let topicId = topic.length > 1 ? topic[1] : null
        console.log('[comments]', data)
        if(topicId && parseInt(topicId) == user.id){
          setComments(data)
        }else{

        }
        
      }
      break
    }
  }

  firebaseNotification(){
    const { user } = this.props.state;
    if(user == null){
      return
    }
    fcmService.registerAppWithFCM()
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
    localNotificationService.configure(this.onOpenNotification, Helper.APP_NAME)
    fcmService.subscribeTopic('Message-' + user.id)
    // fcmService.subscribeTopic('Notifications-' + user.id)
    // fcmService.subscribeTopic('Requests')
    // fcmService.subscribeTopic('Payments-' + user.id)
    fcmService.subscribeTopic('Comments-' + user.id)
    this.retrieveNotification()
    return () => {
      console.log("[App] unRegister")
      fcmService.unRegister()
      localNotificationService.unRegister()
    }
  }

  retrieveNotification = () => {
    const { setNotifications } = this.props;
    const { user } = this.props.state;
    if(user == null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'to'
      }],
      limit: 10,
      offset: 0
    }
    Api.request(Routes.notificationsRetrieve, parameter, notifications => {
      console.log("[RESTRIEVE]", notifications.data)
      setNotifications(notifications.size, notifications.data)
    }, error => {
    })
  }

  login = () => {
    this.test();
    console.log('STATE TOKEN', this.state.token);
    const { login } = this.props;
    if(this.state.token != null){
      this.setState({isLoading: true});
      Api.getAuthUser(this.state.token, (response) => {
        console.log('[AUTH RESPONSE]', response);
        login(response, this.state.token);
        let parameter = {
          condition: [{
            value: response.id,
            clause: '=',
            column: 'id'
          }]
        }
        console.log('parameter', parameter, Routes.accountRetrieve)
        Api.request(Routes.accountRetrieve, parameter, userInfo => {
          if(userInfo.data.length > 0){
            login(userInfo.data[0], this.state.token);
            this.retrieveUserData(userInfo.data[0].id)
            this.firebaseNotification()
          }else{
            this.setState({isLoading: false});
            login(null, null)
          }
        }, error => {
          console.log(error, 'login-account retrieve');
          // this.setState({isResponseError: true})
        })
      }, error => {
        console.log(error, 'login-authenticate');
        this.setState({isResponseError: true})
      })
    }
  }

  socialLoginGetAuth(){
    const { login } = this.props;
    console.log('Auth');
    if(this.state.token != null){
      this.setState({isLoading: true});
      Api.getSocialAuthUser(this.state.token, response => {
        console.log('[RESPONSE AUTH]', response.data);
        if(response.data.length > 0){
          login(response.data[0], this.state.token);
          let params = {
            condition: [{
              value: response.data[0].id,
              clause: '=',
              column: 'id'
            }]
          }
          Api.request(Routes.accountRetrieve, params, userInfo => {
            console.log('[USER INFO]', userInfo);
            if(userInfo.data.length > 0){
              login(userInfo.data[0], this.state.token);
              this.retrieveUserData(userInfo.data[0].id)
              this.firebaseNotification()
            }else{
              this.setState({isLoading: false});
              login(null, null)
            }
          }, error => {
            console.log(error, 'login-account retrieve');
          })
        }
      }, error => {
        console.log(error, 'login-authenticate');
        this.setState({isResponseError: true})
      })
    }
  }

  getData = async () => {
    try {
      const temp = await AsyncStorage.getItem(Helper.APP_NAME + 'social');
      const token = await AsyncStorage.getItem(Helper.APP_NAME + 'token');
      console.log('======= get data', token);
      if(token != null) {
        this.setState({token: token});
        if(temp){
          this.socialLoginGetAuth()
        }else{
          this.login();
        }
      }
    } catch(e) {
      // error reading value
    }
  }
  
  checkOtp = () => {
    const { user } = this.props.state;
    if(user.notification_settings != null){
      let nSettings = user.notification_settings
      if(parseInt(nSettings.email_otp) == 1 || parseInt(nSettings.sms_otp) == 1){
        this.setState({
          isOtpModal: true,
          blockedFlag: false
        })
        return
      }
    }
    const { setLayer } = this.props;
    setLayer(0)  
    this.props.navigation.navigate('drawerStack');
  }

  onSuccessOtp = () => {
    this.setState({isOtpModal: false})
    const { setLayer } = this.props;
    setLayer(0)  
    this.props.navigation.navigate('drawerStack');
  }

  submit(){
    this.test();
    const { username, password } = this.state;
    const { login } = this.props;
    if((username != null && username != '') && (password != null && password != '')){
      this.setState({isLoading: true, error: 0});
      // Login
      Api.authenticate(username, password, (response) => {
        if(response.error){
          this.setState({error: 2, isLoading: false});
        }
        if(response.token){
          const token = response.token;
          Api.getAuthUser(response.token, (response) => {
            login(response, token);
            let parameter = {
              condition: [{
                value: response.id,
                clause: '=',
                column: 'id'
              }]
            }
            Api.request(Routes.accountRetrieve, parameter, userInfo => {
              if(userInfo.data.length > 0){
                login(userInfo.data[0], token);
                this.retrieveUserData(userInfo.data[0].id)
              }else{
                this.setState({isLoading: false});
                this.setState({error: 2})
              }
            }, error => {
              this.setState({isResponseError: true})
            })
            
          }, error => {
            this.setState({isResponseError: true})
          })
        }
      }, error => {
        console.log('error', error)
        this.setState({isResponseError: true})
      })
      // this.props.navigation.navigate('drawerStack');
    }else{
      this.setState({error: 1});
    }
  }

  render() {
    const { isLoading, error, isResponseError } = this.state;
    const {  blockedFlag, isOtpModal } = this.state;
    const { theme } = this.props.state;
    // console.log('[THEME]', theme);
    return (
      <LinearGradient
        colors={theme && theme.gradient !== undefined  && theme.gradient !== null ? theme.gradient : Color.gradient}
        locations={[0,0.5,1]}
        start={{ x: 2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{height: '100%'}}
        >
        <ScrollView
          style={Style.ScrollView}
          showsVerticalScrollIndicator={false}>
          <View style={[Style.MainContainer]}>
            <Header params={"Sign In"}></Header>

            {error > 0 ? <View style={Style.messageContainer}>
              {error == 1 ? (
                <Text style={Style.messageText}>Please fill up the required fields.</Text>
              ) : null}

              {error == 2 ? (
                <Text style={Style.messageText}>Username and password didn't match.</Text>
              ) : null}

              {error == 3 ? (
                <Text style={Style.messageText}>Your Email does not exist</Text>
              ) : null}
            </View> : null}
            
            <View style={Style.TextContainer}>
                
            <TextInputWithIcon
                onTyping={(username) => this.setState({username})}
                value={this.state.email}
                placeholder={'Username'}
                style={{width: '90%', borderColor: 'white', color: 'black'}}
                icon={faUser}
              />

              <PasswordInputWithIconLeft
                onTyping={(input) => this.setState({
                  password: input
                })}
                style={{width: '80%', borderColor: 'white', color: 'black'}}
                placeholder={'Password'}
              />

              <Text
                onPress={() => this.redirect('forgotPasswordStack')}
                style={{
                  color: 'white',
                  width: '50%',
                  marginLeft: '60%',
                  textDecorationLine:'underline',
                }}
              >Forgot Password?</Text>

              <Button content={
                <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                  <Text style={{color: 'white', fontSize: 15}}>Sign In</Text>
                  <FontAwesomeIcon color={'white'} icon={faArrowRight} style={{marginLeft: 10, marginTop: 1}}/>
                </View>
              } styles={[BasicStyles.btnRound, {
                marginTop: '5%',
                marginLeft: '50%',
                width: '50%'}]} redirect={()=> this.submit()}/>
              

              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  color: Color.white
                }}>Or sign in with</Text>
              </View>

              <SocialLogin
                page={'Login'} 
                login={(user, token) => login(user, token)} 
                retrieveUser={(id)=>this.retrieveUserData(id)}
                setErrorMessage={(error) => this.setState({error: 3})}
                showLoader={(show) => this.setState({isLoading: show})}
                />
              
              <View style={{
                width: '100%',
                alignItems: 'center',
                marginBottom: '10%'
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: BasicStyles.standardFontSize
                }}>Dont't have an account?&nbsp;&nbsp;
                  <Text
                    style={{
                      textDecorationLine:'underline',
                      fontFamily:'Poppins-Bold'
                    }}
                    onPress={()=> this.props.navigation.navigate('registerStack')}>
                      Sign Up
                  </Text>
                </Text>
              </View>

            </View>
          </View>

          <OtpModal
            visible={isOtpModal}
            title={blockedFlag == false ? 'Authentication via OTP' : 'Blocked Account'}
            actionLabel={{
              yes: 'Authenticate',
              no: 'Cancel'
            }}
            onCancel={() => this.setState({isOtpModal: false})}
            onSuccess={() => this.onSuccessOtp()}
            onResend={() => {
              this.setState({isOtpModal: false})
              this.submit()
            }}
            error={''}
            blockedFlag={blockedFlag}
          ></OtpModal>

          {isLoading ? <Spinner mode="overlay"/> : null }
          {isResponseError ? <CustomError visible={isResponseError} onCLose={() => {
            this.setState({isResponseError: false, isLoading: false})
          }}/> : null}
        </ScrollView>
      </LinearGradient>
    );
  }
}
 
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    logout: () => dispatch(actions.logout()),
    setTheme: (theme) => dispatch(actions.setTheme(theme)),
    setLayer: (layer) => dispatch(actions.setLayer(layer)),
    setNotifications: (unread, notifications) => dispatch(actions.setNotifications(unread, notifications)),
    updateNotifications: (unread, notification) => dispatch(actions.updateNotifications(unread, notification)),
    updateMessagesOnGroup: (message) => dispatch(actions.updateMessagesOnGroup(message)),
    setMessenger: (unread, messages) => dispatch(actions.setMessenger(unread, messages)),
    updateMessengerGroup: (messengerGroup) => dispatch(actions.updateMessengerGroup(messengerGroup)),
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup)),
    setMessagesOnGroup: (messagesOnGroup) => dispatch(actions.setMessagesOnGroup(messagesOnGroup)),
    updateMessagesOnGroupByPayload: (messages) => dispatch(actions.updateMessagesOnGroupByPayload(messages)),
    setSearchParameter: (searchParameter) => dispatch(actions.setSearchParameter(searchParameter)),
    setSystemNotification: (systemNotification) => dispatch(actions.setSystemNotification(systemNotification)),
    setComments: (comments) => dispatch(actions.setComments(comments)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
