import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { View , TextInput , Image, TouchableHighlight, Text, ScrollView} from 'react-native';
import Style from './Style.js';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import { Routes, Color, Helper, BasicStyles } from 'common';
import CustomError from 'components/Modal/Error.js';
import PasswordInputWithIconLeft from 'components/InputField/PasswordWithIcon.js';
import TextInputWithIcon from 'components/InputField/TextInputWithIcon.js';
import Header from './Header';
import LinearGradient from 'react-native-linear-gradient'
import config from 'src/config';
import { Dimensions } from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faComments, faArrowRight, faUser} from '@fortawesome/free-solid-svg-icons';
import SocialLogin from './SocialLogin'
// import Button from 'components/Form/Button';
import Button from '../generic/Button.js'
const width = Math.round(Dimensions.get('window').width);
class Register extends Component {
  //Screen1 Component
  constructor(props){
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
      token: null,
      error: 0,
      errorMessage: null,
      isResponseError: false
    };
  }
  
  componentDidMount(){
    this.setState({error: 0})
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  }
  
  submit(parameter){
    const { username, email, password } = this.state;
    if(parameter === null){
      if(this.validate() == false){
        return
      }
      parameter = {
        username: username.replace(/\s/g, ''),
        email: email,
        password: password,
        config: null,
        account_type: 'USER',
        referral_code: null,
        status: 'ADMIN'
      }
    }else{
      parameter.username = parameter.username.replace(/\s/g, '')
    }
    console.log('[PARAMETER]', parameter);
    this.setState({isLoading: true})
    Api.request(Routes.accountCreate, parameter, response => {
      console.log('[REGISTER FB]', response);
      this.setState({isLoading: false})
      if(response.error !== null){
        if(response.error.status === 100){
          let message = response.error.message
          if(typeof message.username !== undefined && typeof message.username !== 'undefined'){
            this.setState({errorMessage: message.username[0]})
          }else if(typeof message.email !== undefined && typeof message.email !== 'undefined'){
            this.setState({errorMessage: message.email[0]})
          }
        }else if(response.data !== null){
          if(response.data > 0){
            this.redirect('loginStack')
          }
        }
      }
    }, error => {
      this.setState({isResponseError: true})
    })
  }

  validate(){
    const { username, email, password, confirmPassword } = this.state;
    if(username.length >= 6 &&
      email !== '' &&
      password !== '' &&
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(password) &&
      password.length >= 6 &
      password.localeCompare(confirmPassword) === 0 &&
      Helper.validateEmail(email) === true){
      return true
    }else if(email !== '' && Helper.validateEmail(email) === false){
      this.setState({errorMessage: 'You have entered an invalid email address.'})
      return false
    }else if(username !== '' && username.length < 6){
      this.setState({errorMessage: 'Username must be atleast 6 characters.'})
      return false
    }else if(password !== '' && password.length < 6){
       this.setState({errorMessage: 'Password must be atleast 6 characters.'})
       return false
    }else if(password !== '' && /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(password) === false){
      this.setState({errorMessage: 'Password must be alphanumeric characters. It should contain 1 number, 1 special character and 1 capital letter.'})
      return false
    }else if(password !== '' && password.localeCompare(confirmPassword) !== 0){
       this.setState({errorMessage: 'Password did not match.'})
       return false
    }else{ 
      this.setState({errorMessage: 'Please fill in all required fields.'})
      return false
    }
  }

  render() {
    const { isLoading, errorMessage, isResponseError } = this.state;
    const { theme } = this.props.state;
    return (
      <LinearGradient
        colors={theme && theme.gradient !== undefined  && theme.gradient !== null ? theme.gradient : Color.gradient}
        locations={[0,0.5,1]}
        start={{ x: 2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: '100%'}}
        >
        <ScrollView
          style={Style.ScrollView}
          showsVerticalScrollIndicator={false}>
          <View style={Style.MainContainer}>
            <Header params={"Sign Up"}></Header>
            {
              errorMessage !== null && (
                <View style={{
                  flexDirection: 'row',
                    padding: 30
                }}>
                  <Text style={[Style.messageText, {
                    fontFamily: 'Poppins-SemiBold',
                  }]}>Oops! </Text>
                  <Text style={Style.messageText}>{errorMessage}</Text>
                </View>
              )
            }
            
            
            <View style={Style.TextContainer}>
              <TextInputWithIcon
                onTyping={(username) => this.setState({username})}
                value={this.state.email}
                placeholder={'Username'}
                style={{width: '90%', borderColor: 'white', color: 'black'}}
                icon={faUser}
              />
              
              <TextInputWithIcon
                onTyping={(email) => this.setState({email})}
                value={this.state.email}
                placeholder={'Email Address'}
                style={{width: '90%', borderColor: 'white', color: 'black'}}
                icon={faUser}
              />

              <PasswordInputWithIconLeft
                onTyping={(input) => this.setState({
                  password: input
                })}
                style={{width: '80%', borderColor: 'white', color: 'black'}}
                placeholder={'Password'}/>

              <View style={{
                marginTop: 10,
                marginBottom: 20,
              }}>
                <PasswordInputWithIconLeft
                  onTyping={(input) => this.setState({
                    confirmPassword: input
                  })}
                  style={{width: '80%', borderColor: 'white', color: 'black'}}
                  placeholder={'Confirm Password'}
                  />
              </View>
              
              <Text
                onPress={() => this.redirect('forgotPasswordStack')}
                style={{
                  color: 'white',
                  width: '50%',
                  marginLeft: '60%',
                  textDecorationLine:'underline',
                }}
              >Forgot Password?</Text>

              
            
              <Button content={
                <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                  <Text style={{color: 'white', fontSize: 15}}>Sign Up</Text>
                  <FontAwesomeIcon color={'white'} icon={faArrowRight} style={{marginLeft: 10, marginTop: 1}}/>
                </View>
              } styles={[BasicStyles.btnRound, {
                marginTop: '5%',
                marginLeft: '50%',
                width: '50%'}]} redirect={()=> this.submit(null)}/>

              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  color: Color.white
                }}>Or sign up with</Text>
              </View>

              <SocialLogin page={'Register'}
                socialRegister={(parameter) => this.submit(parameter)}/>
              
              <View style={{
                width: '100%',
                alignItems: 'center',
                marginBottom: '10%'
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: BasicStyles.standardFontSize
                }}>Already have an account?&nbsp;&nbsp;
                  <Text
                    style={{
                      textDecorationLine:'underline',
                      fontFamily:'Poppins-SemiBold'
                    }}
                    onPress={()=> this.props.navigation.navigate('loginStack')}>
                      Sign In
                  </Text>
                </Text>
              </View>

            </View>
          </View>

          {isLoading ? <Spinner mode="overlay"/> : null }
          {isResponseError ? <CustomError visible={isResponseError} onCLose={() => {
            this.setState({isResponseError: false, isLoading: false})
          }}/> : null}
        </ScrollView>
      </LinearGradient>
    );
  }
}
 
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    logout: () => dispatch(actions.logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
