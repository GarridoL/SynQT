import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ImageBackground
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
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, {}, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ data: response.data });
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  retrieveProducts = () => {
    let menu = this.state.data[this.state.index]
    let parameter = {
      condition: [{
        value: menu.id,
        column: 'merchant_id',
        clause: '='
      }],
      account_id: menu.account_id,
      sort: { title: 'asc' },
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
        this.setState({ products: [] })
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
    this.setState({ index: this.state.index + 1 === this.state.data.length ? 0 : this.state.index + 1, products: [] })
  }

  addToTopChoice = () => {
    let parameter = {
      account_id: this.props.state.user.id,
      payload: 'merchant_id',
      payload_value: this.state.data[this.state.index].id,
      category: 'restaurant',
      synqt_id: this.props.navigation.state.params?.synqt_id && this.props.navigation.state.params?.synqt_id
    }
    this.setState({ isLoading: true })
    Api.request(Routes.topChoiceCreate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data !== null) {
        this.deleteFromNotification(this.props.id);
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  deleteFromNotification = (id) => {
    let parameter = {
      id: id
    }
    this.setState({ isLoading: true });
    Api.request(Routes.notificationDelete, parameter, response => {
      this.setState({ isLoading: false })
      this.props.navigation.navigate('topChoiceStack', { synqt_id: this.props.navigation.state.params?.synqt_id });
    });
  }

  renderCard = () => {
    return (
      <View style={{ flex: 1, marginTop: '91%' }}>
        <CardStack
          style={styles.content}
          renderNoMoreCards={() => <View><Text>{this.state.isLoading ? <Spinner mode="overlay" /> : 'No more cards.'}</Text></View>}
          ref={swiper => {
            this.swiper = swiper
          }}
          onSwiped={() => this.swipeHandler()}
          onSwipedLeft={() => console.log('onSwipedLeft')}
          disableBottomSwipe={true}
          disableTopSwipe={true}
        >
          {
            this.state.data && this.state.data.map((el, idx) => {
              return (
                <Card style={[styles.card]}>
                  <ImageBackground style={{ resizeMode: 'contain', flex: 1, flexDirection: 'row', height: height - 150, width: null, marginTop: this.props.bottomFloatButton === true ? 50 : height * 0.25 }}
                    imageStyle={{
                      flex: 1,
                      height: null,
                      width: null,
                      resizeMode: 'cover',
                      borderRadius: BasicStyles.standardBorderRadius,
                      backgroundColor: 'white'
                    }}
                    source={el.logo ? { uri: Config.BACKEND_URL + el.logo } : require('assets/default.png')}>
                    <View style={{
                      position: 'absolute',
                      bottom: this.props.topFloatButton === true ? 100 : 25,
                      ...BasicStyles.standardWidth
                    }}>
                      <Text style={{
                        color: el.logo ? Color.white : 'black',
                        fontSize: BasicStyles.standardTitleFontSize,
                        textShadowColor: 'black',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                        fontWeight: 'bold',
                      }}>{el.name || 'No data'}</Text>
                      <Text style={{
                        color: el.logo ? Color.white : 'black',
                        textShadowColor: 'black',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                        fontWeight: 'bold',
                      }}>{el.address || 'No address'}</Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 15, right: 20, flexDirection: 'row' }}>
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
                        color={'white'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={30}
                        color={'white'}
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
                          this.props.onClose()
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
              )
            })
          }
        </CardStack>
        {this.renderMenu()}
      </View>
    )
  }

  renderMenu = () => {
    const { data } = this.state;
    return (
      <View
        style={{ padding: 20, marginTop: '90%' }}
      >
        <View>
          <View style={this.props.topFloatButton === true ? { marginTop: 30 } : { marginTop: 0 }}>
            <Tab level={1} choice={['Menu', 'Information']} onClick={this.choiceHandler}></Tab>
          </View>
          <View style={this.props.bottomFloatButton === true ? { marginBottom: 200 } : { marginBottom: 0 }}>
            {this.state.choice == 'Menu' ? (
              <View>
                <MenuCards data={this.state.products.length > 0 && this.state.products} />
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
                name={this.state.data[this.state.index]?.name || 'No data'}
                hours={this.state.data[this.state.index]?.schedule || 'No schedule yet.'}
                description={' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. It is simply dummy text of the printing and typesetting industry.'}
              />}
          </View>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          {this.props.bottomFloatButton === true > 0 && (<FLoatingButton onClick={() => { this.addToTopChoice() }}></FLoatingButton>)}
        </View>
      </View>
    )
  }

  render() {
    const { isLoading } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={true}
        onScroll={(event) => {
          let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
          let totalHeight = event.nativeEvent.contentSize.height
          if (event.nativeEvent.contentOffset.y <= 0) {
            if (isLoading == false) {
              // this.retrieve(false)
            }
          }
          if (Math.round(scrollingHeight) >= Math.round(totalHeight)) {
            if (isLoading == false && this.state.choice === 'Menu') {
              this.retrieveProducts();
            }
          }
        }}
      >
        {this.renderCard()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Cards);
