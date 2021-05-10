import React from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, Dimensions} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {BasicStyles} from 'common';
import Screen from './index';
import {connect} from 'react-redux';
import StackHeaderTitle from 'modules/generic/StackHeaderTitle';
import { Color } from 'common';
import NavigatorHeader from 'modules/generic/NavigatorHeader';
const width = Math.round(Dimensions.get('window').width)

const StackNavigator = createStackNavigator();

const Stack = props => {
  const toggle = () => {
    console.log('toggle')
  }
  return (
    <StackNavigator.Navigator>
      <StackNavigator.Screen
        name="Terms & Conditions"
        children={route => (
          <Screen
            {...route}
            parentNav={props.parentNav}
            initialPage={props.initialPage}
          />
        )}
        options={({route}) => {
          return {
            headerTitle: () => (
              <StackHeaderTitle title={"Connections"}/>
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
      
    </StackNavigator.Navigator>
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
)(Stack);
