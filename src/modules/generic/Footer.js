import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform, Image} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUsers, faHome, faBell, faComment} from '@fortawesome/free-solid-svg-icons';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationActions, StackActions} from 'react-navigation';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  redirect(route, layer){
    this.props.navigation.navigate(route)
  }

  navigateToScreen = (route) => {
    if(route != 'Status') {
      this.props.navigation.toggleDrawer();
    }
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: route, params: {
              initialRouteName: route,
              index: 0
            }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render (){
    const { theme } = this.props.state;
    const { layer } = this.props;
    return(
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          height: 50,
          zIndex: 0,
          backgroundColor: Color.containerBackground
        }}>
          {
            layer == 0 && (
              <TouchableOpacity
                onPress={() => this.redirect('Connections')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%'
                }}
                >
                <FontAwesomeIcon
                  icon={faUsers}
                  size={BasicStyles.iconSize}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: theme ? theme.primary : Color.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
            )
          }

          {
            layer == 1 && (
              <TouchableOpacity
                onPress={() => this.redirect('Homepage')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%'
                }}
                >
                <FontAwesomeIcon
                  icon={faHome}
                  size={BasicStyles.iconSize}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: theme ? theme.primary : Color.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
            )
          }
         


          <TouchableOpacity
          onPress={() => this.navigateToScreen('Status')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '33%'
          }}
          >
            <Image source={require('assets/logo.png')} style={{
                height: 30,
                width: 30
            }} />
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => this.redirect('notificationStack')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '33%'
          }}
          >
          <FontAwesomeIcon
            icon={faBell}
            size={BasicStyles.iconSize}
            style={[
              BasicStyles.iconStyle,
              {
                color: theme ? theme.primary : Color.primary,
              },
            ]}
          />
          </TouchableOpacity>
      </View>
    )
  }
};

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);
