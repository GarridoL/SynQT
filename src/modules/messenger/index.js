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

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      data: [],
      connections: []
    }
  }

  componentDidMount() {
    const { user } = this.props.state;
    if (user != null) {
      this.retrieve();
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
      offset: 0
    }
    console.log(user.id);
    Api.request(Routes.circleRetrieve, parameter, response => {
      if (response.data.length > 0) {
        this.setState({ connections: response.data })
      }
    });
  }

  retrieve = () => {
    this.retrieveConnections();
    const { user } = this.props.state;
    if (user == null) {
      return
    }
    this.setState({ isLoading: true });
    CommonRequest.retrieveMessengerGroups(user, response => {
      this.setState({ isLoading: false, data: response.data });
      const { setMessenger } = this.props;
      const { messenger } = this.props.state;
      if (response.data.length !== 0) {
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
        this.state.data.map((dataItem) => {
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

  viewMessages = (item) => {
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
            data: item,
            status: response.data[0].status
          });
        }, 500)
      }
    })
  }

  _card = (item) => {
    const { user } = this.props.state;
    return (
      <View>
        <TouchableHighlight
          onPress={() => { this.viewMessages(item) }}
          underlayColor={Color.lightGray}
          style={{
            paddingTop: 10,
            paddingBottom: 10
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
                user.account_profile && user.account_profile.url ? (
                  <Image
                    source={user && user.account_profile && user.account_profile.url ? { uri: Config.BACKEND_URL + user.account_profile.url } : require('assets/logo.png')}
                    style={[BasicStyles.profileImageSize, {
                      height: 50,
                      width: 50,
                      borderRadius: 100
                    }]} />
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
              width: '100%',
              fontStyle: 'italic'
            }}>Message: Last message here</Text>
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
    const { data, selected } = this.state;
    const { user } = this.props.state;
    return (
      <View style={{
        width: '100%'
      }}>
        {
          data.length > 0 && user != null && (
            <FlatList
              data={data}
              extraData={selected}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              style={{
                marginBottom: 50
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
    const { isLoading, data } = this.state;
    return (
      <View style={{
        flex: 1
      }}>
        { this.state.connections.length > 0 && (
          <View style={{
            borderBottomColor: Color.primary,
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}>
            <Group add={false} style={{
              borderColor: Color.primary,
              borderWidth: 2
            }} navigation={this.props.navigation} size={50} data={this.state.connections} />
          </View>
        )}
        <ScrollView
          style={{ marginBottom: 50 }}
          onScroll={(event) => {
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (this.state.isLoading == false) {
                this.retrieve()
              }
            }
          }}
          showsVerticalScrollIndicator={false}
        >
          <View stle={{
            flexDirection: 'row',
            width: '100%'
          }}>
            {this._flatList()}
          </View>
          {data.length === 0 && (<Empty refresh={true} onRefresh={() => this.retrieve()} />)}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);
