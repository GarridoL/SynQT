import React, { Component } from 'react';
import { View , Image, Text} from 'react-native';
import Style from './Style';
import {Helper} from 'common';
export default  class Header extends Component{
  render(){
    return (
      <View>
        <View style={Style.LogoContainer}>
          <Image source={require('assets/new2.png')} style={Style.LogoSize}/>
        </View>
        <View style={{
          alignItems:'flex-start',
          justifyContent:'flex-start',
          marginLeft: 30
        }}>
          <Text style={{
            paddingTop: 50,
            paddingBottom: 20,
            color:'white',
            fontWeight:'bold',
            fontSize: 20
          }}>{this.props.params}</Text>
        </View>
      </View>
    );
  }
}