import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Dimensions, Alert } from 'react-native';
import { ListItem } from 'react-native-elements'
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faEdit, faUserCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import Style from './Style';
import CustomizedButton from 'modules/generic/CustomizedButton';
import ImageCardWithUser from 'modules/generic/ImageCardWithUser';
import Tab from 'modules/generic/TabOptions';
import CardModal from 'modules/modal/Swipe.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import _ from 'lodash';
import Api from 'services/api/index.js';
import { Spinner, Empty } from 'components';
const height = Math.round(Dimensions.get('window').height);
class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      phoneNumber: null,
      email: null,
      choice: 'SYNQT ACTIVITIES',
      connections: [],
      isVisible: false,
      data: [],
      limit: 5,
      offset: 0,
      isLoading: false,
      ids: [],
      fromConnections: [],
      account: null,
      similarConnections: 0
    }
  }

  componentDidMount() {
    this.setState({ similarConnections: 0 })
    this.props.setDeepLinkRoute(null);
    if (this.props.navigation.state?.params?.level === 1) {
      this.retrieveActivity(false);
    } else {
      this.retrieveConnections(false);
    }
    this.setState({ choice: this.props.navigation.state?.params?.level === 1 ? 'SYNQT ACTIVITIES' : 'CONNECTIONS' });
    this.retrieveSimilarConnections();
  }

  retrieveSimilarConnections = () => {
    let parameter = {
      user_id: this.props.state.user.id,
      account_id: this.props.navigation.state?.params?.user?.account?.id
    }
    Api.request(Routes.similarConnectionRetrieve, parameter, response => {
      this.setState({ isLoading: false, similarConnections: response.data })
    });
  }

  retrieveActivity = (flag) => {
    let parameter = {
      condition: [{
        value: this.props.navigation.state?.params?.user?.account?.id,
        column: 'account_id',
        clause: '='
      }, {
        value: this.props.navigation.state?.params?.synqt_id,
        column: 'synqt_id',
        clause: '='
      }],
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset
    }
    this.setState({ isLoading: true })
    Api.request(Routes.topChoiceRetrieveActivities, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data?.length > 0) {
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
    }, error => {
      this.setState({ isLoading: false })
      console.log('error', error)
    });
  }

  deleteConnection = (el) => {
    let del = null
    this.state.fromConnections.length > 0 && this.state.fromConnections.map((item, index) => {
      if (item.account?.id === el.account?.id) {
        this.state.fromConnections.splice(index, 1);
        del = item
      }
    })
    this.state.ids.length > 0 && this.state.ids.map((item, index) => {
      if (item === el.account?.id) {
        this.state.ids.splice(index, 1);
      }
    })
    let parameter = {
      id: del.id
    }
    this.setState({ isLoading: true })
    Api.request(Routes.circleDelete, parameter, response => {
      this.setState({ isLoading: false })
      this.retrieveConnections(false);
    }, error => {
      this.setState({ isLoading: false })
      this.retrieveConnections(false);
      console.log('error', error)
    });
  }

  retrieveConnections(flag) {
    const { user } = this.props.state
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: this.props.navigation.state?.params?.user?.account?.id,
        column: 'account_id',
        clause: '='
      }, {
        value: this.props.navigation.state?.params?.user?.account?.id,
        column: 'account',
        clause: 'or'
      }, {
        clause: "=",
        column: "status",
        value: 'accepted'
      }],
      account_id: user.id,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
    }
    console.log(parameter, Routes.circleRetrieve, '--');
    this.setState({ isLoading: true })
    Api.request(Routes.circleRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data?.length > 0) {
        const { user } = this.props.state
        let par = {
          condition: [{
            value: user.id,
            column: 'account_id',
            clause: '='
          }, {
            value: user.id,
            column: 'account',
            clause: '='
          }, {
            clause: "like",
            column: "status",
            value: '%%'
          }],
          offset: this.state.offset,
          account_id: user.id
        }
        this.setState({ isLoading: true })
        Api.request(Routes.circleRetrieve, par, res => {
          this.setState({ isLoading: false })
          if (res.data.length > 0) {
            let ids = []
            response.data.forEach(item => {
              item['shouldBeCancel'] = false;
              res.data.forEach(el => {
                ids.push(el.account.id)
                if (el.account.id == item.account.id && el.status === 'pending') {
                  item.shouldBeCancel = true;
                }
              });
            })
            this.setState({ ids: ids, fromConnections: res.data });
          }
          this.setState({
            connections: flag == false ? response.data : _.uniqBy([...this.state.connections, ...response.data], 'id'),
            offset: flag == false ? 1 : (this.state.offset + 1)
          })
        });
      } else {
        this.setState({
          connections: flag == false ? [] : this.state.connections,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    }, error => {
      this.setState({ isLoading: false })
      console.log('error', error)
    });
  }

  choiceHandler = (value) => {
    this.setState({ choice: value })
    if (value === 0) {
      this.retrieveActivity(false);
    } else {
      this.retrieveConnections(false);
    }
  }

  sendRequest = (el) => {
    let parameter = {
      account_id: this.props.state.user.id,
      to_email: el.account?.email,
      content: "This is an invitation for you to join my connections."
    }
    this.setState({ isLoading: true })
    Api.request(Routes.circleCreate, parameter, response => {
      this.setState({ isLoading: false })
      this.retrieveConnections(false);
      if (response.error !== null) {
        Alert.alert('Error', response.error);
      }
    }, error => {
      this.setState({ isLoading: false })
      this.retrieveConnections(false);
      console.log('error', error)
    });
  }

  fullNameHandler = (value) => {
    this.setState({ fullName: value })
  }

  phoneNumberHandler = (value) => {
    this.setState({ phoneNumber: value })
  }

  emailHandler = (value) => {
    this.setState({ email: value })
  }

  renderConnections() {
    const { theme } = this.props.state;
    return (
      <View>
        {this.state.connections.length === 0 && (<Empty refresh={true} onRefresh={() => this.retrieveConnections(false)} />)}
        {
          this.state.connections.length > 0 && this.state.connections.map((el, idx) => {
            return (
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('viewProfileStack', { user: el, level: 1 }) }}>
                {/* <Card containerStyle={{padding:-5, borderRadius: 20}}> */}
                <ListItem containerStyle={{
                  backgroundColor: Color.containerBackground
                }} key={idx}>
                  {el.account?.profile?.url ? <Image
                    style={[Style.circleImage, { borderColor: theme ? theme.primary : Color.primary }]}
                    source={{ uri: Config.BACKEND_URL + el.account?.profile?.url }}
                  /> :
                    <View style={{
                      borderColor: theme ? theme.primary : Color.primary,
                      width: 75,
                      height: 75,
                      borderRadius: 50,
                      borderColor: theme ? theme.primary : Color.primary,
                      borderWidth: 3,
                      overflow: "hidden",
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: 8
                    }}><FontAwesomeIcon
                        icon={faUser}
                        size={53}
                        color={theme ? theme.primary : Color.primary}
                      /></View>}
                  <View>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                      <View style={{ width: '65%' }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', width: '110%' }} numberOfLines={1}>{el?.account?.information?.first_name ? el?.account?.information?.first_name + ' ' + el?.account?.information?.last_name : el?.account?.username}</Text>
                        <Text style={{ fontFamily: 'Poppins-Italic' }} numberOfLines={1}>{el?.account?.information?.address || 'No address provided'}</Text>
                        {el.account?.id !== this.props.state.user.id && <Text style={{ color: 'gray', fontSize: 10 }} numberOfLines={1}>{el.similar_connections} similar connection(s)</Text>}
                      </View>
                      {this.state.ids.length > 0 && this.state.ids.includes(el.account?.id) === false && el.account.id !== this.props.state.user.id ?
                        <TouchableOpacity
                          onPress={() => this.sendRequest(el)}
                          style={{
                            ...Style.actionBtn,
                            backgroundColor: theme ? theme.primary : Color.primary
                          }}
                        >
                          <Text style={{ color: 'white' }}>Add</Text>
                        </TouchableOpacity>
                        : (el.account.id !== this.props.state.user.id && el.shouldBeCancel === true) &&
                        <TouchableOpacity
                          onPress={() => this.deleteConnection(el)}
                          style={{
                            ...Style.actionBtn,
                            backgroundColor: 'gray'
                          }}
                        >
                          <Text style={{ color: 'white' }}>Cancel</Text>
                        </TouchableOpacity>
                      }
                    </View>
                  </View>
                </ListItem>
                {/* </Card> */}
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }


  renderSimlActivity() {
    const height = Math.round(Dimensions.get('window').height);
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
        {this.state.data.length === 0 && (<Empty refresh={true} onRefresh={() => this.retrieveActivity(false)} />)}
        <View style={{
          marginTop: 15,
          flex: 1,
          padding: 10
        }}>
          {
            this.state.data.length > 0 && this.state.data.map((item, index) => (
              <ImageCardWithUser
                data={{
                  logo: item.merchant.logo,
                  address: item.merchant.address || 'No address provided',
                  name: item.merchant.name,
                  date: item.synqt[0].date,
                  superlike: item.total_super_likes || 0,
                  distance: item.distance || '0km',
                  users: item.members && item.members.length > 0 ? item.members : [],
                  details: true,
                  ratings: item.rating
                }}
                style={{
                  marginBottom: 20
                }}
                redirectTo={this.props.navigation.state.params && this.props.navigation.state.params.title}
                onClick={() => {
                  // this.onClick(item)
                }}
                navigation={this.props.navigation}
              />
            ))
          }
        </View>
      </ScrollView>
    )
  }

  render() {
    let user = this.props.navigation.state?.params?.user
    const { theme } = this.props.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground,
        height: '100%'
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View style={Style.TopView}>
              <TouchableOpacity>
                {user.account?.profile?.url ? <Image
                  style={[Style.circleImage, {
                    height: 180,
                    width: 180,
                    borderRadius: 100,
                    borderColor: theme ? theme.primary : Color.primary,
                    borderWidth: 2
                  }]}
                  // resizeMode="cover"
                  source={{ uri: Config.BACKEND_URL + user.account?.profile?.url }}
                />
                  :
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    size={182}
                    style={{
                      color: theme ? theme.primary : Color.primary,
                      height: 180,
                      width: 180,
                      borderRadius: 100,
                      borderColor: theme ? theme.primary : Color.primary,
                      borderWidth: 2
                    }}
                  />
                }
              </TouchableOpacity>
            </View>
            <View style={Style.BottomView}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={20}
                style={{ marginRight: 5 }}
                color={theme ? theme.primary : Color.primary} />
              <Text style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18
              }}>{user?.account?.information?.first_name ? user?.account?.information?.first_name + user?.account?.information?.last_name : user.name ? user.name : user?.account?.username}</Text>
            </View>
            {user?.account?.id?.toString() !== this.props.state.user?.id?.toString() && <View style={{
              width: '100%'
            }}>
              <Text style={{
                textAlign: 'center',
                color: Color.gray
              }}>{this.state.similarConnections} similar connection(s)</Text>
            </View>}

          </View>
          <View style={{
            marginTop: 25,
            textAlign: 'center',
            justifyContent: 'center'
          }}>
            {this.props.navigation.state?.params?.level === 1 ? <Tab level={1} choice={['SYNQT ACTIVITIES', 'CONNECTIONS']} onClick={this.choiceHandler}></Tab> :
              <Tab level={2} choice={['CONNECTIONS']} onClick={this.choiceHandler}></Tab>}
          </View>
          <View style={{
            marginBottom: 100,
          }}>
            {this.state.choice === 'SYNQT ACTIVITIES' ? (
              this.renderSimlActivity()
            ) :
              this.renderConnections()}
          </View>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          {this.state.isVisible && <CardModal
            visisble={this.state.isVisible}
            onClose={() => {
              this.setState({
                isVisible: false
              })
            }} />}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setCurrentAccount: (acc) => dispatch(actions.setCurrentAccount(acc)),
    setDeepLinkRoute: (deepLinkRoute) => dispatch(actions.setDeepLinkRoute(deepLinkRoute))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(ViewProfile);