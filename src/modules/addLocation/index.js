import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, TextInput, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import AddressTile from 'modules/addLocation/AddressTile.js';
import Style from 'modules/addLocation/Style.js';
import Button from 'components/Form/Button';
import { Color, Routes, BasicStyles } from 'common';
import Api from 'services/api';
import {Spinner} from 'components';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class AddLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: null,
      addresses: [],
      isAddingAddressName: false,
      addingAddress: false,
      value: '',
      isLoading: false,
      executing: false
    };
  }

  onFocusFunction = () => {
    /**
     * Executed each time we enter in this component &&
     * will be executed after going back to this component 
    */
   console.log('[location]', this.props.state.location);
    if (this.state.addingAddress && this.props.state.location != null) {
      this.setState({ isAddingAddressName: true })
    }
  }

  componentDidMount() {
    this.retrieveAddresses();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  componentWillUnmount() {
    /**
     * removing the event listener added in the componentDidMount()
     */
    this.focusListener.remove()
  }

  selectHandler = (index) => {
    const {setDefaultAddress} = this.props;
    this.setState({ selectedAddress: index });
    setDefaultAddress(this.state.addresses[index]);
    this.props.navigation.pop()
  };

  renderAddresses = () => {
    const { addresses } = this.state
    return addresses.map((address, index) => {
      return (
        <AddressTile
          key={index}
          index={index}
          addressType={address.address_type}
          address={address.route}
          country={address.country}
          onPress={this.selectHandler}
          deletingClicked={() => this.alertMessage(index)}
          backgroundColor={
            this.state.selectedAddress === index ? '#22B173' : '#FFFFFF'
          }
          fontColor={
            this.state.selectedAddress === index ? '#FFFFFF' : '#000000'
          }
        />
      );
    });
  };

  retrieveAddresses = () => {
    const {user} = this.props.state
    let parameters = {
      condition: [
        {
          value: user.id,
          column: 'account_id',
          clause: '=',
        }
      ],
      limit: 100,
      offset: 0
    }
    this.setState({isLoading: true})
    Api.request(Routes.retrieveSavedAddresses, parameters, response => {
      this.setState({addresses: response.data});
      console.log("RESPONSE", response);
      if(response.data.length > 0) {
        this.setState({locations: response.data})
      }
      this.setState({isLoading: false});
    }, error => {
      console.log('retrieving addresses error: ', error)
    })
  }

  addAddress = () => {
    const {user, location} = this.props.state;
    const {value} = this.state
    let parameters = {
      account_id: user.id,
      latitude: location.latitude,
      longitude: location.longtitude,
      route: location.address,
      locality: location.locality,
      region: location.region,
      country: location.country,
      address_type: value,
      merchant_id: user.sub_account?.merchant?.id
    }
    console.log("parameters: ", parameters)
    this.setState({isLoading: true, executing: true})
    Api.request(Routes.addAddress, parameters, response => {
      // const {setLocation} = this.props
      console.log('=================== \nAdding Address Response: \n===================', response)
      this.retrieveAddresses();
      this.setState({isAddingAddressName: false, addingAddress: false})
      this.setState({isLoading: false, executing: false, value: ''})
      // setLocation(null)
    }, error => {
      console.log('Adding Address Error: ', error)
    })
  }

  alertMessage = (index) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to continue?',
      [
        {text: 'Cancel', onPress: () => console.log('Ok'), style: 'cancel'},
        {text: 'Ok', onPress: () => this.removeAddress(index), style: 'cancel'}
      ],
      { cancelable: false }
    )
  }

  removeAddress = (index) => {
    let parameter = {
      id: this.state.addresses[index].id
    }
    this.setState({isLoading: true})
    Api.request(Routes.removeAddress, parameter, response => {
      console.log('=================== \nRemoving Address Response: \n===================', response)
      this.retrieveAddresses();
      this.setState({isAddingAddressName: false})
      this.setState({isLoading: false, executing: false})
    }, error => {
      console.log('Removing Address Error: ', error)
    })
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  render() {
    const {location} = this.props.state
    const {isLoading} = this.state
    return (
      <View style={{
        flex: 1,
        paddingBottom: 70
      }}>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>

            {this.renderAddresses()}

          </View>
        </ScrollView>

        <Button
          onClick={async () => {
            const {setLocation} = await this.props
            await setLocation(null)
            console.log('[lcoation again]', this.props.state.location);
            await this.props.navigation.navigate('locationStack')
            await this.setState({addingAddress: true})
          }}
          title={'Add Address'}
          style={{
            backgroundColor: Color.secondary,
            position: 'absolute',
            bottom: 10,
            left: '5%',
            right: '5%',
            width: '90%'
          }}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isAddingAddressName}
        >
          <View style={Style.insideModalCenteredView}>
            <View style={Style.modalView}>
              <Text style={
                [
                  Style.modalText,
                  {
                    fontWeight: 'bold',
                    marginTop: 0
                  }
                ]
              }>Address Name: </Text>
              <View style={{ marginTop: 5, marginBottom: 5 }}>
                <TextInput
                  style={
                    [
                      {
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1
                      },
                      Style.textInput
                    ]
                  }
                  onChangeText={value => this.setState({ value })}
                  value={this.state.value}
                />
              </View>
              <Text style={
                [
                  {
                    fontWeight: 'bold',
                    textAlign: 'left'
                  },
                  Style.modalText
                ]
              }> Address: </Text>
              <Text style={
                [
                  Style.modalText,
                  {
                    color: Color.darkGray
                  }
                ]
              }>{location != null ? location.address : ''}</Text>
              <View
                style={
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }
              >
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor={Color.lightGray}
                  disabled={this.state.value !== '' && !this.state.executing ? false : true}
                  // style={{ 
                  //   ...Style.openButton, backgroundColor: Color.primaryDark }}
                  style={
                    [
                      BasicStyles.btn,
                      Style.btnWhite,
                      {
                        marginTop: 20
                      }
                    ]
                  }
                  onPress={() => {
                    this.addAddress()
                  }}
                >
                  <Text style={Style.textStyle}>Add</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    // updateUser: (user) => dispatch(actions.updateUser(user)),
    setLocation: (location) => dispatch(actions.setLocation(location)),
    setDefaultAddress: (defaultAddress) => dispatch(actions.setDefaultAddress(defaultAddress))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);
