import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {createStackNavigator} from '@react-navigation/stack';
import {BasicStyles} from 'common';
import DisplayThemes from './';
import {connect} from 'react-redux';
import StackHeaderTitle from 'modules/generic/StackHeaderTitle';
import NavigatorHeader from 'modules/generic/NavigatorHeader';


const stackNavigator = createStackNavigator();

const DisplayScreen = props => {
  return (
    <stackNavigator.Navigator>
      <stackNavigator.Screen
        name="Theme"
        children={route => (
          <DisplayThemes
            {...route}
            parentNav={props.parentNav}
            initialPage={props.initialPage}
          />
        )}
        options={({route}) => {
          return {
            headerTitle: () => (
              <StackHeaderTitle title={null}/>
            ),
            // headerTransparent: true,
            headerStyle: {
              shadowColor: 'transparent',
              elevation: 0
            },
            headerLeft: () => (
              <NavigatorHeader {...props} />
            ),
          };
        }}
      />
      
    </stackNavigator.Navigator>
  );
};

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DisplayScreen);
