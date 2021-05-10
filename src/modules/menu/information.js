import React, { Component } from 'react';
import { View, Text, Image, } from 'react-native'
import Style from './Style.js'

class Information extends Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={{paddingTop: 22}}>
        <Text style={{fontWeight: 'bold'}}>{this.props.name}</Text>
        <Text>{this.props.description}</Text>
        <Text style={{fontWeight: 'bold', marginTop: 20}}>RESTAURANT HOURS</Text>
        <Text>{this.props.hours}</Text>
      </View>
    )
  }

}

export default Information;