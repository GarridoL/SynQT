import React, { Component } from 'react';
import Style from './Style.js';
import { BottomSheet } from 'react-native-elements';
import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Footer from 'modules/generic/Footer'
import PostCard from 'modules/generic/PostCard';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import { constant } from 'lodash';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
const height = Math.round(Dimensions.get('window').height);

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: null,
      isVisible: false,
      status: null,
      reply: null,
      offset: 0,
      limit: 5,
      loading: false
    }
  }

  componentDidMount() {
    this.retrieve(false);
  }

  searchHandler = (value) => {
    this.setState({ search: value })
  }

  statusHandler = (value) => {
    this.setState({ status: value })
  }

  replyHandler = (value) => {
    this.setState({ reply: value })
  }

  loader = (value) => {
    this.setState({ isLoading: value })
  }

  retrieve = (flag) => {
    const { setComments } = this.props;
    let parameter = {
      limit: this.state.limit,
      offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      sort: {
        created_at: "desc"
      }
    }
    this.setState({ isLoading: true });
    Api.request(Routes.commentsRetrieve, parameter, response => {
      console.log(response.data[0].comment_replies);
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        this.setState({ offset: flag === false ? 1 : (this.state.offset + 1) })
        response.data.map((item, index) => {
          item.members?.length > 0 && item.members.map((i, inde) => {
            item['joined'] = i.account_id?.toString() === this.props.state.user.id?.toString() && i.joined === 'true' ? 'true' : 'false'
            item['liked'] = i.account_id?.toString() === this.props.state.user.id?.toString() && i.liked === 'true' ? 'true' : 'false'
            if (i.joined !== 'true') {
              item.members.splice(inde, 1);
            }
          })
        })
        setComments(flag === false ? response.data : _.uniqBy([...this.props.state.comments, ...response.data], 'id'));
      } else {
        this.setState({ offset: flag == false ? 0 : this.state.offset, })
        setComments(flag == false ? [] : this.props.state.comments);
      }
    })
  }

  onChangeDataHandler = (item) => {
    const { comments } = this.props.state;
    if (comments == null) {
      return
    }
    let temp = comments.map((iItem, iIndex) => {
      if (iItem.id == item.id) {
        return item
      }
      return iItem
    })
    this.props.setComments(temp);
  }

  join = (data) => {
    this.setState({ loading: true })
    if (this.state.loading === true) {
      return
    }
    let parameter = {
      account_id: this.props.state.user.id,
      comment_id: data.id,
      liked: data.liked || 'false',
      joined: data.joined === 'true' ? 'false' : 'true'
    }
    Api.request(Routes.commentMembersCreate, parameter, response => {
      this.setState({ loading: false })
      let temp = this.props.state.comments
      temp[data.index].joined = data.joined === 'true' ? 'false' : 'true';
      let myAccount = {
        account: {
          profile: {
            url: this.props.state.user.account_profile.url
          },
          id: this.props.state.user.id
        },
        joined: data.liked || false,
        joined: data.joined === 'true' ? 'false' : 'true'
      }
      if (temp[data.index].joined === 'true') {
        temp[data.index].members.push(myAccount);
      } else {
        temp[data.index]?.members?.splice(data.index, 1);
      }
      this.props.setComments(temp);
    })
  }


  like = (data) => {
    let parameter = {
      account_id: this.props.state.user.id,
      comment_id: data.id,
      liked: data.liked === 'false' ? 'true' : 'false',
      joined: data.joined || 'false'
    }
    console.log(parameter);
    Api.request(Routes.commentMembersCreate, parameter, response => {
      let temp = this.props.state.comments
      temp[data.index].liked = data.liked === 'true' ? 'false' : 'true';
      this.props.setComments(temp);
    })
  }

  post = () => {
    let parameter = {
      account_id: this.props.state.user.id,
      payload: "status",
      payload_value: "1",
      text: this.state.status
    }
    let data = {
      account: {
        email: this.props.state.user.email,
        id: this.props.state.user.id,
        profile: {
          account_id: this.props.state.user.id,
          url: this.props.state.user.account_profile?.url || null
        },
        username: this.props.state.user.username
      },
      account_id: this.props.state.user.id,
      comment_replies: [],
      members: [],
      text: this.state.status,
      created_at_human: moment(new Date()).format('MMMM DD, YYYY hh:mm a')
    }
    this.setState({ isLoading: true });
    Api.request(Routes.commentsCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.props.setComments([data, ...this.props.state.comments])
        this.props.setCreateStatus(false)
        this.setState({ status: null })
      }
    })
  }

  reply = (comment) => {
    const tempArray = this.props.state.comments;
    let temp = null;
    tempArray.length > 0 && tempArray.map((item, index) => {
      if (item.id === comment.id) {
        temp = item;
      }
    })
    let parameter = {
      account_id: this.props.state.user.id,
      comment_id: comment.id,
      text: this.state.reply
    }
    this.setState({ isLoading: true });
    Api.request(Routes.commentRepliesCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.setState({
          isVisible: false,
          reply: null
        })
        let data = {
          account: {
            email: this.props.state.user.email,
            id: this.props.state.user.id,
            profile: {
              account_id: this.props.state.user.id,
              url: this.props.state.user.account_profile?.url || null
            },
            username: this.props.state.user.username
          },
          account_id: this.props.state.user.id,
          comment_id: comment.id,
          id: response.data,
          text: parameter.text,
          created_at_human: moment(new Date()).format('MMMM DD, YYYY hh:mm a')
        }
        if (temp.comment_replies === null) {
          temp.comment_replies = []
        }
        temp.comment_replies.push(data)
        this.props.setComments(tempArray);
      }
    })
  }

  render() {
    const { isLoading } = this.state;
    const { comments, theme } = this.props.state;
    return (
      <SafeAreaView>
        <ScrollView style={{
          backgroundColor: Color.containerBackground,
          padding: 5,
          height: '100%'
        }}
          showsVerticalScrollIndicator={false}
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
        >
          <View style={{
            marginTop: 10,
            marginBottom: 350
          }}>
            {
              comments && comments.length > 0 && comments.map((item, index) => (
                <View>
                  {(this.props.state.statusSearch === null || this.props.state.statusSearch === '') ?
                    <PostCard
                      navigation={this.props.navigation}
                      loader={this.loader}
                      data={{
                        user: item.account,
                        comments: item.comment_replies,
                        message: item.text,
                        date: item.created_at_human,
                        id: item.id,
                        liked: item.liked,
                        joined: item.joined,
                        members: item.members,
                        index: index
                      }}
                      postReply={() => { this.reply(item) }}
                      reply={(value) => this.replyHandler(value)}
                      onLike={(params) => this.like(params)}
                      onJoin={(params) => this.join(params)}
                    />
                    : <View>
                      {item.account && item.account.username && item.account.username.toLowerCase().includes(this.props.state.statusSearch && this.props.state.statusSearch.toLowerCase()) === true && (
                        <PostCard
                          navigation={this.props.navigation}
                          loader={this.loader}
                          data={{
                            user: item.account,
                            comments: item.comment_replies,
                            message: item.text,
                            date: item.created_at_human,
                            id: item.id,
                            liked: item.liked,
                            joined: item.joined,
                            members: item.members,
                            index: index
                          }}
                          postReply={() => { this.reply(item) }}
                          reply={(value) => this.replyHandler(value)}
                          onLike={(params) => this.like(params)}
                          onJoin={(params) => this.join(params)}
                        />
                      )}
                    </View>
                  }
                </View>
              ))
            }
          </View>
          <BottomSheet
            isVisible={this.props.state.createStatus}
            containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
          >
            <View style={{
              backgroundColor: 'white',
              paddingTop: 40,
              borderTopEndRadius: 20,
              borderTopStartRadius: 20
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: BasicStyles.standardTitleFontSize
                }}>Create Status</Text>
                <TextInput
                  style={{
                    borderColor: Color.gray,
                    borderWidth: .5,
                    borderRadius: 15,
                    width: '90%',
                    marginTop: 10,
                    height: 100
                  }}
                  multiline={true}
                  // numberOfLines={5}
                  onChangeText={text => this.statusHandler(text)}
                  value={this.state.status}
                  placeholder="Express what's on your mind!"
                  placeholderTextColor={'#d1d1d1'}
                />
              </View>
              <View style={{
                flexDirection: 'row-reverse',
                padding: 30
              }}>
                <TouchableOpacity style={{
                  width: '23%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  borderColor: theme ? theme.primary : Color.primary,
                  borderWidth: 1,
                  height: 35,
                  marginRight: 5,
                  backgroundColor: theme ? theme.primary : Color.primary
                }}
                  onPress={() => { this.post() }}
                >
                  <Text style={{ color: 'white' }}>Post</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  width: '23%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  height: 35,
                  marginRight: 5,
                  backgroundColor: Color.gray,
                }}
                onPress={() => { this.props.setCreateStatus(false), this.setState({ status: null }) }}
                >
                  <Text style={{ color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheet>
        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <Footer layer={1} {...this.props} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setCreateStatus: (createStatus) => dispatch(actions.setCreateStatus(createStatus)),
    setComments: (comments) => dispatch(actions.setComments(comments))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Status);