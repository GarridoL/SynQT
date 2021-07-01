import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text } from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck, faTimes, faStar} from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
const height = Math.round(Dimensions.get('window').height);
import UserImage from 'components/User/Image';

class GroupUsers extends Component{
  constructor(props){
    super(props);
  }

  render() {
    const { data } = this.props;
    return (
			<View style={{
        width: '100%',
        flexDirection: this.props.reverse ? 'row-reverse' : 'row',
        textAlign: 'justify',
        flexWrap: 'wrap',
        ...this.props.style
      }}>
        {
          data.length > 0 && data.map((item, index) => {
            item['account']['id'] = item.account_id
            if(this.props.reverse && index < 5) {
              return (
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('viewProfileStack', { user: item, level: 2 }) }}>
                  <UserImage
                    user={{profile: item.account?.profile ? item.account.profile : item?.profile}}
                    color={this.props.color ? this.props.color : Color.secondary}
                    size={ this.props.size ? this.props.size : 30 }
                    style={{
                      width: this.props.size,
                      height: this.props.size,
                      borderRadius: 30,
                      borderColor: Color.secondary,
                      borderWidth: 1,
                      opacity: data.length > 5 && index === 4 && this.props.cardUser ? 0.5 : 1,
                      marginLeft: 3
                    }}/>
                </TouchableOpacity>
              )
            } else if( this.props.reverse === false) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('viewProfileStack', { user: item, level: 2 })
                  }}
                  style={{
                    padding: 5
                  }}
                >
                  <UserImage
                    user={{profile: item.account?.profile ? item.account.profile : item?.profile}}
                    color={this.props.color ? this.props.color : Color.secondary}
                    size={ this.props.size ? this.props.size : 30 }
                    style={{
                      width: this.props.size,
                      height: this.props.size,
                      borderRadius: 30,
                      borderColor: Color.secondary,
                      borderWidth: 1,
                      opacity: data.length > 5 && index === 4 && this.props.cardUser ? 0.5 : 1
                    }}
                    marginLeft={-2}/>
                </TouchableOpacity>
              )
            }
          })
        }{
          data.length > 5 && this.props.cardUser && (
            <View style={{position: 'absolute', zIndex: 10, right: 5, top: 3, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#6e6d6d', fontSize: 10}}>+{data.length - 5}</Text>
              <Text style={{color: '#6e6d6d', fontSize: 8, marginTop: -5}}>more</Text>
            </View>
          )
        }
			</View>
    )
  }
}

export default GroupUsers;