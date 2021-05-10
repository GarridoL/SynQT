import React, { Component } from 'react';
import { View, Text, Image, } from 'react-native';
import { Dimensions } from 'react-native';

class Active extends Component{
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      size: ['test', 'test',]
    }
  }

  render() {
    const width = Math.round(Dimensions.get('window').width) - 60
    return (
        <View style={{flexDirection: 'row', paddingTop: 2, padding: 4}}>
          {this.state.size.length > 0 && this.state.size.map((item, index) => {
            return (
              <View key={index} style={{backgroundColor: this.state.index === index ? 'white' : '#bfbfbf', height: 3, borderWidth: .5, borderRadius: 5, borderColor: this.state.index === index ? 'white' : '#bfbfbf', width: Number.parseInt(width/this.state.size.length - 2, 10), marginRight: 3}}>
              </View>
            )
          })}
        </View>
    )
  }

}

export default Active;