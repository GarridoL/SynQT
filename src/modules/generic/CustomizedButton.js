import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import { Color} from 'common';

class Button extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  action = () => {
      this.props.action();
  }

  render() {
    return (
      <View style={{
        position: 'absolute',
        bottom: 10,
        width: '100%',
        alignItems:'center',
        justifyContent:'center',
        ...this.props.style
      }}>
        <TouchableOpacity
          style={{
            alignItems:'center',
            justifyContent:'center',
            width:100,
            height:55,
            left: 30,
            width: '65%',
            backgroundColor: Color.primary,
            borderRadius:100,
          }}
          onPress={() => {this.props.onClick()}}
          >
            <Text style={{color: 'white'}}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
      
    )
  }

}

export default Button;