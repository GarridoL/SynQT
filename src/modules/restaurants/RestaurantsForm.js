import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SliderPicker } from 'react-native-slider-picker';
import { BasicStyles, Color, Routes } from 'common'
import NumberInput from 'components/InputField/NumberInput'
import InputSelect from 'components/InputField/InputSelect'
import Range from 'components/InputField/Range'
import DateTimePicker from 'components/DateTime/index.js'
import Group from 'modules/generic/PeopleList.js'
import { connect } from 'react-redux';
import Api from 'services/api';
import { Spinner } from 'components';


class Restaurants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      value: 100,
      val: 1,
      Date: null,
      isLoading: false,
      size: 1,
      cuisines: null,
      currentDate: null
    }
  }
  componentDidMount() {
    const { setDefaultAddress, setTempMembers, setLocation } = this.props;
    setDefaultAddress(null);
    setLocation(null);
    setTempMembers([]);
    let date = new Date()
    this.setState({
      currentDate: date.setDate(date.getDate())
    })
  }

  redirect(route) {
    this.props.navigation.navigate(route)
  }

  goesTo = () => {
    this.redirect('peopleListStack')
  }

  createSynqt = () => {
    const { setDefaultAddress, setLocation } = this.props;
    const { user, location } = this.props.state;
    if(user == null){
      return
    }
    if(location == null){
      Alert.alert(
        'Oopps',
        'Please select your location.',
        [
          {text: 'Ok'}
        ],
        { cancelable: false }
      )
      return
    }
    this.validate()
    let param = {
      account_id: user.id,
      address_type: 'NULL',
      merchant_id: this.props.state.user.sub_account?.merchant?.id || null,
      latitude: this.props.state.location.latitude || 'NULL',
      longitude: this.props.state.location.longitude || 'NULL',
      route: this.props.state.location.address || 'NULL',
      // route: this.props.state.location.route,
      locality: this.props.state.location.locality || 'NULL',
      region: this.props.state.location.region || 'NULL',
      country: this.props.state.location.country || 'NULL',
    }
    let detail = {
      type: 'restaurant',
      size: this.state.size?.count != null ? this.state.size?.count : this.state.size,
      val: this.state.val,
      value: this.state.value?.amount != null ? this.state.value?.amount : this.state.value,
      category: this.state.cuisines?.categories?.length >= 1 ? this.state.cuisines.categories : ["Filipino", "Chinese", "Japanese", "Indian", "Italian", "Thai", "Spanish", "French", "Korean", "Turkish"]
   }
    this.setState({ isLoading: true })
    Api.request(Routes.locationCreate, param, response => {
      this.setState({ isLoading: false })
      if (response.data === null) {
        return
      }
      let parameter = {
        account_id: user.id,
        location_id: response.data,
        date: this.state.Date?.date,
        status: 'pending',
        details: JSON.stringify(detail)
      }
      this.setState({ isLoading: true })
      Api.request(Routes.synqtCreate, parameter, res => {
        this.setState({ isLoading: false })
        if (res.data !== null) {
          
          setDefaultAddress(null);
          setLocation(null);
          this.createMessengerGroup(res.data, parameter.date)
          this.setState({ Date: null })
        }
      });
    });
  }

  validate(){
    if(this.state.Date == null){
      Alert.alert(
        'Oopps',
        'Please specify the date.',
        [
          {text: 'Ok'}
        ],
        { cancelable: false }
      )
      return
    }
    if(this.state.value == null){
      Alert.alert(
        'Oopps',
        'Please range the price.',
        [
          {text: 'Ok'}
        ],
        { cancelable: false }
      )
      return
    }
    if(this.state.value <= 0){
      Alert.alert(
        'Oopps',
        'Price must be greater than 0',
        [
          {text: 'Ok'}
        ],
        { cancelable: false }
      )
      return
    }
    if(this.state.range <= 0){
      Alert.alert(
        'Oopps',
        'Range must be greater than 0',
        [
          {text: 'Ok'}
        ],
        { cancelable: false }
      )
      return
    }
    if( this.state.Date == null || this.state.size == null || this.state.value == null || this.state.val == null){
      Alert.alert(
        'Oopps',
        'Please fill up all of the fields',
        [
          {text: 'Ok'}
        ],
        { cancelable: false }
      )
      return
    }
    if(this.props.state.tempMembers.length === 0) {
      Alert.alert(
        'Oopps',
        'Please invite atleast 1 person to your SYNQT. Thank you.',
        [
          {text: 'Ok'}
        ],
        { cancelable: false }
      )
      return
    }
  }

  createMessengerGroup(id, date) {
    const { tempMembers } = this.props.state;
    let members = [];
    tempMembers.length > 0 && tempMembers.map((item, index) => {
      members.push({account_id: item.account?.id})
    })
    members.push({account_id: this.props.state?.user?.id});
    let parameter = {
      account_id: this.props.state.user.id,
      title: date,
      payload: id,
      members: members
    }
    this.setState({ isLoading: true })
    Api.request(Routes.messengerGroupCreate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data !== null) {
        this.sendInvitation(id);
      }
    });
  }

  sendInvitation = (id) => {
    const { tempMembers, user } = this.props.state
    tempMembers.length > 0 && tempMembers.map((item, index) => {
      let parameter = {
        from: this.props.state.user.id,
        to: item.account.id,
        payload: 'synqt',
        payload_value: id,
        route: `/restaurant/${item.account?.code}`
      }
      this.setState({ isLoading: true });
      Api.request(Routes.notificationCreate, parameter, response => {
        this.setState({ isLoading: false })
        if(response.data !== null) {
          this.props.navigation.navigate('menuStack', { synqt_id: id })
        }
      });
    })
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
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <View>
            <View style={{
              marginTop: '7%',
              marginLeft: 20,
            }}>
              <Text>Location</Text>
              <TouchableOpacity
                style={{
                  height: 50,
                  borderRadius: 25,
                  borderWidth: .3,
                  marginRight: 20,
                  marginBottom: 20,
                  borderColor: Color.gray,
                  justifyContent: 'center',
                  paddingLeft: 10,
                  marginTop: 3
                }}
                onPress={() => { this.props.navigation.navigate('locationStack') }}>
                <Text style={{ color: Color.gray }}>{this.props.state.location?.address || 'Type your location'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{
              marginLeft: 20,
              marginRight: 20
            }}>
              <Text>Date</Text>
              <DateTimePicker
                borderBottomColor={Color.gray}
                icon={true}
                textStyle={{ marginRight: '-7%' }}
                borderColor={'white'}
                type={'date'}
                placeholder={'Select Date'}
                onFinish={(date) => {
                  this.setState({
                    Date: date
                  })
                }}
                minimumDate={this.state.currentDate}
                style={{
                  marginTop: '-5%'
                }} />
            </View>
            <View style={{ marginBottom: '23%' }}>
              <NumberInput
                onFinish={(count) => {
                  this.setState({
                    size: count
                  })
                }}
                title={'Party Size'} />
            </View>
            <View style={{ marginBottom: '23%' }}>
              <Range 
              onFinish={(amount) => {
                  this.setState({
                    value: amount
                  })
                }} title={'Price Range'} />
            </View>
            <View>
              <InputSelect 
                onFinish={(categories) => {
                  this.setState({
                    cuisines: categories
                  })
                }}
                titles={'cuisines'}
                placeholder={(this.state.cuisines?.categories == null|| this.state.cuisines?.categories?.length == 10 || this.state.cuisines?.categories?.length < 1 ) ? ' ' : this.state.cuisines.categories.join(',') }
                title={'Cuisines'} />
            </View>
            <Text style={{ color: 'black', marginBottom: 15, marginLeft: 20 }}>Radius</Text>
            <SliderPicker
              callback={position => {
                this.setState({ val: position })
              }}
              defaultValue={this.state.val}
              labelFontColor={"#6c7682"}
              labelFontWeight={'600'}
              showFill={true}
              fillColor={'gray'}
              labelFontWeight={'bold'}
              showNumberScale={true}
              showSeparatorScale={true}
              buttonBackgroundColor={'#fff'}
              buttonBorderWidth={2}
              labelFontSize={15}
              scaleNumberFontWeight={'300'}
              buttonDimensionsPercentage={6}
              buttonBorderColor={'#5842D7'}
              heightPercentage={1}
              widthPercentage={90}
              sliderInnerBackgroundColor={'gray'}
              minLabel={'1km'}
              midLabel={'25km'}
              maxLabel={'50km'}
              maxValue={50}
            />
            <Text style={{ marginLeft: 20, marginBottom: 5 }}>People in this SYNQT</Text>
            <Group navigation={this.props.navigation} add={true} style={{ marginLeft: 50, marginTop: -30 }} redirectTo={() => this.goesTo()} data={this.props.state.tempMembers} />
          </View>

          <View style={{
            width: '33%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30%',
            marginLeft: '35%'
          }}>
            <TouchableOpacity
              onPress={() => this.createSynqt()}
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
              }} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* <Footer layer={1} {...this.props}/> */}
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    updateUser: (user) => dispatch(actions.updateUser(user)),
    setDefaultAddress: (defaultAddress) => dispatch(actions.setDefaultAddress(defaultAddress)),
    setTempMembers: (tempMembers) => dispatch(actions.setTempMembers(tempMembers)),
    setLocation: (location) => dispatch(actions.setLocation(location)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);