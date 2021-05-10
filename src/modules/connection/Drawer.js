import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Share } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faBars, faShare } from '@fortawesome/free-solid-svg-icons';
import Connection from 'modules/connection';
import { NavigationActions } from 'react-navigation';
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
    isViewing: false
  }
  back = () => {
    this.props.navigationProps.pop()
  };

  onShare = async () => {
    const { user } = this.props.state;
    if (user == null) {
      return
    }
    try {
      const result = await Share.share({
        message: 'https://wearesynqt/profile/' + user.code
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  viewMenu = () => {
    const { viewMenu } = this.props // new
    viewMenu(!this.props.state.isViewing) // new
  }

  onShare = async () => {
    const { user } = this.props.state;
    if(user == null){
      return
    }
    try {
      const result = await Share.share({
        message: 'http://app.wearesiml.com/'
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  render() {
    const { theme } = this.props.state;
    return (
      <TouchableOpacity onPress={() => {
        this.onShare()
      }}>
        <View style={{ paddingRight: 8, marginRight: 55 }} >
          <FontAwesomeIcon icon={faShare} size={BasicStyles.iconSize + 5} style={{ color: Color.gray, marginRight: 10 }} />
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    viewMenu: (isViewing) => dispatch(actions.viewMenu(isViewing))
  };
};
let HeaderOptionsConnect = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const TermsAndConditionsStack = createStackNavigator({
  termsAndConditionsScreen: {
    screen: Connection,
    navigationOptions: ({ navigation }) => ({
      title: 'Connections',
      headerRight: <HeaderOptionsConnect navigationProps={navigation} />,
      ...{
        headerStyle: {
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 12,
          width: width,
          marginLeft: 60
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermsAndConditionsStack);
