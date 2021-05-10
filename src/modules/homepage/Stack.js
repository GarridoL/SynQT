import React from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, Dimensions} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {BasicStyles} from 'common';
import HomePageScreen from './index';
import {connect} from 'react-redux';
import StackHeaderTitle from 'modules/generic/StackHeaderTitle';
import { Color } from 'common';
import NavigatorHeader from 'modules/generic/NavigatorHeader';
const width = Math.round(Dimensions.get('window').width)

const TasksStack = createStackNavigator();

const Stack = props => {
  const toggle = () => {
    console.log('toggle')
  }
  return (
    <TasksStack.Navigator>
      <TasksStack.Screen
        name="HomePage"
        children={route => (
          <HomePageScreen
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
      
    </TasksStack.Navigator>
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
