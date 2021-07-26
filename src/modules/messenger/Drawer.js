import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft, faBars} from '@fortawesome/free-solid-svg-icons';
import Screen from 'modules/messenger/index.js';
import {NavigationActions} from 'react-navigation';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';
const width = Math.round(Dimensions.get('window').width);
class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop()
  };
  render() {
    const { theme } = this.props.state;
    return (
      <View style={{flexDirection: 'row', width: width}}>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {};
};
let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const MainMessageStack = createStackNavigator({
  mainMessageScreen: {
    screen: Screen,
    navigationOptions: ({navigation}) => ({
      title: 'Messages',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      headerStyle: {
        elevation: BasicStyles.elevation,
        backgroundColor: Color.white,
        height: 60
      },
      headerTitleContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.white,
        width: width - 120
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },  
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainMessageStack);
