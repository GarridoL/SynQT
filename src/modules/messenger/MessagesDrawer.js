import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faEllipsisV, faStar } from '@fortawesome/free-solid-svg-icons';
import Messages from 'modules/messenger/Messages.js';
import { Color, BasicStyles, Helper, Routes } from 'common';
import { UserImage } from 'components';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }

  back = () => {
    this.props.navigationProps.pop();
  };

  redirect = (route) => {
    this.props.navigationProps.navigate(route, {
      synqt_id: this.props.navigationProps?.state?.params?.data?.payload,
      messenger_group_id: this.props.navigationProps?.state?.params?.data,
      fromRestaurantForm: false
    });
  }

  _card = () => {
    const { theme } = this.props.state;
    const { data, status, isReserved } = this.props.navigationProps.state.params
    const { setShowSettings } = this.props;
    return (
      <View style={{
        width: width,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {
          data != null && (
            <View style={{
              flexDirection: 'row',
              width: '100%'
            }}>
              <Text style={{
                color: theme ? theme.primary : Color.primary,
                lineHeight: 30,
                paddingLeft: 1,
                // marginRight: 40
              }}>{this.props.state.currentTitle}</Text>
            </View>
          )}
        <View style={{
          flex: 1,
          flexDirection: 'row',
          position: 'absolute',
          right: 50
        }}>
          <TouchableOpacity onPress={() => {
            if (status !== 'completed' && isReserved === false) {
              this.redirect('topChoiceStack')
            } else if (status !== 'completed' && isReserved === true) {
              Alert.alert('', 'You already have an existing reservation.')
            }
          }}>
            <View style={{
              borderWidth: 2,
              borderRadius: 20,
              height: 30,
              width: 30,
              borderColor: theme ? theme.primary : Color.primary,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FontAwesomeIcon
                color={Color.warning}
                icon={faStar}
                size={20}
                style={BasicStyles.iconStyle} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => status !== 'completed' && isReserved === false ?
            this.redirect('menuStack') : status !== 'completed' && isReserved === true ? Alert.alert('', 'You already have an existing reservation.') : console.log(isReserved)}>
            <View style={{
              borderWidth: 2,
              borderRadius: 20,
              height: 30,
              width: 30,
              borderColor: Color.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5
            }}>
              <Image source={require('assets/logo.png')} style={{
                height: 20,
                width: 20
              }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setShowSettings(!this.props.state.showSettings)
          }}>
            <View>
              <FontAwesomeIcon
                icon={faEllipsisV}
                size={BasicStyles.iconSize}
                style={BasicStyles.iconStyle, { color: theme ? theme.primary : Color.primary }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  render() {
    const { theme } = this.props.state;
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.containerBackground
      }}
      >
        <TouchableOpacity style={{
        }} onPress={this.back.bind(this)}
        >
          <FontAwesomeIcon
            color={theme ? theme.primary : Color.primary}
            icon={faChevronLeft}
            size={BasicStyles.iconSize}
            style={BasicStyles.iconStyle} />
        </TouchableOpacity>
        {
          this._card()
        }
      </View>
    );
  }
}


const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setMessagesOnGroup: (messagesOnGroup) => dispatch(actions.setMessagesOnGroup(messagesOnGroup)),
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup)),
    setShowSettings: (showSettings) => dispatch(actions.setShowSettings(showSettings))
  };
};

let HeaderOptionsConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderOptions);

const MessagesStack = createStackNavigator({
  messagesScreen: {
    screen: Messages,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesStack);