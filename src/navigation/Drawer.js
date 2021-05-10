import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faQrcode } from '@fortawesome/free-solid-svg-icons';
import Slider2 from 'modules/slider/index2';
import { Color, BasicStyles } from 'common';
import Homepage from 'modules/homepage';
import Connections from 'src/modules/connection';
import Settings from 'modules/display';
import Privacy from 'modules/privacy';
import Status from 'modules/status';
import OptionRight from './OptionRight';
import TermsAndConditions from 'modules/termsAndConditions';
import Messenger from 'modules/messenger';
import Header from 'src/modules/generic/Header'
import SimlHeader from 'src/modules/generic/SimlHeader'

import Style from './Style.js';
import { connect } from 'react-redux'

// const width = Math.round(Dimensions.get('window').width);
const width = Math.round(Dimensions.get('window').width);
class MenuDrawerStructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginState: true,
    };
  }
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}></View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setQRCodeModal: (isVisible) => {
      dispatch(actions.setQRCodeModal({ isVisible: isVisible }))
    },
  };
};

const _StackNavigator = createStackNavigator({
  Homepage: {
    screen: Homepage,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  Messenger: {
    screen: Messenger,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  Connections: {
    screen: Connections,
    navigationOptions: ({navigation}) => ({
      title: 'Connections',
      headerRight: <SimlHeader navigation={navigation} />,
      headerLeft: null,
      ...{
        headerStyle: {
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 12,
          marginLeft: '25%'
        },
        headerTitleContainerStyle: {
          backgroundColor: Color.white,
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: 64
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },  
      }
    }),
  },
  Settings: {
    screen: Settings,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  TermsAndConditions: {
    screen: TermsAndConditions,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  Privacy: {
    screen: Privacy,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  Status: {
    screen: Status,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
});

const Drawer = createDrawerNavigator(
  {
    Homepage: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Messenger: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Profile: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Notification: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Settings: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    TermsAndConditions: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Privacy: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Status: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
  },
  {
    contentComponent: Slider2,
    drawerWidth: width,
    initialRouteName: 'Homepage'
  },
);

export default Drawer;
