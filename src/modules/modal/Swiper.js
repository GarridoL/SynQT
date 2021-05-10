import React, { Component } from 'react';
import { 
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert
} from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import Tab from 'modules/generic/TabOptions';
import MenuCards from 'modules/menu/cards';
import { Color, BasicStyles } from 'common';
import Information from 'modules/menu/information';
import { ScrollView } from 'react-native-gesture-handler';
import FLoatingButton from 'modules/generic/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import Config from 'src/config.js';
import { Routes } from 'common';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
import styles from './Swiper2Style';
import { connect } from 'react-redux';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: 'Menu',
      isLoading: true,
      index: 0,
      data: [],
      products: [],
      limit: 5,
      offset: 0
    }
  }


  choiceHandler = (value) => {
    this.setState({ choice: value })
  }

  componentDidMount() {
    this.retrieve();
  }

  retrieve = () => {
    let parameter = {
      condition: [{
        value: this.props.item.merchant.id,
        column: 'id',
        clause: '='
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.retrieveProducts();
        this.setState({ data: response.data[0] });
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  retrieveProducts = () => {
    let parameter = {
      condition: [{
        value: this.props.item.merchant.id,
        column: 'merchant_id',
        clause: '='
      }],
      account_id: this.props.state.user.id,
      sort: {title: 'asc'},
      limit: this.state.limit,
      offset: this.state.offset,
      inventory_type: 'all'
    }
    this.setState({ isLoading: true })
    Api.request(Routes.productsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ products: response.data });
      } else {
        this.setState({ products: []})
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  swipeHandler = () => {
    this.props.header(this.state.index >= this.state.data.length - 2 ? true : false);
    this.setState({ index: this.state.index + 1 === this.state.data.length ? 0 : this.state.index + 1 })
  }

  addToReservation = () => {
    let parameter = {
      account_id: this.props.state.user.id,
      merchant_id: this.props.item.merchant.id,
      payload: 'synqt',
      payload_value: this.props.item.synqt[0].id,
      details: this.props.item.synqt[0]?.details,
      datetime: this.props.item.synqt[0].date,
      status: 'pending'
    }
    this.props.onClose(null);
    this.props.navigation.navigate('eventNameStack', {parameter: parameter, buttonTitle: 'Make Reservation', data: this.props.item, messenger_group_id: this.props.messengerGroup?.messenger_group_id})
  }

  renderCard = (data) => {
    return (
      <View style={{ flex: 1}}>
          <Card style={[styles.card]}>
            <ImageBackground style={{ flex: 1, flexDirection: 'row', height: height - 150, width: null, resizeMode: 'cover', marginTop: this.props.bottomFloatButton === true ? 50 : height * 0.25 }}
              imageStyle={{
                flex: 1,
                height: null,
                width: null,
                resizeMode: 'cover',
                borderRadius: BasicStyles.standardBorderRadius,
                backgroundColor: 'white'
              }}
              source={data && data.logo ? { uri: Config.BACKEND_URL + data.logo } : require('assets/default.png')}>
                {this.state.isLoading ? <Spinner mode="overlay" /> : null}
              <View style={{
                position: 'absolute',
                bottom: this.props.topFloatButton === true ? 70 : 15,
                ...BasicStyles.standardWidth
              }}>
                <Text style={{
                  fontSize: BasicStyles.standardTitleFontSize,
                  color: 'white',
                  fontWeight: 'bold',
                  textShadowColor:'black',
                  textShadowOffset:{width: 1, height: 1},
                  textShadowRadius: 1,
                }}>{data && data.name && data.name || 'No data'}</Text>
                <Text style={{
                  color: 'white',
                  textShadowColor:'black',
                  textShadowOffset:{width: 1, height: 1},
                  textShadowRadius: 1
                  }}>{data && data.address && data.address && data.address || 'No address'}</Text>
              </View>
              <View style={{ position: 'absolute', bottom: 70, right: 15, flexDirection: 'row' }}>
                <FontAwesomeIcon
                  icon={faStar}
                  size={30}
                  color={'#FFCC00'}
                />
                <FontAwesomeIcon
                  icon={faStar}
                  size={30}
                  color={'#FFCC00'}
                />
                <FontAwesomeIcon
                  icon={faStar}
                  size={30}
                  color={'#FFCC00'}
                />
                <FontAwesomeIcon
                  icon={faStar}
                  size={30}
                  color={Color.gray}
                />
                <FontAwesomeIcon
                  icon={faStar}
                  size={30}
                  color={Color.gray}
                />
              </View>
              {this.props.topFloatButton === true && (<View style={{
                ...BasicStyles.standardWidth,
                position: 'absolute',
                bottom: -30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 70,
                    height: 70,
                    backgroundColor: Color.warning,
                    borderRadius: 35
                  }}

                  onPress={() => {
                    this.props.onClose(null)
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    size={35}
                    color={'white'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    backgroundColor: Color.warning,
                    borderRadius: 40
                  }}
                  onPress={() => {
                    if(this.props.navigation.state?.params?.messenger_group_id.status === 'ADMIN') {
                      this.addToReservation()
                    } else {
                      Alert.alert(
                        "",
                        "Sorry you are not allowed to proceed to reservation.",
                        [
                          { text: "OK"}
                        ],
                        { cancelable: false }
                      );
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    size={40}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>)}
            </ImageBackground>
          </Card>
        {this.renderMenu()}
      </View>
    )
  }

  renderMenu = () => {
    const { data } = this.state;
    return (
      <View
        style={{ padding: 20, marginTop: '5%' }}
      >
        <View>
          <View style={this.props.topFloatButton === true ? { marginTop: 30 } : { marginTop: 0 }}>
            <Tab level={1} choice={['Menu', 'Information']} onClick={this.choiceHandler}></Tab>
          </View>
          <View style={this.props.bottomFloatButton === true ? { marginBottom: 200 } : { marginBottom: 0 }}>
            {this.state.choice == 'Menu' ? (
              <View>
              <MenuCards data={this.state.products.length > 0 && this.state.products}/>
              {this.state.products.length === 0 && (
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 40
                }}>
                  <Text>No available product.</Text>
                </View>
              )}
              </View>
            ) :
              <Information
                name={this.state.data?.name || 'No data'}
                hours={this.state.data?.schedule || 'No schedule yet.'}
                description={' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. It is simply dummy text of the printing and typesetting industry.'}
              />}
          </View>
        </View>
      </View>
    )
  }

  render() {
    const { isLoading } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={true}
        style={{backgroundColor: 'white'}}
      >
        {this.renderCard(this.state.data && this.state.data)}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Cards);
