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
    this.retrieveTopChoices()
  }

  retrieve = () => {
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, {
      sort: {
        name: 'asc'
      }
    }, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ data: response.data, index: response.data.length - 1 });
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
      this.setState({finishLoad: true})
      let temp = []
      response.data.length > 0 && response.data.map(item => {
        item.members.length > 0 && item.members.map(i => {
          if(i.account_id == this.props.state.user.id) {
            temp.push(item.merchant.id)
          }
        })
      })
      this.props.setTopChoices(temp);
    });
  }

  goBack = () => {
    console.log('test');
    this.swipe.swipeRight();
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
      offset: this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      inventory_type: 'all'
    }
    console.log(menu);
    console.log(parameter);
    this.setState({ isLoading: true })
    Api.request(Routes.productsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          offset: this.state.offset + 1,
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
    console.log(this.state.index + 1, this.state.data.length - 2);
    this.props.header(this.state.index + 1 === this.state.data.length - 2 ? true : false);
    this.setState({ index: this.state.index + 1 === this.state.data.length ? 0 : this.state.index + 1, products: [], offset: 0 })
  }

  addToTopChoice = () => {
    const { topChoices } = this.props.state;
    if(topChoices.includes(this.state.data[this.state.index].id)) {
      Alert.alert(
        "",
        "Cannot choose the same restaurant twice.",
        [
          { text: "OK" }
        ],
        { cancelable: false }
      );
      return
    }
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
        topChoices.push(this.state.data[this.state.index].id)
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

  renderCard = () => {
    return (
      <View style={{ flex: 1, marginTop: '91%' }}>
        <CardStack
          style={styles.content}
          loop={true}
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
            this.state.data.length > 0 && this.state.data.map((el, idx) => {
              return (
                <Card style={[styles.card]}>
                  <ImageBackground style={{ resizeMode: 'cover', flex: 1, flexDirection: 'row', height: height - 140, width: null, marginTop: this.props.bottomFloatButton === true ? 50 : height * 0.25 }}
                    imageStyle={{
                      flex: 1,
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
                        color: Color.white,
                        fontSize: BasicStyles.standardTitleFontSize,
                        textShadowColor: 'black',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                        fontWeight: 'bold',
                      }}>{el.name || 'No data'}</Text>
                      <Text style={{
                        color: Color.white,
                        textShadowColor: 'black',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                        fontWeight: 'bold',
                        width: '70%'
                      }}>{el.address || 'No address'}</Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 25, right: 20, flexDirection: 'row' }}>
                      <FontAwesomeIcon
                        icon={faStar}
                        size={30}
                        color={this.state.data[this.state.index]?.rating?.stars >= 1 ? '#FFCC00' : '#ededed'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={30}
                        color={this.state.data[this.state.index]?.rating?.stars >= 2 ? '#FFCC00' : '#ededed'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={30}
                        color={this.state.data[this.state.index]?.rating?.stars >= 3 ? '#FFCC00' : '#ededed'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={30}
                        color={this.state.data[this.state.index]?.rating?.stars >= 4 ? '#FFCC00' : '#ededed'}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size={30}
                        color={this.state.data[this.state.index]?.rating?.stars >= 5 ? '#FFCC00' : '#ededed'}
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
        style={{ marginTop: '90%' }}
      >
        <View style={{ padding: 20 }}>
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
                name={this.state.data[this.state.index]?.name || 'No data'}
                hours={this.state.data[this.state.index]?.schedule || 'No schedule yet.'}
                description={this.state.data[this.state.index]?.addition_informations || 'No business information.'}
              />}
          </View>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        </View>
        {this.props.bottomFloatButton === true > 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center', width: '90%' }}>
            <FLoatingButton onClose={() => {this.swiper.swipeRight()}} onClick={() => { this.addToTopChoice() }}></FLoatingButton>
          </View>)}
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
