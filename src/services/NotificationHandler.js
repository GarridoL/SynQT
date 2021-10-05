import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import {Helper} from 'common';
import { navigationRef } from 'modules/generic/SecurityAlert';
import NotificationSounds, { playSampleSound } from 'react-native-notification-sounds';
import Api from 'services/api/index.js';
import { fcmService } from 'services/broadcasting/FCMService';
class NotificationHandler extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { notificationHandler } = this.props;
    notificationHandler(this);
  }
  componentWillUnmount() {
   const { notificationHandler } = this.props;
   notificationHandler(undefined);
  }

  onRegister = (token) => {
    console.log('a')
  }
  
  onOpenNotification = (notify) => {
    console.log('a')
    // console.log("[App] onOpenNotification", notify)
  }

  setTopics(){
    const { user } = this.props.state;
    if(fcmService && user){
      fcmService.subscribeTopic(user.id)
      if(user && user.scope_location !== null){
        fcmService.subscribeTopic(user.scope_location)
      }
      const { myDevice } = this.props.state;
      if(user.devices && user.devices.indexOf(myDevice.unique_code) >= 0){
        fcmService.subscribeTopic(myDevice.unique_code)
      }
      fcmService.subscribeTopic('ticket-comment-' + user.id)
    }
  }

  removeTopics(){
    const { user } = this.props.state;
    if(fcmService && user){
      fcmService.unsubscribeTopic(user.id)
      if(user && user.scope_location !== null){
        fcmService.unsubscribeTopic(user.scope_location)
      }
      const { myDevice } = this.props.state;
      if(user.devices && user.devices.indexOf(myDevice.unique_code) >= 0){
        fcmService.unsubscribeTopic(myDevice.unique_code)
      }
      fcmService.unsubscribeTopic('ticket-comment-' + user.id)
    }
  }

  playSound = () => {
    NotificationSounds.getNotifications('notification').then(soundsList => {
      let audio = null
      for (var i = 0; i < soundsList.length; i++) {
        let item = soundsList[i]
        if(item.title === 'Doorbell'){
          audio = item
          break
        }
      }
      if(soundsList && audio == null){
        audio = soundsList[1]
      }
      playSampleSound(audio); 
    });
  }

  onNotification = (notify) => {
    const { user } = this.props.state;
    let data = null
    if(user == null || !notify.data){
      return
    }
    let notif = notify.data
    data = JSON.parse(notif.data)
    let topic = data.topic
    console.log('payload', topic)
    switch(topic?.toLowerCase()){
      case 'message': {
          const { messengerGroup } = this.props.state;
          if(parseInt(data.messenger_group_id) === messengerGroup?.id){
            console.log('hi');
            if(parseInt(data.account_id) != user.id){
              const { updateMessagesOnGroup } = this.props;
              updateMessagesOnGroup(data);
              this.playSound()
            }
            return
          }
        }
        break
      case 'notifications': {
          if(parseInt(data.to) == user.id){
            console.log("[Notifications] data", data)
            const { updateNotifications } = this.props;
            updateNotifications(1, data)
          }
        }
        break
      case 'new_request_on_location': {
          console.log('new request on scope location', data)
          if(user && user.scope_location == data.to){
            this.playSound()
          }else{
            console.log('scope not match')
          }
        }
        break;
      case 'requests': {
          console.log('requests', user)
          let unReadRequests = this.props.state.unReadRequests
          if(data.target == 'public'){
            console.log("[Public Requests]", data)
            unReadRequests.push(data)
            const { setUnReadRequests } = this.props;
            setUnReadRequests(unReadRequests);
            // setUnReadRequests($unReadRequests);
          }else if(data.target == 'partners'){
            const { user } = this.props.state;
            if(user == null){
              return
            }else{
              if(user.account_type === 'PARTNER' && (Number(data.account_id) != user.id)){
                console.log("[Partner Requests]", data)
                unReadRequests.push(data)
                const { setUnReadRequests } = this.props;
                setUnReadRequests(unReadRequests);
                this.playSound()
              }else if(user.id === Number(data.account_id)){
                console.log("[Same Requests]", data)
                unReadRequests.push(data)
                const { setUnReadRequests } = this.props;
                setUnReadRequests(unReadRequests);
              }else if((data.scope != '' || data.scope != null)&& (data.account_id != user.id) && (user.scope_location.includes(data.scope))){
                console.log("[Partner Requests] added", data)
                unReadRequests.push(data)
                const { setUnReadRequests } = this.props;
                setUnReadRequests(unReadRequests);
                // setUnReadRequests($unReadRequests);
              }
            }
          }else if(data.target == 'circle'){
            //
          }
        }
        break
      case 'withdraw_requests': {
          console.log('withdraw_requests', data)
          // let unReadRequests = this.props.state.unReadRequests
          // if(data.target == 'partners'){
          //   const { user } = this.props.state;
          //   if(user == null){
          //     return
          //   }else{
          //     if(user.account_type === 'PARTNER' && (Number(data.account_id) != user.id)){
          //       console.log("[Partner Requests]", data)
          //       unReadRequests.push(data)
          //       const { setUnReadRequests } = this.props;
          //       setUnReadRequests(unReadRequests);
          //     }
          //   }
          // }
        }
        break
      case 'payments': {
        const { setAcceptPayment } = this.props;
        if(data.to && parseInt(data.to) == user.id){
          if(data.transfer_status == 'requesting'){
            setAcceptPayment(data)
            Alert.alert(
              "Payment Request",
              "There\'s new payment request, would you like to open it?",
              [
                {
                  text: "Cancel",
                  onPress: () => {
                    setAcceptPayment(null)
                  },
                  style: "cancel"
                },
                { text: "Yes", onPress: () => {
                  navigationRef.current?._navigation.navigate('recievePaymentRequestStack')
                } }
              ]
            );            
          }else{
            // declined or completed here
            console.log('on confirm', data)
            setAcceptPayment(data)
            const { setPaymentConfirmation } = this.props;
            setPaymentConfirmation(false)
            navigationRef.current?._navigation.navigate('Dashboard')
          }
          this.playSound()
        }
      }
      break
      case 'ticket-comment': {
        const { setComments } = this.props;
        const { currentTicket } = this.props.state;

        if(currentTicket && currentTicket.id == data.payload_value){
          // payload_value as ticket id
          const { comments } = this.props.state;
          if(comments.length > 0){
            comments.unshift(data)
          }else{
            comments.push(data)
          }
          setComments(comments)
          this.playSound()
        }else{
        }
        
      }
      break
      case 'device': {
        const { myDevice } = this.props.state;
        console.log('New device requests', data)
        if(data.to == myDevice.unique_code){
          // show notification
          const { showDeviceNotification } = this.props;
          showDeviceNotification(data)
          this.playSound()
        }else{
          // do nothing
        }
      }
      break
    }
  }

  render(){
    return(
      <View>
      </View>
    )
  }
}

 
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setUnReadMessages: (messages) => dispatch(actions.setUnReadMessages(messages)),
    setUnReadRequests: (requests) => dispatch(actions.setUnReadRequests(requests)),
    updateRequests: (request) => dispatch(actions.updateRequests(request)),
    setRequest: (request) => dispatch(actions.setRequest(request)),
    updateNotifications: (unread, notification) => dispatch(actions.updateNotifications(unread, notification)),
    updateMessagesOnGroup: (message) => dispatch(actions.updateMessagesOnGroup(message)),
    viewChangePass: (changePassword) => dispatch(actions.viewChangePass(changePassword)),
    setComments: (comments) => dispatch(actions.setComments(comments)),
    setAcceptPayment: (acceptPayment) => dispatch(actions.setAcceptPayment(acceptPayment)),
    setPaymentConfirmation: (flag) => dispatch(actions.setPaymentConfirmation(flag)),
    showDeviceNotification: (deviceNotification) => dispatch(actions.showDeviceNotification(deviceNotification))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationHandler);
