import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {createStackNavigator} from '@react-navigation/stack';
import {BasicStyles} from 'common';
import {connect} from 'react-redux';
import Color from '../../common/Color';


class StackHeaderTitle extends Component {
  constructor(props) {
    super(props);
  }

  render (){
    return(
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: Platform.OS == 'ios' ? 0 : '25%'
        }}>
        <Text
          style={{
            color: Color.containerBackground,
            marginLeft: 7,
            fontFamily: 'Poppins-SemiBold',
            fontSize: 20
          }}>
          {this.props.title}
        </Text>
      </View>
    )
  }
};

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StackHeaderTitle);
