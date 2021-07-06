import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { BasicStyles, Color, Routes } from 'common'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Footer from 'modules/generic/Footer'
import CardList from 'modules/generic/CardList'
import Share from 'components/Share'
import Style from './Style'
import { connect } from 'react-redux';
import { Spinner, Empty } from 'components';
import Api from 'services/api/index.js';
import _ from 'lodash';

class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevActive: 0,
      currActive: 0,
      search: null,
      isShow: false,
      data: [],
      limit: 7,
      offset: 0,
      isLoading: false,
      pending: [],
      suggestions: [],
      connections: [],
      sentRequests: [],
      navs: [
        { name: "Suggestions", flag: true },
        { name: "Connections", flag: false }
      ]
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.retrieveRandomUsers(false);
      this.retrieveConnections(false);
      this.retrieveSuggestions(false);
      this.props.setTempMembers([]);
    })
  }

  refresh = () => {
    this.retrieveSuggestions(false);
    this.retrieveRandomUsers(false);
    // this.retrieveConnections(false);
  }

  removeConnection = (id) => {
    let temp = this.state.connections
    temp?.length > 0 && temp.map((item, index) => {
      if (item.id === id) {
        temp.splice(index, 1);
      }
    })
    this.refresh()
    this.setState({ connections: temp });
  }

  loading = (loading) => {
    this.setState({ isLoading: loading })
  }

  retrieveConnections(flag) {
    const { user } = this.props.state
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }, {
        value: user.id,
        column: 'account',
        clause: '='
      }, {
        clause: "=",
        column: "status",
        value: 'accepted'
      }],
      account_id: user.id,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      limit: this.state.limit
    }
    this.setState({ isLoading: true })
    Api.request(Routes.circleRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          connections: flag == false ? response.data : _.uniqBy([...this.state.connections, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          connections: flag == false ? [] : this.state.connections,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    });
  }

  updateData = (update, el) => {
    if (update === 'confirm') {
      let data = this.state.connections
      data.push(el)
      this.setState({ connections: data })
    } else if (update === 'remove') {
      let account = this.state.suggestions
      account.length > 0 && account.map((item, index) => {
        if (item.account?.id === el.account?.id) {
          item.is_added = false
        }
      })
      this.setState({ suggestions: account });
    }
  }

  retrieveSuggestions(flag) {
    const { user } = this.props.state
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
        value: 'pending'
      }],
      offset: 0,
      account_id: user.id,
      limit: flag === false ? this.state.limit : ''
    }
    this.setState({ isLoading: true })
    Api.request(Routes.circleRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      this.setState({ pending: response.data.length > 0 ? response.data : [] })
    });
  }

  retrieveRandomUsers = (flag) => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      limit: this.state.limit
    }
    this.setState({ isLoading: true })
    Api.request(Routes.otherAccountsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          suggestions: flag == false ? response.data : _.uniqBy([...this.state.suggestions, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          suggestions: flag == false ? [] : this.state.suggestions,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    });
  }

  async changeTab(idx) {
    const { navs } = this.state;
    if (this.state.prevActive != idx) {
      await this.setState({ currActive: idx })
      navs[this.state.prevActive].flag = false
      navs[idx].flag = true
      await this.setState({ prevActive: idx })
    }
    if (idx === 0) {
      // this.retrieveRandomUsers(false);
      // this.retrieveSuggestions(false);
      // this.retrieveConnections(false);
    }
    // this.setState({connections: []})
    // this.retrieve(false)
  }

  render() {
    const { navs } = this.state;
    return (
      <View style={{
        flex: 1,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView
        style={{
          marginBottom: 50
        }}
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
                this.retrieveRandomUsers(true)
              }
            }
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: this.state.pending.length > 0 ? 0.3 : 0, paddingBottom: this.state.pending.length === 0 ? 0 : 20, borderColor: Color.gray, marginTop: '7%' }}>
            {
              navs.map((el, idx) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.changeTab(idx)}
                    style={{
                      ...Style.standardButton,
                      backgroundColor: el.flag == true ? Color.primary : '#BDBDBD',
                      marginLeft: 5
                    }}
                  >
                    <Text style={{ color: 'white' }}>{el.name}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
          {
            this.state.currActive == 0 ? (
              <View>
                <CardList delete={(id) => { this.removeConnection(id) }} loading={this.loading} update={(update, el) => { this.updateData(update, el) }} level={2} retrieve={() => { this.refresh() }} status={'pending'} navigation={this.props.navigation} data={this.state.pending.length > 0 && this.state.pending} hasAction={true} actionType={'text'}></CardList>
                {this.state.pending.length === this.state.limit &&
                  <TouchableOpacity onPress={() => { this.retrieveSuggestions(true) }}>
                    <Text style={{ color: 'gray', paddingTop: 5, paddingLeft: 15 }}>See All</Text>
                  </TouchableOpacity>
                }
                <View style={{ paddingLeft: 30, borderBottomWidth: this.state.pending.length > 0 ? 0.3 : 0, padding: this.state.pending.length === 0 ? 10 : 20, borderColor: Color.gray }}>
                  <Text style={{ fontWeight: 'bold' }}>Connections you may know</Text>
                </View>

                <View>
                  <CardList delete={(id) => { this.removeConnection(id) }} loading={this.loading} level={2} invite={false} retrieve={() => { this.refresh() }} navigation={this.props.navigation} data={this.state.suggestions.length > 0 && this.state.suggestions} hasAction={false} actionType={'button'} actionContent={'text'}></CardList>
                  {this.state.suggestions.length == 0 && (<Empty refresh={true} onRefresh={() => this.refresh()} />)}
                </View>

              </View>
            ) : (
              <View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '5%' }}>
                  <View style={Style.TextContainer}>
                    <TextInput
                      style={BasicStyles.formControl}
                      onChangeText={(search) => this.setState({ search: search })}
                      value={this.state.search}
                      placeholder={'Search'}
                    />
                  </View>
                  <View>
                    <CardList delete={(id) => { this.removeConnection(id) }} update={(update, el) => { this.updateData(update, el) }} loading={this.loading} level={2} search={this.state.search} retrieve={() => { this.refresh() }} navigation={this.props.navigation} data={this.state.connections.length > 0 && this.state.connections} hasAction={false} actionType={'button'} actionContent={'icon'} ></CardList>
                  </View>
                </View>
                {this.state.connections.length == 0 && (<Empty refresh={true} onRefresh={() => this.retrieveConnections(false)} />)}
              </View>
            )
          }
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        <Footer layer={1} {...this.props} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    viewMenu: (isViewing) => dispatch(actions.viewMenu(isViewing)),
    setTempMembers: (tempMembers) => dispatch(actions.setTempMembers(tempMembers))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(Connections);
