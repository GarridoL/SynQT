import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, TextInput, CheckBox, Modal, ImageBackground, Alert, Dimensions } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faStar, faClock } from '@fortawesome/free-solid-svg-icons';
import CustomizedButton from 'modules/generic/CustomizedButton';
import Config from 'src/config.js';
import Group from 'modules/generic/GroupUsers';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
import Style from '../history/Style';
import style from './Style';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
class EventName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { title: 'Retail 1', price: '100.00', quantity: 2 },
        { title: 'Retail 2', price: '61.00', quantity: 5 },
        { title: 'Retail 3', price: '7.00', quantity: 1 }
      ],
      value: null,
      placeOrder: false,
      isLoading: false,
      members: [],
      day: new Date(this.props.navigation?.state?.params?.data?.synqt[0].date).getDay(),
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      time: [],
      schedule: null
    }
  }

  componentDidMount() {
    this.retrieveMembers();
    const { data } = this.props.navigation.state.params;
    let schedule = data?.merchant?.schedule && data?.merchant?.schedule !== 'NULL' ? JSON.parse(data?.merchant?.schedule) : null
    if (schedule && schedule !== 'NULL' && typeof (schedule) !== 'object') {
      schedule = JSON.parse(schedule);
    }
    this.setState({ schedule: schedule?.schedule });
    this.getTime(schedule?.schedule);
  }

  onClick = () => {
    if (this.props.navigation.state?.params?.buttonTitle === 'Cancel') {
      this.deleteItem();
    } else {
      this.addToReservation();
    }
  }

  retrieveMembers = () => {
    const { offset, limit } = this.state;
    const parameter = {
      condition: [{
        value: this.props.navigation.state?.params?.messenger_group_id,
        column: 'messenger_group_id',
        clause: '='
      }],
      sort: {
        'created_at': 'DESC'
      }
    }
    this.setState({ isLoading: true });
    Api.request(Routes.messengerMembersRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        this.setState({ members: response.data })
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      })
  }

  redirect(route) {
    this.props.navigation.navigate(route)
  }

  goesTo = () => {
    this.redirect('peopleListStack')
  }

  deleteItem = () => {
    Alert.alert(
      '',
      'Confirm cancellation',
      [
        { text: 'Close', onPress: () => { return }, style: 'cancel' },
        {
          text: 'Confirm', onPress: () => {
            let parameter = {
              id: this.props.navigation?.state?.params?.data?.id,
              status: 'cancelled'
            }
            this.setState({ isLoading: true });
            Api.request(Routes.reservationUpdate, parameter, response => {
              this.setState({ isLoading: false })
              if (response.data !== null) {
                this.props.navigation.navigate('historyStack', { title: 'Upcoming' })
              }
            },
              error => {
                this.setState({ isLoading: false })
                console.log({ error });
              })
          }
        },
      ],
      { cancelable: false }
    )
  }

  addToReservation = () => {
    Alert.alert(
      '',
      'Kindly confirm to continue',
      [
        { text: 'Cancel', onPress: () => { return }, style: 'cancel' },
        {
          text: 'Confirm', onPress: () => {
            this.setState({ isLoading: true })
            Api.request(Routes.reservationCreate, this.props.navigation.state?.params?.parameter, response => {
              this.setState({ isLoading: false })
              if (response.data !== null) {
                this.props.navigation.navigate('historyStack', { title: 'Upcoming' })
              }
            },
              error => {
                this.setState({ isLoading: false })
                console.log({ error });
              },
            );
          }
        },
      ],
      { cancelable: false }
    )
  }

  getAddress = (address) => {
    let location = null
    try {
      location = JSON.parse(address).name
    } catch (e) {
      console.log(e);
      location = address
    }
    return location;
  }

  getTime = (schedule) => {
    let time = [];
    let d = null;
    schedule?.length > 0 && schedule.forEach(element => {
      console.log(element.value, this.state.day);
      if (element.value === 'Sunday') {
        d = element;
      }
    });
    if (d?.startTime && d?.endTime) {
      let date = new Date()
      date.setHours(d.endTime?.hh, d.endTime?.mm, 0)
      if (date.getHours() !== 0) {
        time.push(date.getHours() - 1);
      }
      console.log(date.getHours(), 'hour');
    } else {
      let date1 = new Date()
      time.push(date1.getHours() + 1);
    }
  }

  render() {
    const { theme } = this.props.state;
    const { data } = this.props.navigation.state.params;
    return (
      <View>
        <ScrollView style={{ marginBottom: 50 }} showsVerticalScrollIndicator={false}>
          <View style={style.Container}>
            <ImageBackground
              style={{
                width: '100%',
                height: '50%'
              }}
              imageStyle={{ flex: 1, height: null, width: null, resizeMode: 'cover' }}
              source={{ uri: Config.BACKEND_URL + data.merchant.logo }}>
              <View style={{
                width: width,
                height: 110,
                position: 'absolute',
                bottom: 0,
                left: 0,
                opacity: .3,
                backgroundColor: 'white',
                justifyContent: 'center'
              }}>
              </View>
              <View style={{
                position: 'absolute',
                bottom: 4,
                zIndex: 100,
                padding: 10
              }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: theme ? theme.primary : Color.primary,
                    fontSize: 20,
                    color: 'white',
                    textShadowColor: 'black',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 5,
                    fontWeight: 'bold',
                  }}
                >{data.synqt[0].date_at_human}</Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 20,
                    color: 'white',
                    textShadowColor: 'black',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 5,
                    fontWeight: 'bold',
                  }}
                >
                  {data.merchant.name}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    color: Color.gray,
                    marginTop: 5,
                    color: 'white',
                    textShadowColor: 'black',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 5,
                    fontWeight: 'bold',
                  }}
                >
                  {data.merchant.address ? this.getAddress(data.merchant.address) : 'no address provided'}
                </Text>
              </View>
            </ImageBackground>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              paddingLeft: 20
            }}>
              {this.state.isLoading ? <Spinner mode="overlay" /> : null}
              <FontAwesomeIcon icon={faUser} size={20} color={Color.gray} style={{ marginRight: 10 }} />
              <Text style={{ color: Color.gray }}>{this.state.members.length} people</Text>
              <View style={{
                flexDirection: 'row',
                position: 'absolute',
                right: 10
              }}>
                <View style={style.Distance}>
                  <Text numberOfLines={1} style={{ color: 'white' }}>{data.distance || '0km'}</Text>
                </View>
                <View style={style.Rate}>
                  <FontAwesomeIcon icon={faStar} color={Color.warning} style={{ marginRight: 2 }} size={15} />
                  <Text numberOfLines={1} style={{ color: theme ? theme.primary : Color.primary }}>{data.rating ? data.rating.avg : 0}</Text>
                </View>
                <View style={style.StarContainer}>
                  <TouchableOpacity style={style.Star}>
                    <FontAwesomeIcon icon={faStar} color={Color.white} size={15} />
                  </TouchableOpacity>
                  <Text numberOfLines={1} style={{ color: Color.warning }}>{data.total_super_likes || 0}</Text>
                </View>
              </View>
            </View>
            {this.props.navigation.state?.params?.buttonTitle === 'Make Reservation' && <View style={{
              width: '100%',
              marginTop: 25,
              padding: 10
            }}>
              {this.state.schedule?.length > 0 && this.state.schedule.map((item, index) => {
                return (
                  <View>
                    <View style={{
                      width: 80,
                      backgroundColor: theme ? theme.primary : Color.primary,
                      padding: 4,
                      height: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                      flexDirection: 'row'
                    }}>
                      <Text style={{ color: Color.white }}>{item.startTime?.hh ? item.startTime?.hh + ':' + item.startTime?.mm + ' ' + item.startTime?.a : ''} {item.startTime?.hh ? '-' : ''} {item.endTime?.hh ? item.endTime?.hh + ':' + item.endTime?.mm + ' ' + item.endTime?.a : ''}</Text>
                    </View>
                  </View>
                )
              })}
            </View>}
            <View style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: 25,
              padding: 10
            }}>
              <Group
                reverse={false}
                navigation={this.props.navigation}
                size={45}
                data={this.state.members.length > 0 ? this.state.members : []}
                style={{
                  height: '100%'
                }}
              />
            </View>
          </View>
        </ScrollView>
        <CustomizedButton backgroundColor={this.props.navigation.state?.params?.buttonTitle === 'Cancel' ? Color.danger : (theme ? theme.primary : Color.primary)} style={{ marginLeft: -20, marginBottom: 10 }} onClick={this.onClick} title={this.props.navigation.state?.params?.buttonTitle}></CustomizedButton>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    updateUser: (user) => dispatch(actions.updateUser(user)),
    setDefaultAddress: (defaultAddress) => dispatch(actions.setDefaultAddress(defaultAddress))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventName);