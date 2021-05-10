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
      members: []
    }
  }

  componentDidMount() {
    this.retrieveMembers();
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
    this.setState({ isLoading: true });
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
    console.log(parameter, 'paramter');
    Api.request(Routes.messengerMembersRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      console.log(response, 'response')
      if (response.data.length > 0) {
        this.setState({ members: response.data })
      }
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

  render() {
    const { data } = this.props.navigation.state.params;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.Container}>
          <ImageBackground
            style={{
              width: '100%',
              height: '50%'
            }}
            imageStyle={{ flex: 1, height: null, width: null, resizeMode: 'cover' }}
            source={{ uri: Config.BACKEND_URL + data.merchant.logo }}>
          </ImageBackground>
          <View style={{ padding: 10 }}>
            <Text style={{
              fontSize: 16,
            }}>
              {data.merchant.name}
            </Text>
            <Text style={{
              color: Color.gray,
              marginTop: 5
            }}>
              {data.merchant.address || 'no address provided'}
            </Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            paddingLeft: 20
          }}>
            {this.state.isLoading ? <Spinner mode="overlay" /> : null}
            <FontAwesomeIcon icon={faUser} size={20} color={Color.gray} style={{ marginRight: 10 }} />
            <Text style={{ color: Color.gray }}>{this.state.members.length} people</Text>
            <View style={style.Date}>
              <Text style={{ color: Color.primary, fontSize: 10 }}>{data.synqt[0].date}</Text>
            </View>
            <View style={style.Distance}>
              <Text numberOfLines={1} style={{ fontSize: 10, color: 'white' }}>0.64 km</Text>
            </View>
            <View style={style.Rate}>
              <FontAwesomeIcon icon={faStar} color={Color.warning} style={{ marginRight: 2 }} size={8} />
              <Text numberOfLines={1} style={{ fontSize: 10, color: Color.primary }}>43</Text>
            </View>
            <View style={style.StarContainer}>
              <TouchableOpacity style={style.Star}>
                <FontAwesomeIcon icon={faStar} color={Color.white} size={8} />
              </TouchableOpacity>
              <Text numberOfLines={1} style={{ color: Color.warning }}>1</Text>
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 25,
            padding: 10
          }}>
            <Group navigation={this.props.navigation} size={45} data={this.state.members.length > 0 ? this.state.members : []} />
          </View>
          <CustomizedButton style={{marginLeft:-20, marginBottom: 10}} onClick={this.onClick} title={this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.buttonTitle && this.props.navigation.state.params.buttonTitle}></CustomizedButton>
        </View>
      </ScrollView>
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