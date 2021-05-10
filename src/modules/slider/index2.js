
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Style';
import { NavigationActions, SafeAreaView, StackActions } from 'react-navigation';
import { ScrollView, Text, View, Image, Share, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Helper, BasicStyles, Color } from 'common';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCopy, faSignOutAlt, faTimes, faUserCircle, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient'
import { Dimensions } from 'react-native';
import { color } from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class Slider2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [],
    }
  }
  navigateToScreen = (route) => {
    if (route == 'share') {
      this.onShare()
      return
    }
    this.props.navigation.toggleDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: route, params: {
              initialRouteName: route,
              index: 0
            }
          }),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

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

  redirect(route) {
    this.props.navigation.navigate(route);
    this.props.navigation.toggleDrawer();
  }

  logoutAction() {

    //clear storage
    const { logout, setActiveRoute } = this.props;
    logout();
    // setActiveRoute(null)
    this.props.navigation.navigate('loginStack');
  }

  render() {
    const { user, theme } = this.props.state;
    const { colors } = this.state
    console.log('[COLOR]', theme)
    return (
      <SafeAreaView>
      <LinearGradient
        colors={theme && theme.gradient !== undefined && theme.gradient !== null ? theme.gradient : Color.gradient}
        locations={[0, 0.5, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: height, paddingRight: 10, marginTop: '-1%', width: width }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ backgroundColor: Color.white, height: height, width: '25%', borderTopRightRadius: 50, borderBottomRightRadius: 50, zIndex: 999, elevation: 50 }}>
              <View style={{ marginTop: '40%', marginLeft: 10 }}>
                <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
                  <FontAwesomeIcon color={Color.primary} icon={faTimes} size={BasicStyles.iconSize}></FontAwesomeIcon>
                </TouchableOpacity>
              </View>
            </View>
            {
              user != null ? (
                <View style={{ marginTop: '10%', position: 'absolute', right: 0 }}>
                  {
                    user.account_profile != null && user.account_profile.url != null && (
                      <View style={{ flex: 1, flexDirection: 'row', marginTop: '10%', position: 'absolute', right: 0 }}>
                        <Text style={{ color: Color.white, fontWeight: 'bold', marginTop: '8%', marginRight: 10 }}>{user.account_information.first_name} {user.account_information.last_name}</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('profileStack')}>
                          <Image
                            source={{ uri: Config.BACKEND_URL + user.account_profile.url }}
                            style={[BasicStyles.profileImageSize, {
                              height: 50,
                              width: 50,
                              borderRadius: 50,
                              borderWidth: 2,
                              borderColor: Color.warning
                            }]} />
                        </TouchableOpacity>
                      </View>

                    )
                  }
                  {
                    (user.account_profile == null || (user.account_profile != null && user.account_profile.url == null)) && (
                      <View style={{ flex: 1, flexDirection: 'row', marginTop: '10%', position: 'absolute', right: 0 }}>
                        <Text style={{ color: Color.white, fontWeight: 'bold', marginTop: '8%', marginRight: 10 }}>{user.username}</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('profileStack')}>
                          <FontAwesomeIcon
                            icon={faUserCircle}
                            size={50}
                            style={{
                              color: Color.white
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    )
                  }
                </View>
              ) : (
                <Text style={[styles.sectionHeadingStyle, {
                  paddingTop: 150,
                  backgroundColor: theme ? theme.primary : Color.primary
                }]}>
                  Welcome to {Helper.company}!
                </Text>
              )
            }
            <View style={{ marginTop: '60%', position: 'absolute', right: 0, alignItems: 'flex-end' }}>
              {Helper.DrawerMenu.length > 0 &&
                Helper.DrawerMenu.map((item, index) => {
                  return (
                    <TouchableOpacity style={[styles.navSectionStyle, { flexDirection: 'row-reverse', width: '200%', paddingBottom: 10 }]} onPress={() => item.title == 'Connections' ? this.redirect('connectionStack') : (item.title == 'Messages' ? this.redirect('mainMessageStack') : this.navigateToScreen(item.route))}>
                      <View style={[styles.navSectionStyle, { flex: 1, flexDirection: 'row-reverse', width: '200%' }]}>
                        <FontAwesomeIcon style={styles.navItemStyle} icon={item.icon} size={BasicStyles.iconSize}></FontAwesomeIcon>
                        <Text style={{ color: Color.white, marginRight: 10, marginTop: 2 }}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
              <View style={[styles.navSectionStyle, { borderBottomWidth: 0, flex: 1, position: 'absolute', bottom: -50, borderTopWidth: 1, width: width, borderColor: 'white' }]}>
                <TouchableOpacity onPress={() => this.navigateToScreen('TermsAndConditions')} style={{ flexDirection: 'row-reverse', paddingTop: 20 }}>
                  <FontAwesomeIcon style={styles.navItemStyle} icon={faCopy} size={BasicStyles.iconSize}></FontAwesomeIcon>
                  <Text style={{ color: Color.white, marginRight: 10 }}> Terms and Conditions</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.navigateToScreen('Privacy')} style={{ flexDirection: 'row-reverse', paddingTop: 20 }}>
                  <FontAwesomeIcon style={styles.navItemStyle} icon={faShieldAlt} size={BasicStyles.iconSize}></FontAwesomeIcon>
                  <Text style={{ color: Color.white, marginRight: 10 }}> Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.logoutAction()} style={{ flexDirection: 'row-reverse', paddingTop: 20 }}>
                  <FontAwesomeIcon style={styles.navItemStyle} icon={faSignOutAlt} size={BasicStyles.iconSize}></FontAwesomeIcon>
                  <Text style={{ color: Color.white, marginRight: 10 }}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      </SafeAreaView>
    );
  }
}

Slider2.propTypes = {
  navigation: PropTypes.object
};

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setActiveRoute: (route) => dispatch(actions.setActiveRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Slider2);
