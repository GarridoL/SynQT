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
    return (
      <View style={{ height: '100%' }}>
        <Swipe id={this.props.navigation.state?.params?.id} navigation={this.props.navigation} topFloatButton={false} bottomFloatButton={true}></Swipe>
        <Footer layer={1} {...this.props} />
      </View>
    )
  }

}

export default Menu;