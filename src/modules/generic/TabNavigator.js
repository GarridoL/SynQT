import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationActions, StackActions} from 'react-navigation';
import HomePage from 'modules/homepage/Stack';
import DisplayStack from 'modules/display/Stack';
import Notification from 'modules/notification/Tab'
import Status from 'modules/status'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faBell, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Color } from 'common'
import { Platform } from 'react-native';
import Style from './TabNavigatorStyle';


const Tab = createBottomTabNavigator();

export default function TabNavigator(props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={
          props.navigation.state.params != null
            ? props.navigation.state.params.initialRouteName
            : 'HomePage'
        }
        tabBarOptions={{
          activeTintColor: '#81CB9C',
          style: {
            height: 60,
          },
          showLabel: false,
          tabStyle: {
            marginTop: '2%',
            marginBottom: '2%',
          },
        }}>
        <Tab.Screen
          name="Connections"
          children={route => (
            <HomePage
              {...route}
              initialPage={props.navigation.state.routeName}
              parentNav={props.navigation}
            />
          )}
          options={{
            tabBarLabel: 'Connections',
            tabBarIcon: () => 
            <FontAwesomeIcon
              icon={faUsers}
              size={30}
              color={Color.gray}
              style={Style.footerIcon}
              />,
          }}
        />
        <Tab.Screen
          name="Status"
          children={route => (
            <Status
              {...route}
              initialPage={props.navigation.state.routeName}
              parentNav={props.navigation}
            />
          )}
          options={{
            tabBarIcon: () => 
            <FontAwesomeIcon
              icon={faBell}
              size={30}
              color={Color.gray}
              style={Style.footerIcon}
              />,
          }}
        />
        <Tab.Screen
          name="Notification"
          children={route => (
            <Notification
              {...props}
            />
          )}
          options={{
            tabBarIcon: () =>
            <FontAwesomeIcon
              icon={faBell}
              size={30}
              color={Color.gray}
              style={Style.footerIcon}
              />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
