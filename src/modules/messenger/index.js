import React, { Component } from 'react';
import Style from './Style.js';
import { View, TouchableHighlight, Text, ScrollView, FlatList, Platform, Image } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, UserImage } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import CommonRequest from 'services/CommonRequest.js';
import { Dimensions } from 'react-native';
import Group from 'modules/generic/PeopleList.js'
import Footer from 'modules/generic/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      connections: [],
      limit: 10,
      offset: 0,
      retrievingMembers: false,
      isReserved: false
    }
  }

  componentDidMount() {
    this.props.setAllMessages([]);
    const { user } = this.props.state;
    if (user != null) {
      this.retrieve(false);
    }
  }

  retrieveConnections() {
    const { user } = this.props.state
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }, {
        value: user.id,
        column: 'account',
        clause: 'or'
      }, {
        clause: "=",
        column: "status",
        value: "accepted"
      }],
      offset: 0,
      account_id: user.id
    }
    this.setState({retrievingMembers: true});
    Api.request(Routes.circleRetrieve, parameter, response => {
      this.setState({retrievingMembers: false});
      if (response.data.length > 0) {
        this.setState({ connections: response.data })
      }
    });
  }

  retrieve = (flag) => {
    this.retrieveConnections();
    const { user } = this.props.state;
    if (user == null) {
      return
    }
    let parameter = {
      code: null,
      account_id: user.id,
      limit: this.state.limit,
      offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset
    }
    this.setState({ isLoading: true });
    Api.request(Routes.messengerGroupRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      const { setMessenger, setAllMessages } = this.props;
      const { messenger } = this.props.state;
      if (response.data.length !== 0) {
        this.setState({
          offset: flag === false ? 1 : (this.state.offset + 1)
        })
        setAllMessages(flag === false ? response.data : _.uniqBy([...this.props.state.allMessages, ...response.data], 'id'))
        var counter = 0
        for (var i = 0; i < response.data.length; i++) {
          let item = response.data[i]
          counter += parseInt(item.total_unread_messages)
        }
        setMessenger(counter, messenger.messages)
      }
    })
  }

  updateLastMessageStatus = (item) => {
    if (parseInt(item.total_unread_messages) > 0) {
      let parameter = {
        messenger_group_id: item.id
      }
      CommonRequest.updateMessageStatus(parameter, response => {
        this.props.state.allMessages.length > 0 && this.props.state.allMessages.map((dataItem) => {
          if (item.id === dataItem.id) {
            const { messenger } = this.props.state;
            const { setMessenger } = this.props;
            let unread = messenger.unread - parseInt(item.total_unread_messages)
            setMessenger(unread, messenger.messages)
            item.total_unread_messages = 0;
            return item;
          }
          return dataItem;
        })
      })
    }
  }

  alreadyReserved = (item) => {
    let parameter = {
      condition: [{
        value: 'cancelled',
        column: 'status',
        clause: '!='
      }, {
        value: item.payload,
        column: 'payload_value',
        clause: '='
      }, {
        value: 'synqt',
        column: 'payload',
        clause: '='
      }],
      limit: 1,
      offset: 0,
      sort: { created_at: 'asc' }
    }
    this.setState({ isLoading: true })
    Api.request(Routes.reservationWeb, parameter, response => {
      this.setState({
        isReserved: response.data?.length > 0 ? true : false,
        isLoading: false
      })
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      }
    );
  }

  viewMessages = async (item) => {
    await this.alreadyReserved(item);
    this.setState({ isLoading: true });
    const parameter = {
      condition: [{
        value: item.payload,
        column: 'id',
        clause: '='
      }]
    }
    Api.request(Routes.synqtRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        const { setMessengerGroup, setCurrentTitle } = this.props;
        setCurrentTitle(item.title);
        this.updateLastMessageStatus(item)
        setMessengerGroup(item);
        setTimeout(() => {
          this.props.navigation.navigate('messagesStack', {
            isReserved: this.state.isReserved,
            data: item,
            status: response.data[0].status
          });
        }, 500)
      }
    })
  }

  _card = (item) => {
    const { user, theme } = this.props.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <TouchableHighlight
          onPress={() => { this.viewMessages(item) }}
          underlayColor={Color.lightGray}
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: Color.containerBackground
          }}
        >
          <View>
            <View style={{
              position: 'absolute',
              height: '100%',
              width: '15%',
              left: 20
            }}>
              {
                item?.members && item.members.length > 0 ? (
                  <View>
                    {item.members.length > 1 && item.members[1]?.profile?.url ? <Image
                      source={{ uri: Config.BACKEND_URL + item.members[1]?.profile?.url }}
                      style={[BasicStyles.profileImageSize, {
                        height: 30,
                        width: 30,
                        borderRadius: 100,
                        marginBottom: -10,
                        marginLeft: 13
                      }]} /> :
                      <View style={{
                        height: 35,
                        width: 35,
                        marginBottom: -10,
                        borderRadius: 50,
                        borderColor: theme ? theme.primary : Color.primary,
                        borderWidth: 1,
                        marginLeft: 13,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}><FontAwesomeIcon
                          icon={faUser}
                          size={20}
                          color={Color.primary}
                        /></View>
                    }
                    {item.members.length > 0 && item.members[0]?.profile?.url ? <View style={{
                      height: 35,
                      width: 35,
                      borderRadius: 100,
                      marginBottom: 10,
                      backgroundColor: Color.containerBackground,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={item.members.length > 0 && item.members[0]?.profile?.url ? { uri: Config.BACKEND_URL + item.members[0]?.profile?.url } : user?.account_profile?.url ? { uri: Config.BACKEND_URL + user.account_profile.url } : require('assets/logo_white.png')}
                        style={[BasicStyles.profileImageSize, {
                          height: 30,
                          width: 30,
                          borderRadius: 100
                        }]} />
                    </View> :
                      <View style={{
                        height: 35,
                        width: 35,
                        borderRadius: 100,
                        marginBottom: 10,
                        backgroundColor: Color.containerBackground,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: theme ? theme.primary : Color.primary,
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}><FontAwesomeIcon
                          icon={faUser}
                          size={20}
                          color={Color.primary}
                        /></View>
                    }
                  </View>
                ) :
                  <View style={{
                    borderColor: Color.primary,
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    borderColor: Color.primary,
                    borderWidth: 3,
                    overflow: "hidden",
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 8
                  }}><FontAwesomeIcon
                      icon={faUser}
                      size={40}
                      color={Color.primary}
                    /></View>
              }
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, paddingLeft: '5%', paddingRight: 10 }}>
              <View style={{
                paddingLeft: '23%',
                width: '100%',
                flexDirection: 'row'
              }}>
                <Text style={{
                  lineHeight: 30,
                  fontWeight: 'bold'
                }}>{item.title}</Text>
                {
                  parseInt(item.total_unread_messages) > 0 && Platform.OS == 'android' && (
                    <Text style={{
                      color: Color.white,
                      lineHeight: 20,
                      paddingLeft: 5,
                      paddingRight: 5,
                      backgroundColor: Color.danger,
                      borderRadius: 5,
                      marginTop: 5,
                      marginBottom: 5,
                      marginLeft: 10
                    }}>{item.total_unread_messages}</Text>
                  )
                }
                {
                  parseInt(item.total_unread_messages) > 0 && Platform.OS == 'ios' && (
                    <View style={{
                      backgroundColor: Color.danger,
                      borderRadius: 5,
                      marginTop: 5,
                      marginBottom: 5,
                      marginLeft: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        lineHeight: 20,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}>{item.total_unread_messages}</Text>
                    </View>
                  )
                }
              </View>
            </View>
            <Text style={{
              lineHeight: 30,
              paddingLeft: '25%',
              width: '94%',
              fontStyle: 'italic'
            }}
              numberOfLines={1}>{item.last_messages ? item.last_messages?.title + ': ' + (item.last_messages?.description || 'Sent a photo.') : 'No message yet.'}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  FlatListItemSeparator = () => {
    return (
      <View style={Style.Separator} />
    );
  };

  _flatList = () => {
    const { selected } = this.state;
    const { user } = this.props.state;
    return (
      <View style={{
        width: '100%',
        backgroundColor: Color.containerBackground
      }}>
        {
          this.props.state.allMessages.length > 0 && user != null && (
            <FlatList
              data={this.props.state.allMessages}
              extraData={selected}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              style={{
                marginBottom: 10,
                backgroundColor: Color.containerBackground
              }}
              renderItem={({ item, index }) => (
                <View>
                  {this._card(item)}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )
        }
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{
        flex: 1,
        backgroundColor: Color.containerBackground
      }}>

        { this.state.retrievingMembers === false && <View style={{
          borderBottomColor: Color.primary,
          borderBottomWidth: 1,
          padding: 10,
        }}>
          {this.state.connections.length > 0 ? (<Group inviteToSynqt={true} add={false} style={{
            borderColor: Color.primary,
            borderWidth: 2
          }} navigation={this.props.navigation} size={50} data={this.state.connections} />
          ) :
            <Text style={{
              padding: 10,
              color: Color.gray
            }}>
              No connections.
            </Text>
          }
        </View>}
        <ScrollView
          style={{
            backgroundColor: Color.containerBackground,
            marginBottom: 50
          }}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (isLoading == false) {
                // this.retrieve(false)
              }
            }
            if (Math.round(scrollingHeight) >= Math.round(totalHeight)) {
              if (isLoading == false) {
                this.retrieve(true)
              }
            }
          }}
          showsVerticalScrollIndicator={false}
        >
          <View stle={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: Color.containerBackground
          }}>
            {this._flatList()}
          </View>
          {this.props.state.allMessages.length === 0 && (<Empty refresh={true} onRefresh={() => this.retrieve(false)} />)}
        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <Footer layer={1} {...this.props} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup)),
    setMessenger: (unread, messages) => dispatch(actions.setMessenger(unread, messages)),
    setCurrentTitle: (currentTitle) => dispatch(actions.setCurrentTitle(currentTitle)),
    setAllMessages: (allMessages) => dispatch(actions.setAllMessages(allMessages)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);
