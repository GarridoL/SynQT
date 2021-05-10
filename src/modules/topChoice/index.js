import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import Pagination from 'components/Pagination/Icons';
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faUtensils, faChevronLeft, faTicketAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import ImageCardWithUser from 'modules/generic/ImageCardWithUser';
import CardModal from 'modules/modal/Swipe.js';
import Api from 'services/api';
import { Spinner, Empty } from 'components';
import _ from 'lodash';

const height = Math.round(Dimensions.get('window').height);
class TopChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      data: [],
      isLoading: false,
      isVisible: false,
      item: null,
      limit: 5,
      offset: 0
    };
  }

  onPageChange(index) {
    this.setState({
      activeIndex: index
    })
  }

  componentDidMount() {
    this.retrieve(false)
  }

  retrieve = (flag) => {
    let parameter = {
      condition: [{
        value: this.props.navigation.state?.params?.synqt_id,
        column: 'synqt_id',
        clause: '='
      }],
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset
    }
    this.setState({ isLoading: true })
    Api.request(Routes.topChoiceRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
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
    });
  }

  closeModal = (value) => {
    if (value === null) {
      this.setState({ isVisible: false })
    } else {
      let parameter = {
        id: value
      }
      this.setState({ isLoading: true })
      Api.request(Routes.topChoiceDelete, parameter, response => {
        this.setState({ isLoading: false })
        if (response.data !== null) {
          this.setState({ isVisible: false })
          this.retrieve(false)
        }
      });
    }
  }

  renderData() {
    return (
      <SafeAreaView>
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
            marginTop: 20,
            width: '90%',
            marginLeft: '5%',
            marginRight: '5%'
          }}>
            {
              this.state.data.length > 0 && this.state.data.map((item, index) => (
                <ImageCardWithUser
                  data={{
                    logo: item.merchant.logo,
                    address: item.merchant.address || 'No address provided',
                    name: item.merchant.name,
                    date: item.synqt[0].date_at_human,
                    superlike: true,
                    users: item.members && item.members.length > 0 ? item.members : [],
                    details: true
                  }}
                  style={{
                    marginBottom: 20
                  }}
                  onClick={() => {
                    this.setState({
                      isVisible: true,
                      item: item
                    })
                  }}
                  navigation={this.props.navigation}
                />
              ))
            }
          </View>
        </ScrollView>
        {this.state.data.length === 0 && (<Empty refresh={true} onRefresh={() => this.retrieve(false)} />)}
      </SafeAreaView>
    )
  }
  render() {
    const { activeIndex, label, isLoading, isVisible } = this.state;
    const paginationProps = [
      {
        icon: faUtensils
      },
      {
        icon: faTicketAlt
      },
      {
        icon: faShoppingBag
      }
    ]
    return (
      <View style={[Style.MainContainer, {
        backgroundColor: Color.containerBackground
      }]}>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        {this.state.data && this.renderData()}
        <CardModal
          messengerGroup={this.props.navigation.state?.params?.messenger_group_id}
          history={true}
          item={this.state.item && this.state.item}
          navigation={this.props.navigation}
          visible={isVisible}
          onClose={(value) => {
            this.closeModal(value)
          }} />
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
)(TopChoice);
