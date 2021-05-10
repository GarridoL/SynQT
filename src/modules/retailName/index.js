import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, TextInput, CheckBox, Modal } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import CustomizedButton from 'modules/generic/CustomizedButton';

class RetailName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { title: 'Retail 1', price: '100.00', quantity: 2 },
        { title: 'Retail 2', price: '61.00', quantity: 5 },
        { title: 'Retail 3', price: '7.00', quantity: 1 }
      ],
      value: null,
      placeOrder: false
    }
  }

  onClick = () => {
    this.props.navigation.navigate('historyStack', {title: 'Upcoming'})
  }

  renderOrderDetails = () => {
    return (
      this.state.data.map(item => {
        return (
          <View style={{ flexDirection: 'row', paddingBottom: 35}}>
            <Image source={require('assets/logo.png')} style={{
              height: '160%',
              width: '20%',
              marginRight: 30,
              marginLeft: 10,
              borderRadius: 5
            }} />
            <Text style={{ marginTop: 20 }}>{item.title}</Text>
            <Text style={{
              position: 'absolute',
              right: 10,
              bottom: 8
            }}>P 6, 000.00</Text>
          </View>
        )
      })
    )
  }


  render() {
    return (
      <View style={{
          flex: 1,
          backgroundColor: 'white',
          width: '100%',
          backgroundColor: 'white',
          height: '100%',
        }}><ScrollView style={{marginBottom: 70}}>
          <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20
        }}>
          <FontAwesomeIcon icon={faUser} size={27} color={Color.gray} style={{ marginRight: 10 }} />
          <Text style={{ color: Color.gray }}>5 people</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          paddingBottom: 15,
          paddingLeft: 20
        }}>
          <Text style={{
            textAlign: 'center',
            marginBottom: 5
          }}>Images</Text>
        </View>
          <View style={{
            alignItems: 'center',
            marginTop: 20}}>
            <Text style={{ marginTop: 5 }}>ORDER NO:</Text>
            <Text style={{ fontWeight: 'bold',  }}>1234</Text>
            <Text style={{ marginTop: 15 }}>DATE & TIME:</Text>
            <Text style={{ fontWeight: 'bold',  }}>Januray 20, 2021 3:30 PM</Text>
            <Text style={{ marginTop: 15 }}>SHIPPING METHOD:</Text>
            <Text style={{ fontWeight: 'bold',  }}>Shipping Method 1</Text>
            <Text style={{ marginTop: 15 }}>PAYMENT METHOD:</Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 25 }}>Payment Method 1</Text>
          </View>
          <View style={{
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 25,
            borderBottomWidth: .3,
            borderTopWidth: .3,
            borderColor: Color.gray
          }}>
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>ORDER DETAILS</Text>
            </View>
            {this.renderOrderDetails()}
          </View>
          <View style={{
            paddingTop: 25,
            paddingLeft: 25,
            paddingRight: 25,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Text>Subtotal</Text>
              <Text style={{
                position: 'absolute',
                right: 10
              }}>P 6, 000.00</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: Color.gray }}>Shipping</Text>
              <Text style={{
                position: 'absolute',
                right: 10,
                color: Color.gray
              }}>P 15.00</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
              <Text style={{
                position: 'absolute',
                right: 10,
                fontWeight: 'bold'
              }}>P 6, 000.00</Text>
            </View>
          </View>
          </ScrollView>
          <CustomizedButton onClick={this.onClick} title={'Cancel'}></CustomizedButton>
        </View>
    );
  }
}
export default RetailName;