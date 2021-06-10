import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Text, TouchableHighlight } from 'react-native';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faComments, faReply } from '@fortawesome/free-solid-svg-icons';
import { Routes, Color, Helper, BasicStyles } from 'common';
import Api from 'services/api/index.js';
import auth from '@react-native-firebase/auth'
import { LoginButton, AccessToken, GraphRequest, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
GoogleSignin.configure();
library.add(fab)
class SocialLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: null,
      userInfo: {},
      googleInfo: {}
    }
  }

  async componentDidMount() {
    console.log('configure');
    await GoogleSignin.configure({
      webClientId: '961931208022-i05qbn3spsc9jtm3tf0p8h3pf9o5talu.apps.googleusercontent.com',
      offlineAccess: true
    })
  }

  //login with facebook process
  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name',
      },
    };

    const profileRequest = new GraphRequest(
      '/me',
      { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          this.setState({ userInfo: result });
          console.log('result:', result);
        }
      }
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  loginWithFacebook = () => {
    const { user } = this.props.state;
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(res => {
      console.log(res)
      if (res.isCancelled) {
        console.log("=>>>>> login is cancelled");
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          console.log(">>>>>>>>>>>>>>", data);
          this.getInfoFromToken(data.accessToken.toString());
          const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
          let parameter = {
            id: user.id,
            token: data.accessToken.toString()
          }
          Api.request(Routes.accountUpdate, parameter, response => {
            console.log('RESPONSE', response);
          })
          return auth().signInWithCredential(facebookCredential);
        })
      }
    }, (error) => {
      console.log("=====>>>>>>", error);
    })
  }
  // =========End===========================================

  // Login with GOOGLE process
  signIn = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    console.log(idToken);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);

  }
  // ==========END=======================================

  render() {
    return (
      <View style={[Style.MainContainer, { flex: 1, flexDirection: 'row' }]}>
        {/* <View style={Style.TextContainer}> */}
        <TouchableHighlight style={[BasicStyles.btnRound, { backgroundColor: 'white', width: 50 }]} onPress={() => this.loginWithFacebook()}>
          <FontAwesomeIcon size={30} color={Color.primary} icon={['fab', 'facebook-f']} />
        </TouchableHighlight>
        <TouchableHighlight style={[BasicStyles.btnRound, { backgroundColor: 'white', width: 50, marginLeft: -20, marginRight: -20 }]} onPress={() => this.signIn()}>
          <FontAwesomeIcon size={30} color={Color.primary} icon={['fab', 'google-plus-g']} />
        </TouchableHighlight>
        <TouchableHighlight style={[BasicStyles.btnRound, { backgroundColor: 'white', width: 50 }]}>
          <FontAwesomeIcon size={30} color={Color.primary} icon={['fab', 'twitter']} />
        </TouchableHighlight>
        {/* </View> */}
      </View>
    );
  }
}
export default SocialLogin;