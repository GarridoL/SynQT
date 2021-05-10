import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import MenuCards from './cards';
import Tab from 'modules/generic/TabOptions';
import FLoatingButton from 'modules/generic/CircleButton';
import Main from './main';
import Information from './information';
import Footer from 'modules/generic/Footer';
import Header from '../generic/MenuHeader';
import Swipe from 'modules/modal/Swiper2';

class Menu extends Component{
  constructor(props){
		super(props);
		this.state = {
			choice: 'Menu',
      header: false
		}
	}

  headerHandler = (value) => {
    this.setState({header: value})
  }

  render() {
    const { data } = this.state;
    return (
      <View style={{flex: 1}}>
        <View>
          <Header status={this.state.header} {...this.props}></Header>
        </View>
        {/* <ScrollView> */}
        <View>
          <Swipe id={this.props.navigation.state?.params?.id} navigation={this.props.navigation} header={(value) => {this.headerHandler(value)}} topFloatButton={false} bottomFloatButton={true}></Swipe>
        </View>
      {/* </ScrollView> */}
      <Footer layer={1} {...this.props}/>
      </View>
    )
  }

}

export default Menu;