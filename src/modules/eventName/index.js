import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, TextInput, CheckBox, Modal, ImageBackground, Alert, Dimensions, Platform } from 'react-native';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import DateTimePicker from 'components/DateTime/index.js'
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
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      time: [],
      schedule: null,
      selectedTime: null,
      currentDate: null,
      changed_date: null,
      date: null,
      selectedDate: null,
      displayDate: [],
      showDatePicker: false,
      dateLabel: null,
      selected_date: null
    }
  }

  componentDidMount() {
    console.log(this.props.navigation.state?.params, '====button title.====');
    this.retrieveMembers();
    const { data, parameter } = this.props.navigation.state.params;
    let schedule = data?.merchant?.schedule && data?.merchant?.schedule !== 'NULL' ? JSON.parse(data?.merchant?.schedule) : null
    if (schedule && schedule !== 'NULL' && typeof (schedule) !== 'object') {
      schedule = JSON.parse(schedule);
    }
    let date = new Date()
    this.setState({
      schedule: schedule?.schedule,
      data: data,
      currentDate: date.setDate(date.getDate()),
      date: this.props.navigation?.state?.params?.data?.synqt[0].date
    })
    this.setState({ displayDate: schedule?.schedule })
    this.getTime(schedule?.schedule);
  }

  onClick = () => {
    if (this.props.navigation.state?.params?.buttonTitle === 'Cancel' || this.props.state.route) {
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
      'Are you sure you want to cancel your reservation?',
      [
        { text: 'No', onPress: () => { return }, style: 'cancel' },
        {
          text: 'Yes', onPress: () => {
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
    if (this.state.selectedTime === null) {
      Alert.alert(
        "",
        "Please select time.",
        [
          { text: "OK", onPress: () => { return } }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        '',
        'Are you sure you want to continue?',
        [
          { text: 'No', onPress: () => { return }, style: 'cancel' },
          {
            text: 'Yes', onPress: () => {
              this.setState({ isLoading: true })
              let datetime = this.state.selectedDate !== null ? this.state.selectedDate?.toString() : this.state.date?.toString();
              let forSynqt = datetime;
              let params = this.props.navigation.state?.params?.parameter;
              params['datetime'] = datetime + ' ' + this.state.selectedTime?.fourf;
              Api.request(Routes.reservationCreate, params, response => {
                this.setState({ isLoading: false })
                if (response.data !== null) {
                  this.synqtUpdate(params?.payload_value, forSynqt);
                  this.props.setCurrentRoute('EventName');
                  this.props.navigation.navigate('historyStack', { title: 'Upcoming', buttonTitle: 'Cancel' })
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
    this.setState({ selectedTime: null })
    let d = null;
    let length = schedule?.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        console.log(schedule[i].value, this.state.days[this.state.day], '---');
        if (schedule[i].value === this.state.days[this.state.day]) {
          d = schedule[i];
        }
      }
    }
    if (d) {
      let date = new Date();
      let stopper = d?.endTime?.hh || d?.endTime?.hh !== null || d?.endTime?.hh !== '' ? d?.endTime?.hh : 11;
      let stop = d?.endTime?.a || d?.endTime?.a !== null || d?.endTime?.a !== '' ? ` ${d?.endTime?.a}` : stopper > 12 && stopper % 12 ? ' pm' : ' am';
      let temp = [];
      let m = d?.startTime?.a ? ` ${d?.startTime?.a}` : hour > 12 && hour % 12 ? ' pm' : ' am';
      let hour = ((m === ' pm' ? parseInt(d?.startTime?.hh) + 12 : parseInt(d?.startTime?.hh)) || date.getHours()) + 1;
      let minutes = d?.startTime?.mm || date.getMinutes();
      while (temp[temp.length - 1]?.twelvef !== `11:${minutes} pm` || temp[temp.length - 1]?.twelvef === `${stopper}:${minutes} ${stop}`) {
        let convertedHour = hour > 12 ? hour % 12 : hour;
        convertedHour = convertedHour.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
        minutes = minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
        hour = hour.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
        let time = convertedHour + ':' + minutes + m
        let t = {
          twelvef: time,
          fourf: hour + ':' + minutes
        }
        let s = hour > 12 ? hour % 12 : hour;
        if (s.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) === stopper?.toString() && m === stop) {
          break;
        }
        temp.push(t);
        hour = parseInt(hour) === 23 ? 0 : parseInt(hour) + 1;
        m = hour > 11 && hour !== 0 ? ' pm' : ' am';
      }
      this.setState({ time: temp });
    } else {
      console.log('No schedule for this date.');
      this.setState({ time: [] })
    }
  }

  _date = () => {
    const { showDatePicker } = this.state;
    return (
      <View>
        {
          (showDatePicker && Platform.OS == 'ios') && (this._datePickerIOS())
        }
        {
          (showDatePicker && Platform.OS == 'android') && (this._datePickerAndroid('type'))
        }
      </View>
    );
  }

  _datePickerIOS = () => {
    return (
      <View>
        <DateTimePickerModal value={new Date()}
          isVisible={this.state.showDatePicker}
          mode="date"
          display="default"
          date={new Date()}
          minimumDate={new Date()}
          onChange={(date) => {
            this.dateHandler(date);
          }}
          onConfirm={(date) => {
            this.dateHandler(date);
          }}
          onCancel={() => {
            this.setState({
              showDatePicker: false
            })
          }}
        />
      </View>
    );
  }

  dateHandler = (date) => {
    this.setState({
      showDatePicker: false,
      changed_date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }, () => {
      let date = this.state.changed_date || null;
      let converted = '';
      if (date !== null) {
        let split = date.split('-');
        split[1] = parseInt(split[1]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
        split[2] = parseInt(split[2]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
        converted = split.join('-');
      }
      let day = new Date(converted).getDay()
      this.setState({
        selectedDate: this.state.changed_date,
        day: day
      }, () => {
        this.getTime(this.state.displayDate);
      })
    });
    console.log(this.state.changed_date, '-----');
  }

  _datePickerAndroid = (type) => {
    return (
      <View>
        <DateTimePicker value={new Date()}
          mode={type}
          display="default"
          date={new Date()}
          minimumDate={this.props.minimumDate}
          onCancel={() => this.setState({
            showDatePicker: false
          })}
          onConfirm={this.setDate}
          onChange={this.setDate}
        />
      </View>
    );
  }

  setDate = (event, date) => {
    this.dateHandler(date);
  }

  render() {
    const { theme } = this.props.state;
    const { data } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.Container}>
            <ImageBackground
              style={{
                width: '100%',
                height: '50%'
              }}
              imageStyle={{ flex: 1, height: null, width: null, resizeMode: 'cover' }}
              source={{ uri: Config.BACKEND_URL + data?.merchant.logo }}>
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
                <View style={[style.Distance, {
                  backgroundColor: theme ? theme.primary : Color.primary,
                  borderColor: theme ? theme.primary : Color.primary,
                }]}>
                  <Text numberOfLines={1} style={{ color: 'white' }}>{data?.distance || '0km'}</Text>
                </View>
                <View style={[style.Rate, {
                  borderColor: theme ? theme.primary : Color.primary
                }]}>
                  <FontAwesomeIcon icon={faStar} color={Color.warning} style={{ marginRight: 2 }} size={15} />
                  <Text numberOfLines={1} style={{ color: theme ? theme.primary : Color.primary }}>{data?.rating ? data?.rating.avg : 0}</Text>
                </View>
                <View style={[style.StarContainer, {
                  borderColor: theme ? theme.primary : Color.primary
                }]}>
                  <TouchableOpacity style={style.Star}>
                    <FontAwesomeIcon icon={faStar} color={Color.white} size={15} />
                  </TouchableOpacity>
                  <Text numberOfLines={1} style={{ color: Color.warning }}>{data?.total_super_likes || 0}</Text>
                </View>
              </View>
            </View>
            <View style={{
              zIndex: 100,
              padding: 10
            }}>
              {this.props.navigation.state?.params?.buttonTitle !== 'Cancel' && this.props.state.route === null && <Text style={{
                fontSize: 11,
                fontFamily: 'Poppins-SemiBold',
                marginBottom: 10
              }}>Note: Click the date to edit.</Text>}
              <View style={{
                width: width,
                marginBottom: 15
              }}>
                <Text
                  onPress={() => {
                    if (this.props.navigation.state?.params?.buttonTitle !== 'Cancel' && this.props.state.route === null) {
                      this.setState({ showDatePicker: true })
                    }
                  }}
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                  }}
                >{this.state.changed_date ? this.state.changed_date : data?.synqt[0].date_at_human}</Text>
                {this.state.changed_date && <Text
                  onPress={() => {
                    this.setState({
                      changed_date: null,
                      selectedDate: null,
                      day: new Date(this.props.navigation?.state?.params?.data?.synqt[0].date).getDay()
                    }, () => {
                      this.getTime(this.state.displayDate);
                    })
                  }}
                  numberOfLines={1}
                  style={{
                    color: Color.danger,
                    fontSize: 15,
                    position: 'absolute',
                    right: 20
                  }}
                >Cancel</Text>}
              </View>
              <View style={{
                flexDirection: 'row',
                width: '75%',
                marginBottom: -15
              }}>
                {this._date()}
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                }}
              >
                {data?.merchant.name}
              </Text>
              <Text
                numberOfLines={3}
                style={{
                  fontSize: 16,
                  width: width * .90
                }}
              >
                {data?.merchant.address ? this.getAddress(data?.merchant.address) : 'no address provided'}
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              width: '100%',
              paddingBottom: 10,
              paddingRight: 10,
              paddingLeft: 10
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
            {this.props.navigation.state?.params?.buttonTitle === 'Make Reservation' && this.props.state.route === null && <View style={{
              width: '100%',
              marginBottom: 100,
              padding: 10,
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              {this.state.time.length > 0 ? this.state.time.map((item, index) => {
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
                      if (this.state.selectedTime === item) {
                        this.setState({ selectedTime: null })
                      } else {
                        this.setState({ selectedTime: item })
                      }
                    }}>
                    <Text style={{ color: Color.white }}>{item?.twelvef}</Text>
                  </TouchableOpacity>
                )
              }) :
                <Text style={{ color: 'red' }}>Restaurant is closed on this day. Please select another date.</Text>}
            </View>}
          </View>
        </ScrollView>
        <CustomizedButton backgroundColor={this.props.navigation.state?.params?.buttonTitle === 'Cancel' || this.props.state.route ? Color.danger : (theme ? theme.primary : Color.primary)} style={{ marginLeft: -20, marginBottom: 10 }} onClick={this.onClick} title={this.props.state.route ? 'Cancel' : this.props.navigation.state?.params?.buttonTitle}></CustomizedButton>
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
    setCurrentRoute: (route) => dispatch(actions.setCurrentRoute(route)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventName);