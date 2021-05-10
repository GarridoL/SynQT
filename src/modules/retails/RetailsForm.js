import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { BasicStyles, Color } from 'common'
import InputSelect from 'components/InputField/InputSelect'
import Range from 'components/InputField/Range'
import Group from 'modules/generic/PeopleList.js'

const group = [
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} },
  { user:{profile: {uri: require('assets/test.jpg')}} }
]


class Retails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      value: '$1-$100'
    }
  }

  goesTo = () => {
    this.redirect('peopleListStack')
  }

  redirect(route){
    this.props.navigation.navigate(route)
  }

  render() {
    return (
      <View style={{
        flex: 1,
        height: '100%'
      }}>
        <ScrollView style={{
          backgroundColor: Color.containerBackground,
          height: '100%'
        }}
        showsVerticalScrollIndicator={false}
        >
        <View style={{marginTop: 20}}>
          <InputSelect style={{width: '100%'}} title={'Category'} titles={'category'} />
          <InputSelect style={{width: '100%'}} placeholder={'Product Type'} title={'Product Type'} titles={'Product Type'} />
          <InputSelect placeholder={'Style'} title={'Style'} titles={'style'}/>
          <InputSelect placeholder={'Brand'} title={'Brand'} titles={'brand'}/>
          <InputSelect placeholder={'Size'} title={'Size'} titles={'size'} />
          <InputSelect placeholder={'Body Fit'} title={'Body Fit'} titles={'body fit'}/>
          <InputSelect placeholder={'Colour'} title={'Colour'} titles={'colour'}/>
          <View style={{marginBottom: '23%'}}>
            <Range value={this.state.value.toString()} title={'Price Range'} />
          </View>
          <Text style={{marginLeft: 20, marginBottom: 5}}>People in this SYNQT</Text>
          {/* <FontAwesomeIcon
            icon={faPlusCircle}
            size={30}
            style={{
              color: Color.primary,
              marginLeft: 20
            }}
            onPress={() => this.redirect('peopleListStack')}
          /> */}
          <Group style={{marginLeft: 50, marginTop: -30}} redirectTo={() => this.goesTo()} data={group}/>

        </View>

        <View style={{
                width: '33%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:'140%',
                marginLeft: '35%'
            }}>
                <TouchableOpacity
                onPress={() => this.redirect('menuStack')}
                style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    backgroundColor: Color.primary,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={require('assets/logo.png')} style={{
                        height: 50,
                        width: 50
                    }}/>
                </TouchableOpacity>
        </View>
        </ScrollView>
        {/* <Footer layer={1} {...this.props}/> */}
      </View>
    );
  }
}
export default Retails;
