import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, BackHandler } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import Pagination from 'components/Pagination/Icons';
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faUtensils, faChevronLeft, faTicketAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import ImageCardWithUser from 'modules/generic/ImageCardWithUser';
import CardModal from 'modules/modal/Swipe.js';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
import _ from 'lodash';

const height = Math.round(Dimensions.get('window').height);
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      data: [],
      isLoading: false,
      isVisible: false,
      limit: 50,
      offset: 0,
      item: null
    };
  }

  componentDidMount() {
    this.setState({ activeIndex: this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.activeIndex ? this.props.navigation.state.params.activeIndex : 0 })
    this.retrieve(false);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    return true
  }

  retrieve = (flag) => {
    let status = this.props.navigation.state.params && this.props.navigation.state.params.title && this.props.navigation.state.params.title.toLowerCase() === 'upcoming' ? 'pending' : 'completed'
    let parameter = {
      condition: [{
        value: this.props.state.user.id,
        column: 'account_id',
        clause: '='
      }, {
        value: status === 'pending' ? 'cancelled' : 'completed',
        column: 'status',
        clause: status === 'pending' ? '!=' : '='
      }, {
        value: status === 'pending' ? 'completed' : '%%',
        column: status === 'pending' ? 'status' : 'details',
        clause: status === 'pending' ? '!=' : 'like'
      }],
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      sort: { created_at: 'asc' }
    }
    this.setState({ isLoading: true })
    console.log(parameter);
    Api.request(Routes.reservationRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data?.length > 0) {
        console.log(response.data[0]);
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset,
        })
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      }
    );
  }

  closeModal = (value) => {
    this.setState({isVisible: false});
  }

  onPageChange(index) {
    this.setState({
      activeIndex: index
    })
  }

  renderData(data) {
    const { isVisible } = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
          let totalHeight = event.nativeEvent.contentSize.height
          if (event.nativeEvent.contentOffset.y <= 0) {
            if (this.state.isLoading == false) {
              // this.retrieve(false)
            }
          }
          if (Math.round(scrollingHeight) >= Math.round(totalHeight)) {
            if (this.state.isLoading === false) {
              this.retrieve(true)
            }
          }
        }}
      >
        <View style={{
          width: '90%',
          marginLeft: '5%',
          marginRight: '5%',
          marginBottom: 150,
          marginTop: 10
        }}>
          {
            this.state.data.length > 0 && this.state.data.map((item, index) => (
              <ImageCardWithUser
                data={{
                  logo: item.merchant?.logo,
                  address: item.merchant?.address,
                  name: item.merchant?.name,
                  date: item.synqt.length > 0 && item.synqt[0]?.date_at_human,
                  superlike: true,
                  distance: item.distance,
                  users: item.members && item.members.length > 0 ? item.members : [],
                  details: true,
                  ratings: item.rating,
                  superlike: item.total_super_likes
                }}
                style={{
                  marginBottom: 10
                }}
                redirectTo={this.props.navigation.state.params && this.props.navigation.state.params.title}
                onClick={() => {
                  if(this.props.navigation.state?.params?.title === 'Upcoming') {
                    this.props.navigation.navigate('eventNameStack', {
                      parameter: {
                        account_id: this.props.state.user?.id,
                        merchant_id: item.merchant?.id,
                        payload: 'synqt',
                        payload_value: item?.synqt[0]?.id,
                        details: true,
                        datetime: item?.synqt[0]?.date,
                        status: 'pending'
                      },
                      buttonTitle: this.props.navigation.state?.params?.title === 'Upcoming' ? "Cancel" : 'Make Reservation',
                      data: item,
                      messenger_group_id: item.members?.[0].messenger_group_id
                    })
                  } else {
                    this.setState({item: item})
                  }
                }}
                navigation={this.props.navigation}
              />
            ))
          }
        </View>
        {this.state.item !== null && <CardModal
          item={this.state.item}
          history={this.props.navigation.state.params && this.props.navigation.state.params.title && this.props.navigation.state.params.title.toLowerCase() === 'history' ? true : false}
          navigation={this.props.navigation}
          visible={this.state.item !== null}
          fromHistory={true}
          onClose={() => {
            this.setState({
              item: null
            })
          }} />}
      </ScrollView>
    )
  }
  render() {
    const { isVisible } = this.state;
    return (
      <View style={[Style.MainContainer, {
        backgroundColor: Color.containerBackground
      }]}>
        {/* <View style={[BasicStyles.paginationHolder, { marginTop: 10 }]}>
          <Pagination
          activeIndex={activeIndex}
          onChange={(index) => this.onPageChange(index)}
          pages={paginationProps}
          />
        </View> */}
        <ScrollView>
          <View style={{
            marginTop: 10
          }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <TouchableOpacity
                // onPress={() => this.redirect('restaurantStack')}
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 70,
                  borderWidth: 1,
                  borderColor: Color.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  elevation: 3,
                  shadowColor: Color.primary,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  marginBottom: 10
                }}>
                <FontAwesomeIcon icon={faUtensils} size={60} color={Color.primary} />
              </TouchableOpacity>
            </View>
            <View style={{
              paddingLeft: 30,
              paddingRight: 30,
              padingTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                fontWeight: 'bold',
                color: Color.primary,
                marginBottom: 10,
                fontSize: BasicStyles.standardTitleFontSize
              }}>{this.props.navigation.state?.params?.title === 'Upcoming' ? "Here's what's coming!" : "Here's your previous activities!"}</Text>
              <Text>{this.props.navigation.state?.params?.title === 'Upcoming' ? "You have upcoming restaurant reservations from your SYNQT! Click the photo and see where to go." : "You have the following completed SYNQT actvities! Click the photo and see where you’ve gone."}</Text>
            </View>
          </View>
          {this.state.data.length > 0 && this.renderData(this.state.data)}
          {/* <PagerProvider activeIndex={activeIndex}>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <Pager panProps={{ enabled: false }}>
            <View style={Style.sliderContainer}>
              {this.state.data.length > 0 && this.renderData(this.state.data)}
            </View>
            <View style={Style.sliderContainer}>
              {this.state.data.length > 0 && this.renderData(this.state.data)}
            </View>

            <View style={Style.sliderContainer}>
              {this.state.data.length > 0 && this.renderData(this.state.data)}
            </View>
          </Pager>
        </PagerProvider> */}
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(History);
