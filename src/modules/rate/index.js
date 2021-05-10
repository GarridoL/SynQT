import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, TextInput, CheckBox, Modal, ImageBackground, Alert, Dimensions } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faStar, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import CustomizedButton from 'modules/generic/CustomizedButton';
import Config from 'src/config.js';
import Group from 'modules/generic/PeopleList.js'
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
class Rate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: null,
      isLoading: false,
      data: null,
      star: [
        {
          clicked: false
        },
        {
          clicked: false
        },
        {
          clicked: false
        },
        {
          clicked: false
        },
        {
          clicked: false
        }
      ],
      count: 0,
      id: null
    }
  }

  componentDidMount() {
    this.retrieve();
  }

  retrieve = () => {
    let parameter = {
      synqtId: this.props.navigation.state?.params?.synqtId
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ratingsMerchantRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data !== null) {
        let count = 0;
        if (response.data[0].rating?.length > 0) {
          this.setState({data: response.data[0]})
          response.data[0].rating.map(item => {
            if (item.account_id === this.props.state.user.id) {
              this.setState({
                comment: item.comments,
                id: item.id,
                star: [
                  {
                    clicked: item.value >= 1
                  },
                  {
                    clicked: item.value >= 2
                  },
                  {
                    clicked: item.value >= 3
                  },
                  {
                    clicked: item.value >= 4
                  },
                  {
                    clicked: item.value >= 5
                  }
                ]
              });
            }
            count += item.value;
          })
          this.setState({ count: count / response.data[0].rating.length });
        }
      }
    })
  }

  update = () => {
    let count = 0
    this.state.star.map(item => {
      if (item.clicked) {
        count++;
      }
    })
    let parameter = {
      id: this.state.id,
      title: this.state.title,
      value: count,
      comments: this.state.comment
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ratingsUpdate, parameter, response => {
      this.setState({ isLoading: false })
      if(response.data === true) {
        Alert.alert(
          "",
          "Rate submitted. Thank you.",
          [
            { text: "OK"}
          ],
          { cancelable: false }
        );
      }
    });
  }

  onClick = () => {
    let count = 0
    this.state.star.map(item => {
      if (item.clicked) {
        count++;
      }
    })
    let parameter = {
      account_id: this.props.state.user.id,
      payload: 'merchant_id',
      payload_value: this.state.data?.id,
      payload_1: 'synqt_id',
      payload_value_1: this.props.navigation.state?.params?.synqtId,
      value: count,
      comments: this.state.comment,
      status: 'complete'
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ratingsCreate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data !== null) {
        this.props.navigation.navigate('historyStack', { title: 'History' })
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  renderRateView() {
    const { data } = this.state;
    return (
      <View style={{ height: height }}>
        <View style={{
          backgroundColor: 'white',
          width: '100%',
          backgroundColor: 'white',
          padding: 15,
          height: height - (height / 1.7),
        }}>
          <Image
            style={{
              width: '100%',
              height: '80%',
              borderRadius: 10
            }}
            source={data?.logo ? { uri: Config.BACKEND_URL + data?.logo } : require('assets/test.jpg')}>
          </Image>
          <View style={{ padding: 10 }}>
            <Text style={{
              fontSize: 16,
            }}>
              {data?.name}
            </Text>
            <View style={{
              marginTop: 5,
              flexDirection: 'row'
            }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={13} style={{ marginTop: 3, marginRight: 5 }} />
              <Text>
                {data?.address}
              </Text>
            </View>
            <View style={{ position: 'absolute', top: 10, right: 0, flexDirection: 'row' }}>
              <FontAwesomeIcon
                icon={faStar}
                size={20}
                color={this.state.count >= 1 ? '#FFCC00' : '#ededed'}
              />
              <FontAwesomeIcon
                icon={faStar}
                size={20}
                color={this.state.count >= 2 ? '#FFCC00' : '#ededed'}
              />
              <FontAwesomeIcon
                icon={faStar}
                size={20}
                color={this.state.count >= 3 ? '#FFCC00' : '#ededed'}
              />
              <FontAwesomeIcon
                icon={faStar}
                size={20}
                color={this.state.count >= 4 ? '#FFCC00' : '#ededed'}
              />
              <FontAwesomeIcon
                icon={faStar}
                size={20}
                color={this.state.count >= 5 ? '#FFCC00' : '#ededed'}
              />
            </View>
          </View>
        </View>
        <View style={{
          height: 50,
          width: width,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Color.gray
        }}>
        </View>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30
        }}>
          <Text>How would you rate the service of our restaurant?</Text>
          <View style={{ flexDirection: 'row', padding: 30 }}>
            {this.state.star.map((item, index) => {
              return (
                <TouchableOpacity onPress={() => {
                  let temp = this.state.star;
                  console.log(index, 'yo');
                  for (let i = 0; i <= 4; i++) {
                    temp[i].clicked = i <= index;
                  }
                  this.setState({ star: temp });
                }}>
                  <FontAwesomeIcon
                    icon={faStar}
                    size={40}
                    color={item.clicked ? '#FFCC00' : '#ededed'}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
          <Text>Tell us about your experience</Text>
          <TextInput
            style={{
              borderColor: Color.gray,
              borderWidth: .5,
              borderRadius: 15,
              width: '90%',
              marginTop: 10,
            }}
            multiline={true}
            numberOfLines={5}
            onChangeText={text => this.setState({ comment: text })}
            value={this.state.comment}
            placeholder=""
          />
        </View>
      </View>
    )
  }

  render() {
    const { data } = this.props.navigation.state.params;
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView style={{ height: height - 50 }}>
          {this.state.data && this.renderRateView()}
          {this.state.data === null && this.state.isLoading === false && <Text>Book for a reservation first to rate the merchant.</Text>}
        </ScrollView>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: -50,
          marginBottom: 20
        }}>
          {this.state.data && <CustomizedButton onClick={() => { this.state.data ? this.update() : this.onClick }} title={this.state.data ? 'Update' : 'Submit'}></CustomizedButton>}
        </View>
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
)(Rate);