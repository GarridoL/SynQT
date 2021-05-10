import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import GroupUsers from 'modules/generic/GroupUsers';
import Config from 'src/config.js';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class ImageCardWithUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    }
  }

  render() {
    const { data } = this.props;
    return (
      <View style={{
        width: '100%',
        ...this.props.style
      }}>
        {
          data && (
            <TouchableOpacity
              style={{
                borderRadius: BasicStyles.standardBorderRadius,
                elevation: 3,
                width: '100%',
              }}
              onPress={(data) => this.props.onClick(data)}
            >
              <View>
                <Image
                  source={data.logo ? { uri: Config.BACKEND_URL + data.logo } : require('assets/synqt.png')}
                  style={{
                    width: '100%',
                    height: height / 3.5,
                    borderTopLeftRadius: BasicStyles.standardBorderRadius,
                    borderTopRightRadius: BasicStyles.standardBorderRadius
                  }} />
              </View>
              <View style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                paddingLeft: 15,
                paddingTop: 15,
                paddingBottom: data.details === true ? 15 : 0,
                paddingRight: 15,
                elevation: 1,
                borderBottomLeftRadius: BasicStyles.standardBorderRadius,
                borderBottomRightRadius: BasicStyles.standardBorderRadius
              }}>
                <View style={{
                  width: '50%'
                }}>
                  <Text style={{
                    fontWeight: 'bold',
                    fontSize: BasicStyles.standardTitleFontSize,
                    marginTop: -10
                  }}
                    numberOfLines={1}
                  >{data.name}</Text>
                  <Text style={{
                    color: 'gray',
                    marginBottom: 10
                  }}
                    numberOfLines={1}
                  >{data.address}</Text>
                </View>
                <View style={{
                  zIndex: 10,
                  marginTop: -7,
                  marginLeft: 6
                }}>
                  <GroupUsers navigation={this.props.navigation} cardUser={true} style={{ marginLeft: -15 }} size={30} data={data.users} />
                </View>
                {data.details === true && <View style={{
                  flexDirection: 'row',
                  width: '50%',
                  position: 'absolute',
                  bottom: 10,
                  right: width - (width + 40),
                }}><View style={{
                  backgroundColor: 'white',
                  borderRadius: 6,
                  height: 18,
                  width: 55,
                  borderWidth: .5,
                  borderColor: Color.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginRight: 5
                }}>
                    <FontAwesomeIcon icon={faStar} color={Color.warning} style={{ marginRight: 2 }} size={8} />
                    <Text numberOfLines={1} style={{ fontSize: 10, color: Color.primary }}>43</Text>
                  </View>
                  <View style={{
                    backgroundColor: Color.primary,
                    borderRadius: 6,
                    height: 18,
                    width: 55,
                    borderWidth: .5,
                    borderColor: Color.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                  }}>
                    <Text numberOfLines={1} style={{ fontSize: 10, color: 'white' }}>0.64 km</Text>
                  </View></View>}
              </View>
              {
                data.superlike == true && (
                  <View style={{
                    backgroundColor: 'white',
                    borderRadius: 6,
                    height: 21,
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 50,
                    borderWidth: .5,
                    borderColor: Color.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                  }}>
                    <TouchableOpacity style={{
                      height: 15,
                      width: 15,
                      borderRadius: 8,
                      backgroundColor: '#30F2F2',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 5
                    }}>
                      <FontAwesomeIcon icon={faStar} color={Color.white} size={8} />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={{ color: Color.warning }}>1</Text>
                  </View>
                )
              }
            </TouchableOpacity>
          )
        }
      </View>
    )
  }
}

export default ImageCardWithUser;