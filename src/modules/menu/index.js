import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import MenuCards from './cards';
import { Color } from 'common';
import Tab from 'modules/generic/TabOptions';
import FLoatingButton from 'modules/generic/CircleButton';
import Main from './main';
import Information from './information';
import Footer from 'modules/generic/Footer';
import Swipe from 'modules/modal/Swiper2';
const height = Math.round(Dimensions.get('window').height);
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: 'Menu'
    }
  }

  render() {
    const { data } = this.state;
    return (
      <View style={{ backgroundColor: Color.containerBackground, height: '100%' }}>
        <View style={{height: '90%'}}>
          <Swipe id={this.props.navigation.state?.params?.id} navigation={this.props.navigation} topFloatButton={false} bottomFloatButton={true}></Swipe>
        </View>
        <View>
          <Footer layer={1} {...this.props} />
        </View>
      </View>
    )
  }

}

export default Menu;