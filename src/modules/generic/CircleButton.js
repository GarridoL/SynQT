import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';

class FloatingButton extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
			<View style={{flexDirection: 'row', position: 'absolute', bottom: 70, width: '100%'}}>
        <View style={{width: '50%'}}>
				<TouchableOpacity
          style={{
            alignItems:'center',
            justifyContent:'center',
            width:80,
            left: 70,
            height:80,
            backgroundColor:'#F7B567',
            borderRadius:40,
          }}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size={40}
            color={'white'}
          />
          </TouchableOpacity>
          </View>
          <View style={{width: '50%'}}>
        <TouchableOpacity
          style={{
            alignItems:'center',
            justifyContent:'center',
            width:80,
            right: -50,
            height:80,
            backgroundColor:'#F7B567',
            borderRadius: 40,
          }}
          onPress={() => {this.props.onClick()}}
        >
          <FontAwesomeIcon
            icon={faCheck}
            size={40}
            color={'white'}
          />
          </TouchableOpacity>
        </View>
			</View>
    )
  }

}

export default FloatingButton;