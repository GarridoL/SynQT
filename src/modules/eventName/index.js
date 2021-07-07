import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, TextInput, CheckBox, Modal, ImageBackground, Alert, Dimensions } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faStar, faClock, faWindowClose, faCheckSquare, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import CustomizedButton from 'modules/generic/CustomizedButton';
import Config from 'src/config.js';
import Group from 'modules/generic/GroupUsers';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
import Style from '../history/Style';
import style from './Style';
import DateTimePicker from 'components/DateTime/index.js'
import moment from 'moment';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
class EventName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      value: null,
      placeOrder: false,
      isLoading: false,
      members: [],
      day: new Date(this.props.navigation?.state?.params?.data?.synqt[0].date).getDay(),
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      time: [],
      schedule: null,
      selectedTime: null,
      currentDate: null,
      changed_date: null,
      showDate: false,
      date: null,
      selectedDate: null
    }
  }

  componentDidMount() {
    this.retrieveMembers();
    const { data, parameter } = this.props.navigation.state.params;
    let schedule = data?.merchant?.schedule && data?.merchant?.schedule !== 'NULL' ? JSON.parse(data?.merchant?.schedule) : null
    if (schedule && schedule !== 'NULL' && typeof (schedule) !== 'object') {
      schedule = JSON.parse(schedule);
    }
    console.log(parameter, 'hi')
    let date = new Date()
    this.setState({
      schedule: schedule?.schedule,
      data: data,
      currentDate: date.setDate(date.getDate()),
      date: this.props.navigation.state?.params?.parameter?.datetime
    })
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
    if(this.state.selectedTime === null) {
      return;
    }
    Alert.alert(
      '',
      'Kindly confirm to continue',
      [
        { text: 'Cancel', onPress: () => { return }, style: 'cancel' },
        {
          text: 'Confirm', onPress: () => {
            this.setState({ isLoading: true })
            let datetime = this.state.selectedDate !== null ? this.state.selectedDate?.date?.toString() : this.state.date?.toString();
            let forSynqt = datetime;
            // datetime = datetime?.split('-');
            // datetime = new Date(datetime.join('/'));
            // let time = this.state.selectedTime?.fourf?.split(':');
            // datetime.setHours(time[0], time[1], 0)
            let params = this.props.navigation.state?.params?.parameter;
            params['datetime'] = datetime + ' ' + this.state.selectedTime?.fourf;
            console.log(params, 'test');
            Api.request(Routes.reservationCreate, params, response => {
              this.setState({ isLoading: false })
              if (response.data !== null) {
                this.synqtUpdate(params?.payload_value, forSynqt);
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

  synqtUpdate = (id, date) => {
    let parameter = {
      id: id,
      datetime: date
    }
    this.setState({ isLoading: true })
    Api.request(Routes.synqtUpdate, parameter, response => {
      this.setState({ isLoading: false })
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  getTime = (schedule) => {
    let d = null;
    let length = schedule?.length;
    if(length > 0) {
      for(let i = 0; i < length; i++) {
        if(schedule[i].value !== this.state.days[this.state.day - 1]) {
          d = schedule[i + 1 === length ? 0 : i + 1];
        } else {
          d = schedule[i];
        }
      }
    }
    let date = new Date();
    let stopper = d?.endTime?.hh || 11;
    let stop = d?.startTime?.a || stopper > 12 && stopper % 12 ? ' pm' : ' am';
    let temp = [];
    let hour = (parseInt(d?.startTime?.hh) + 12 || date.getHours()) + 1;
    let minutes = d?.startTime?.mm || date.getMinutes();
    let m = d?.startTime?.a || hour > 12 && hour % 12 ? ' pm' : ' am';
    while(temp[temp.length - 1]?.twelvef !== `11:${minutes} pm` || temp[temp.length - 1]?.twelvef === `${stopper}:${minutes} ${stop}`) {
      m = hour > 12 && hour % 12 ? ' pm' : ' am';
      let convertedHour = hour > 12 && hour % 12 || 12;
      convertedHour = convertedHour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      minutes = minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      hour = hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      let time = convertedHour + ':' + minutes + m
      let t = {
        twelvef: time,
        fourf: hour + ':' + minutes 
      }
      let s = hour > 12 && hour % 12;
      if(s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) === stopper) {
        break;
      }
      temp.push(t);
      hour = parseInt(hour) === 23 ? 0 : parseInt(hour) + 1;
    }
    this.setState({time: temp});
  }

  render() {
    const { theme } = this.props.state;
    const { data } = this.state;
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
              source={{ uri: Config.BACKEND_URL + data?.merchant.logo }}>
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
                {this.state.showDate === false && <Text
                  onPress={() => {
                    this.setState({showDate: true})
                  }}
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
                >{this.state.changed_date ? this.state.changed_date?.date : data?.synqt[0].date_at_human}</Text>}
                {this.state.showDate && <View style={{
                  flexDirection: 'row',
                  width: '75%',
                  marginBottom: -15
                }}>
                <DateTimePicker
                borderBottomColor={Color.gray}
                icon={true}
                backgroundColor={Color.containerBackground}
                textStyle={{ marginRight: '-7%' }}
                borderColor={Color.containerBackground}
                type={'date'}
                placeholder={'Select Date'}
                onFinish={(date) => {
                  this.setState({
                    changed_date: date
                  })
                }}
                minimumDate={this.state.currentDate}
                style={{
                  marginTop: '-5%'
                }} />
                <View style={{
                  width: '25%',
                  flexDirection: 'row'
                }}>
                <TouchableOpacity style={{
                  margin: 5,
                  height:50,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.setState({showDate: false})
                }}>
                  <FontAwesomeIcon icon={faTimes} size={40} color={Color.danger} />
                </TouchableOpacity>
                <TouchableOpacity style={{
                  height:50,
                  justifyContent: 'center',
                  margin: 5
                }}
                onPress={() => {
                  this.setState({showDate: false, selectedDate: this.state.changed_date})
                }}>
                  <FontAwesomeIcon icon={faCheck} size={35} color={theme ? theme.primary : Color.primary} />
                </TouchableOpacity>
                </View>
                </View>}
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
                  {data?.merchant.name}
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
                  {data?.merchant.address ? this.getAddress(data?.merchant.address) : 'no address provided'}
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
                  <Text numberOfLines={1} style={{ color: 'white' }}>{data?.distance || '0km'}</Text>
                </View>
                <View style={style.Rate}>
                  <FontAwesomeIcon icon={faStar} color={Color.warning} style={{ marginRight: 2 }} size={15} />
                  <Text numberOfLines={1} style={{ color: theme ? theme.primary : Color.primary }}>{data?.rating ? data?.rating.avg : 0}</Text>
                </View>
                <View style={style.StarContainer}>
                  <TouchableOpacity style={style.Star}>
                    <FontAwesomeIcon icon={faStar} color={Color.white} size={15} />
                  </TouchableOpacity>
                  <Text numberOfLines={1} style={{ color: Color.warning }}>{data?.total_super_likes || 0}</Text>
                </View>
              </View>
            </View>
            {this.props.navigation.state?.params?.buttonTitle === 'Make Reservation' && <View style={{
              width: '100%',
              marginTop: 25,
              padding: 10,
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              {this.state.time.length > 0 && this.state.time.map((item, index) => {
                return (
                    <TouchableOpacity style={{
                      width: 70,
                      backgroundColor: this.state.selectedTime?.twelvef !== item?.twelvef ? (theme ? theme.primary : Color.primary) : theme ? theme.secondary : Color.secondary,
                      height: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                      flexDirection: 'row',
                      margin: 2
                    }}
                    onPress={() => {
                      this.setState({
                        selectedTime: item
                      })
                    }}>
                      <Text style={{ color: Color.white }}>{item?.twelvef}</Text>
                    </TouchableOpacity>
                )
              })}
            </View>}
            <View style={{
              flexDirection: 'row',
              width: '100%',
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