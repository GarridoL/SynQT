import React, { Component } from 'react';
import Style from './Style.js';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Image, Text, TouchableHighlight, ScrollView, Linking } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import LinearGradient from 'react-native-linear-gradient'
import { Dimensions } from 'react-native';
import Button from '../generic/Button.js';
import dynamicLinks from '@react-native-firebase/dynamic-links';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Landing extends Component {
  constructor(props) {
    super(props);
  }

  onFocusFunction = async () => {
    /**
     * Executed each time we enter in this component &&
     * will be executed after going back to this component 
    */
    Linking.getInitialURL().then(url => {
      this.navigate(url);
    });
    Linking.addEventListener('url', this.handleOpenURL);
  }


  componentDidMount() {
    this.getTheme()
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  componentWillUnmount() { // C
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => { // D
    this.navigate(event.url);
  }

  navigate = (url) => { // E
    if(url) {
      let parameter = url?.split('?')[1];
      const routeName = parameter?.split('%2F');
      const params = routeName[routeName?.length - 1]?.split('-');
      dynamicLinks().getInitialLink().then(link => {
        if (link.url === 'https://wearesynqt/profile') {
          const { setDeepLinkRoute } = this.props;
          setDeepLinkRoute(params);
        }
      });
    }
  }

  getTheme = async () => {
    try {
      const primary = await AsyncStorage.getItem(Helper.APP_NAME + 'primary');
      const secondary = await AsyncStorage.getItem(Helper.APP_NAME + 'secondary');
      const tertiary = await AsyncStorage.getItem(Helper.APP_NAME + 'tertiary');
      const fourth = await AsyncStorage.getItem(Helper.APP_NAME + 'fourth');
      const gradient = await AsyncStorage.getItem(Helper.APP_NAME + 'gradient');
      if (primary != null && secondary != null && tertiary != null) {
        const { setTheme } = this.props;
        setTheme({
          primary: primary,
          secondary: secondary,
          tertiary: tertiary,
          fourth: fourth,
          gradient: JSON.parse(gradient)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { theme } = this.props.state;
    return (
      <LinearGradient
        colors={theme && theme.gradient !== undefined && theme.gradient !== null ? theme.gradient : Color.gradient}
        // colors={[theme ? theme.primary : Color.primary, theme ? theme.primary : Color.secondary, Color.primary]}
        locations={[0, 0.5, 1]} start={{ x: 2, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ height: '100%' }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{
            height: height,
            flex: 1,
            marginBottom: 10
          }}>
            <View style={{
              height: '53%',
              width: width,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 100,
            }}>
              <Image source={require('assets/new2.png')} style={{ width: '90%', height: '90%' }} />
            </View>
            <View style={{
              width: '100%',
              alignItems: 'center'
            }}>
              <Text style={{
                color: 'white',
                fontFamily: 'Poppins-LightItalic',
                fontSize: 18
              }}>
                CHOOSING TOGETHER
              </Text>
              <Text style={{
                color: 'white',
                fontFamily: 'Poppins-LightItalic',
                fontSize: 18
              }}>
                ENJOYING TOGETHER.
              </Text>
            </View>
            <View>
              <Button content={<Text style={{ color: 'white' }}>Get Started</Text>}
                styles={[BasicStyles.btnRound, {
                  marginTop: '20%',
                  width: '50%'
                }]} redirect={() => this.props.navigation.navigate('registerStack')} />
            </View>
            <View style={{
              width: '100%',
              alignItems: 'center'
            }}>
              <Text style={{
                color: 'white',
                fontSize: BasicStyles.standardFontSize + 2
              }}>Already have an account?&nbsp;&nbsp;
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: BasicStyles.standardFontSize + 2
                  }}
                  onPress={() => this.props.navigation.navigate('loginStack')}>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}
const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setTheme: (theme) => dispatch(actions.setTheme(theme)),
    setDeepLinkRoute: (deepLinkRoute) => dispatch(actions.setDeepLinkRoute(deepLinkRoute))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(Landing);