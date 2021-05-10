import React, { Component } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import Style from './Style';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faTimes} from '@fortawesome/free-solid-svg-icons';
import Active from './active'

class Main extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
			<View>
        <ImageBackground
            style={Style.ImageMain}
            source={require('assets/test2.jpg')}
            imageStyle={{borderRadius: 13}}
          >
          <View style={{position: 'absolute', top: 10}}>
            <Active></Active>
          </View>
          <View style={{position: 'absolute', bottom: 20}}>
            <Text style={{color: 'white', left: 10, fontSize: 20, fontWeight: 'bold'}}>Italian Restaurant</Text>
            <Text style={{color: 'white', left: 10}}>Cebu City, Philippines</Text>
          </View>
          <TouchableOpacity
            style={{
              alignItems:'center',
              justifyContent:'center',
              width:100,
              right: -50,
              height:100,
              backgroundColor:'#4CCBA6',
              borderRadius:100,
              position: 'absolute',
              bottom: 100,
              right: 15
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              size={50}
              color={'white'}
            />
          </TouchableOpacity>
          <View style={{position: 'absolute', bottom: 20, right: 15, flexDirection: 'row'}}>
          <FontAwesomeIcon
            icon={faStar}
            size={30}
            color={'#FFCC00'}
          />
          <FontAwesomeIcon
            icon={faStar}
            size={30}
            color={'#FFCC00'}
          />
          <FontAwesomeIcon
            icon={faStar}
            size={30}
            color={'#FFCC00'}
          />
          <FontAwesomeIcon
            icon={faStar}
            size={30}
            color={'white'}
          />
          <FontAwesomeIcon
            icon={faStar}
            size={30}
            color={'white'}
          />
          </View>
        </ImageBackground>
			</View>
    )
  }

}

export default Main;
