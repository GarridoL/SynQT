import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
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
import _ from 'lodash';
import Header from '../generic/MenuHeader';
import ConfettiCannon from 'react-native-confetti-cannon';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: 'Menu',
      isLoading: true,
      isLoading1: false,
      index: 0,
      data: [],
      products: [],
      limit: 5,
      offset: 0,
      active: 0,
      offset1: 0,
      limit1: 5
    }
  }


  choiceHandler = (value) => {
    this.setState({ choice: value })
  }

  componentDidMount() {
    this.props.setTopChoices([])
    this.retrieveTopChoices()
  }

  retrieve = () => {
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, {
      synqt_id: this.props.navigation.state.params?.synqt_id,
      limit: 5,
      offset: 0,
      sort: {
        name: 'asc'
      }
    }, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        response.data.map((item, index) => {
          item['index'] = 0;
        })
        this.setState({ data: response.data, index: response.data.length - 1, offset: 2 });
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  retrieveTopChoices = () => {
    let parameter = {
      condition: [{
        value: this.props.navigation.state.params?.synqt_id,
        column: 'synqt_id',
        clause: '='
      }],
      limit: 5,
      offset: 0
    }
    Api.request(Routes.topChoiceRetrieve, parameter, response => {
      this.retrieve();
      let temp = []
      response.data.length > 0 && response.data.map((item, index) => {
        item.members.length > 0 && item.members.map(i => {
          if (i.account_id == this.props.state.user.id) {
            temp.push(item.merchant.id)
          }
        })
      })
      this.props.setTopChoices(temp);
    });
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
      limit: this.state.limit1,
      offset: this.state.offset1 > 0 ? (this.state.offset1 * this.state.limit1) : this.state.offset1,
      inventory_type: 'all'
    }
    this.setState({ isLoading: true })
    Api.request(Routes.productsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          offset1: this.state.offset1 + 1,
          products: _.uniqBy([...this.state.products, ...response.data], 'id')
        })
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  swipeHandler = () => {
    this.setState({
      index: this.state.index + 1 === this.state.data.length ? 0 : this.state.index + 1,
      products: [],
      offset1: 0,
      active: 0
    })
    if(this.state.data.length  > 5 && this.state.index === this.state.data.length - 3) {
      this.retrieveAgain();
    }
  }

  retrieveAgain = () => {
    let parameter = {
      synqt_id: this.props.navigation.state.params?.synqt_id,
      limit: this.state.limit,
      offset: this.state.offset,
      sort: {
        name: 'asc'
      }
    }
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      if (response.data.length > 0) {
        let temp = this.state.data;
        response.data.map((item, index) => {
          item['index'] = 0;
          temp.push(item);
        })
        this.setState({ data: temp, offset: this.state.offset + this.state.limit});
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  startExplosion = () => {
    this.explosion && this.explosion.start();
  };

  addToTopChoice = (status, id) => {
    const { topChoices } = this.props.state;
    console.log(this.props.state.topChoices, 'top choices');
    console.log(id, 'id');
    if (topChoices.includes(id)) {
      Alert.alert(
        "",
        "Cannot choose the same restaurant twice.",
        [
          { text: "OK", style: 'cancel' }
        ],
        { cancelable: false }
      );
    } else {
      console.log('not on top choice yet!');
      let parameter = {
        account_id: this.props.state.user.id,
        payload: 'merchant_id',
        payload_value: id,
        category: 'restaurant',
        status: status,
        synqt_id: this.props.navigation.state.params?.synqt_id && this.props.navigation.state.params?.synqt_id
      }
      Api.request(Routes.topChoiceCreate, parameter, response => {
        if (response.data !== null) {
          let top = topChoices;
          top.push(id);
          // this.deleteFromNotification(this.props.id);
          this.props.setTopChoices(top);
          if(status === 'super-like') {
            this.startExplosion();
          }
        }
      },
        error => {
          this.setState({ isLoading1: false })
          console.log({ error });
        },
      );
    }
  }

  deleteFromNotification = (id) => {
    let parameter = {
      id: id
    }
    this.setState({ isLoading: true });
    Api.request(Routes.notificationDelete, parameter, response => {
      this.setState({ isLoading: false })
      // this.props.navigation.navigate('topChoiceStack', { synqt_id: this.props.navigation.state.params?.synqt_id });
      Alert.alert(
        "",
        "Choice successfully submitted.",
        [
          { text: "OK" }
        ],
        { cancelable: false }
      );
    });
  }

  getAddress = (address) => {
    let location = null
    try {
      location = JSON.parse(address).name
    } catch (e) {
      // console.log(e);
      location = address
    }
    return location;
  }

  getWidth = (photos) => {
    let temp = width - 50;
    if (photos.length > 0) {
      return temp / photos.length
    } else {
      return temp;
    }
  }

  change = (option, item, index) => {
    let temp = this.state.data;
    if (option === 'next') {
      temp[index].index = item.featured_photos.length === item.index + 1 ? item.index : item.index + 1;
    } else {
      temp[index].index = item.index === 0 ? 0 : item.index - 1;
    }
    this.setState({ data: temp, active: this.state.data[index].index })
  }

  renderCard = (data) => {
    const { theme } = this.props.state;
    return (
      <View style={{ flex: 1, marginTop: '91%' }}>
        <CardStack
          style={styles.content}
          loop={true}
          renderNoMoreCards={() => <View><Text>{this.state.isLoading ? <Spinner mode="overlay" /> : 'No merchant.'}</Text></View>}
          ref={swiper => {
            this.swiper = swiper
          }}
          onSwiped={() => {console.log('hi');}}
          onSwipedLeft={() => {this.swipeHandler()}}
          onSwipedRight={() => {this.addToTopChoice('like', this.state.data[this.state.index].id); this.swipeHandler()}}
          disableBottomSwipe={true}
          disableTopSwipe={true}
        >
          {
            data.length > 0 && data.map((el, idx) => {
              return (
                <Card style={styles.card} key={idx + el.featured_photos[this.state.active]?.url}>
                  <ImageBackground style={{ resizeMode: 'contain', flex: 1, flexDirection: 'row', height: '88%', width: null, marginTop: this.props.bottomFloatButton === true ? 50 : height * 0.25 }}
                    imageStyle={{
                      flex: 1,
                      resizeMode: 'cover',
                      borderRadius: BasicStyles.standardBorderRadius,
                      backgroundColor: 'white'
                    }}
                    source={el.featured_photos?.length > 0 ? { uri: Config.BACKEND_URL + el.featured_photos[this.state.active]?.url } : require('assets/default.png')}>
                    <View
                      style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        padding: 5,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                      {el.featured_photos?.length > 0 && el.featured_photos.map((item, index) => {
                        return (
                          <View
                            style={{
                              margin: 1,
                              backgroundColor: this.state.active === index ? 'white' : '#b5b5b5',
                              height: 5,
                              width: this.getWidth(el.featured_photos),
                              borderRadius: 10
                            }}
                          ></View>)
                      })}
                    </View>
                    <TouchableOpacity
                      style={{
                        height: '70%',
                        width: '35%',
                        position: 'absolute',
                        left: 20,
                        zIndex: 100
                      }}
                      onPress={() => {
                        this.change('prev', el, idx)
                      }}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        height: '70%',
                        width: '35%',
                        position: 'absolute',
                        right: 20,
                        zIndex: 100
                      }}
                      onPress={() => {
                        this.change('next', el, idx)
                      }}
                    >
                    </TouchableOpacity>
                    <View style={{
                      position: 'absolute',
                      bottom: 100,
                      ...BasicStyles.standardWidth
                    }}>
                      <Text style={{
                        color: Color.white,
                        fontSize: BasicStyles.standardTitleFontSize,
                        textShadowColor: 'black',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                        fontWeight: 'bold',
                        width: '50%'
                      }}>{el.name || 'No data'}</Text>
                      <Text style={{
                        color: Color.white,
                        textShadowColor: 'black',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                        fontWeight: 'bold',
                        width: '50%'
                      }}>{el.address ? this.getAddress(el.address) : 'No address provided'}</Text>
                    </View>

                    <View style={{ position: 'absolute', bottom: 100, right: 10, flexDirection: 'row' }}>
                      <FontAwesomeIcon
                        icon={faStar}
                        size={25}
                        color={el?.rating?.stars >= 1 ? '#FFCC00' : '#ededed'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={25}
                        color={el?.rating?.stars >= 2 ? '#FFCC00' : '#ededed'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={25}
                        color={el?.rating?.stars >= 3 ? '#FFCC00' : '#ededed'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={25}
                        color={el?.rating?.stars >= 4 ? '#FFCC00' : '#ededed'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={25}
                        color={el?.rating?.stars >= 5 ? '#FFCC00' : '#ededed'}
                      />
                    </View>
                    <TouchableOpacity style={{
                      position: 'absolute',
                      bottom: 170,
                      right: 20,
                      backgroundColor: '#30F2F2',
                      height: 90,
                      width: 90,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 200
                    }}
                      onPress={() => {
                        this.addToTopChoice('super-like', this.state.data[this.state.index].id);
                        this.swiper.swipeLeft();
                      }}>
                      <FontAwesomeIcon
                        icon={faStar}
                        size={60}
                        color={'white'}
                      />
                    </TouchableOpacity>
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
        {this.state.data.length > 0 && this.renderMenu()}
      </View>
    )
  }

  renderMenu = () => {
    const { data } = this.state;
    return (
      <View
        style={{ marginTop: '76%' }}
      >
        <View style={{ padding: 10, width: width }}>
          <View style={{
            marginTop: 20,
            textAlign: 'center',
            justifyContent: 'center'
          }}>
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
                hours={this.state.data[this.state.index]?.schedule}
                description={this.state.data[this.state.index]?.addition_informations || 'No business information.'}
              />}
          </View>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        </View>
        <View style={{
          marginBottom: 50
        }}>
        {this.props.bottomFloatButton === true > 0 && (
          <FLoatingButton onClose={() => { this.swiper.swipeRight(); }} onClick={() => { this.addToTopChoice('like', this.state.data[this.state.index].id); this.swiper.swipeLeft(); }}></FLoatingButton>
        )}
        </View>
      </View>
    )
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{ backgroundColor: Color.containerBackground }}>
        <Header navigation={this.props.navigation} status={this.state.index === this.state.data.length - 2 ? true : false} {...this.props} goBack={() => { this.swipeHandler() }}></Header>
        <ScrollView style={{
          marginTop: 40,
          height: height,
          backgroundColor: Color.containerBackground
        }} showsVerticalScrollIndicator={false}
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
          {this.renderCard(this.state.data)}
        </ScrollView>
        {this.state.isLoading1 ? <Spinner mode="overlay" /> : null}
        <ConfettiCannon
          count={200}
          origin={{x: -10, y: 0}}
          autoStart={false}
          ref={ref => (this.explosion = ref)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setTopChoices: (topChoices) => dispatch(actions.setTopChoices(topChoices))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cards);
