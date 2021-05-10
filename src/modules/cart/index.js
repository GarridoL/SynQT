import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import CustomizedButton from 'modules/generic/CustomizedButton';
import RadioForm from 'react-native-simple-radio-button';
class Carts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {title: 'Retail 1', price: '100.00', quantity: 2},
        {title: 'Retail 2', price: '61.00', quantity: 5},
        {title: 'Retail 3', price: '7.00', quantity: 1}
      ],
      value: null
    }
  }

  addQuantity = (index) => {
    let data = this.state.data;
    data[index].quantity += 1;
    this.setState({data: data});
  }

  subtractQuantity = (index) => {
    if(this.state.data[index].quantity > 1) {
      let data = this.state.data;
      data[index].quantity -= 1;
      this.setState({data: data});
    }
  }

  redirect = () => {
    this.props.navigation.navigate('checkoutStack');
  }

  render() {
    return (
      <ScrollView>
      <View style={[Style.MainContainer, {
        backgroundColor: Color.containerBackground,
        padding: 15,
        paddingBottom: 100
      }]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <FontAwesomeIcon icon={faUser} size={27} color={Color.gray} style={{ marginRight: 10 }} />
          <Text style={{ color: Color.gray }}>5 people</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          borderBottomWidth: 1,
          borderColor: '#E0E0E0',
          marginTop: 20,
          paddingBottom: 15
        }}>
          <Text style={{
            textAlign: 'center',
            marginBottom: 10
          }}>Images</Text>
        </View>
        {this.state.data && this.state.data.map((item, index) => {
          return (
            <View style={{
              flexDirection: 'row',
              width: '100%',
              borderBottomWidth: index === this.state.data.length - 1 ? 3 : .5,
              borderColor: '#E0E0E0',
              marginTop: 20,
              paddingBottom: 15
            }}
            >
              <FontAwesomeIcon
                icon={faTimes}
                size={20}
                color={Color.gray}
                style={{
                  marginRight: 10,
                  position: 'absolute',
                  right: 5,
                  top: -10
               }} />
              <Image source={require('assets/logo.png')} style={{
                height: 100,
                width: 90,
                marginRight: 30,
                marginLeft: 30
              }} />
              <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
              <View style={{position: 'absolute', top: 20, left: 150}}>
                <Text style={{
                  fontSize: 12
                }}>P  {item.price}</Text>
                <View style={{
                  borderWidth: .3,
                  width: 150,
                  height: 50,
                  borderRadius: 50,
                  borderColor: Color.gray,
                  marginTop: 10,
                  flexDirection: 'row',
                  padding: 15
                }}>
                  <View style={{flex: 3, height: 10, width: 10}}>
                    <TouchableOpacity
                      onPress={() => {this.subtractQuantity(index)}}>
                      <Text style={{
                        fontWeight: 'bold'
                      }}>-</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{
                    flex: 3
                  }}>{item.quantity}</Text>
                  <View style={{flex: .5, height: 10, width: 10}}>
                    <TouchableOpacity
                      onPress={() => {this.addQuantity(index)}}>
                      <Text style={{
                        fontWeight: 'bold'
                      }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
    
            </View>
          )
        })}
        <View style={{
          marginTop: 25
        }}>
          <View style={{flexDirection: 'row'}}>
            <Text>Subtotal</Text>
            <Text style={{
              position: 'absolute',
              right: 10
            }}>P 6, 000.00</Text>
          </View>
          <View>
            <Text style={{
              color: Color.gray,
              marginBottom: 15
            }}>Shipping</Text>
            <View style={{flexDirection: 'row',
              textAlign: 'center',
              alignItems: 'center'
            }}>
            <RadioForm
              radio_props={[
                {label: 'Shipping Method 1', value: 0 },
                {label: 'Shipping Method 2', value: 1 },
                {label: 'Shipping Method 3', value: 1 }
              ]}
              initial={0}
              onPress={(value) => {this.setState({value:value})}}
              buttonColor={Color.gray}
              selectedButtonColor={Color.gray}
              labelColor={Color.gray}
              animation={false}
              buttonSize={20}
              buttonOuterSize={20}
            /><Text style={{
              position: 'absolute',
              right: 10,
            }}>P  15, 000.00</Text>
            </View>
          </View>
        </View>

        <View style={{
          marginTop: 25
        }}>
          <View>
            <Text>Calculate Shipping</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>TOTAL</Text>
            <Text style={{
              position: 'absolute',
              right: 10,
              fontWeight: 'bold'
            }}>P 6, 000.00</Text>
          </View>
        </View>

        <CustomizedButton onClick={this.redirect} title={'Proceed Checkout'}></CustomizedButton>
        
      </View>
      </ScrollView>
    );
  }
}
export default Carts;