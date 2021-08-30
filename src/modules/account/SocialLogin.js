import React, { Component } from 'react';
import Style from './Style.js';
import { connect } from 'react-redux';
import { View, Image, Text, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faComments, faReply } from '@fortawesome/free-solid-svg-icons';
import { Routes, Color, Helper, BasicStyles } from 'common';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
import auth from '@react-native-firebase/auth';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  LoginManager,
  GraphRequestManager,
} from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
GoogleSignin.configure();
library.add(fab);
class SocialLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: null,
      userInfo: {},
      googleInfo: {},
      isLoading: false,
    };
  }

  async componentDidMount() {
    console.log('configure');
    await GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
        '961931208022-i05qbn3spsc9jtm3tf0p8h3pf9o5talu.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }

  async retrieveAccountByToken() {
    let token = await localStorage.getItem('token');
    if (token !== null) {
      let parameter = {
        condition: [
          {
            value: token,
            clause: '=',
            column: 'token',
          },
        ],
      };
      Api.request(Routes.accountRetrieve, parameter, userInfo => {
        if (userInfo.data.length > 0) {
          this.props.retrieveUser(userInfo.data[0].id);
          login(userInfo.data[0], token);
        } else {
          login(null, null);
        }
      });
    }
  }

  //login with facebook process
  getInfoFromToken = token => {
    const { login } = this.props;
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name, email',
      },
    };

    const profileRequest = new GraphRequest(
      '/me',
      { token, parameters: PROFILE_REQUEST_PARAMS },
      async (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          this.setState({ userInfo: result });
          console.log('result:', result);
          if (this.props.page === 'Login') {
            await AsyncStorage.setItem(Helper.APP_NAME + 'social', "true")
            let parameter = {
              email: result.email,
              token: token,
            };
            console.log('FB PARAMS', parameter);
            this.props.showLoader(true);
            Api.request(Routes.socialLogin, parameter, response => {
              console.log('RESPONSE', response);
              this.props.showLoader(false);
              if (response.data !== null) {
                if (response.data !== null) {
                  let parameters = {
                    condition: [
                      {
                        value: token,
                        clause: '=',
                        column: 'token',
                      },
                    ],
                  };
                  Api.request(Routes.accountRetrieve, parameters, userInfo => {
                    this.props.retrieveUser(userInfo.data[0].id);
                    login(userInfo.data[0], token);
                  });
                }
              } else if (response.error !== null && response.error.length > 0) {
                this.props.setErrorMessage(response.error);
              }
            });
          } else if (this.props.page === 'Register') {
            let parameter = {
              username: result.name,
              email: result.email,
              token: token,
              password: '',
              config: null,
              account_type: 'USER',
              referral_code: null,
              status: 'ADMIN',
            };
            this.props.socialRegister(parameter);
          }
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  loginWithFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      res => {
        console.log(res);
        if (res.isCancelled) {
          console.log('=>>>>> login is cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('>>>>>>>>>>>>>>', data);
            this.getInfoFromToken(data.accessToken.toString());
            const facebookCredential = auth.FacebookAuthProvider.credential(
              data.accessToken,
            );
            return auth().signInWithCredential(facebookCredential);
          });
        }
      },
      error => {
        console.log('=====>>>>>>', error);
      },
    );
  };
  // =========End===========================================

  // Login with GOOGLE process
  signIn = async () => {
    try {
      const { accessToken, idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      if (googleCredential !== null) {
        this.getGoogleUser();
      }
      return auth().signInWithCredential(googleCredential);
    } catch (e) {
      console.log('[ERROR]', e);
    }
  };

  getGoogleUser = async () => {
    const { login } = this.props;
    let user = await GoogleSignin.getCurrentUser();
    console.log('=========', user);
    this.setState({ googleInfo: user });
    if (this.props.page === 'Login') {
      try {
        let parameter = {
          email: user.user.email,
          token: user.idToken,
        };
        this.setState({ isLoading: true });
        Api.request(Routes.socialLogin, parameter, response => {
          AsyncStorage.setItem(Helper.APP_NAME + 'social', true)
          this.setState({ isLoading: false });
          console.log('RESPONSE', response);
          if (response.data !== null) {
            let parameter = {
              condition: [
                {
                  value: user.idToken,
                  clause: '=',
                  column: 'token',
                },
              ],
            };
            Api.request(Routes.accountRetrieve, parameter, userInfo => {
              console.log('INFO::', userInfo.data[0]);
              this.props.retrieveUser(userInfo.data[0].id);
              login(userInfo.data[0], user.idToken);
            });
          }
        });
      } catch (e) {
        console.log('[ERROR REQUEST]', e);
      }
    } else if (this.props.page === 'Register') {
      let parameter = {
        username: user.user.name,
        email: user.user.email,
        token: user.idToken,
        password: '',
        config: null,
        account_type: 'USER',
        referral_code: null,
        status: 'ADMIN',
      };
      this.props.socialRegister(parameter);
    }
  };

  // ==========END=======================================

  render() {
    return (
      <View
        style={[
          Style.MainContainer,
          {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          },
        ]}>
        {/* <View style={Style.TextContainer}> */}
        <TouchableHighlight
          style={{
            backgroundColor: 'white',
            width: 50,
            height: 50,
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 30,
            borderRadius: 50
          }}
          onPress={() => this.loginWithFacebook()}>
          <FontAwesomeIcon
            size={30}
            color={Color.primary}
            icon={['fab', 'facebook-f']}
          />
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            backgroundColor: 'white',
            width: 50,
            height: 50,
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50
          }}
          onPress={() => this.signIn()}>
          <FontAwesomeIcon
            size={30}
            color={Color.primary}
            icon={['fab', 'google-plus-g']}
          />
        </TouchableHighlight>
        {/* <TouchableHighlight style={[BasicStyles.btnRound, { backgroundColor: 'white', width: 50 }]}>
          <FontAwesomeIcon size={30} color={Color.primary} icon={['fab', 'twitter']} />
        </TouchableHighlight> */}
        {/* </View> */}
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SocialLogin);
