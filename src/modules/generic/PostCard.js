import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput, Alert } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes, faStar, faUserCircle, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import Api from 'services/api';
import UserImage from 'components/User/Image';

const height = Math.round(Dimensions.get('window').height);

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: null,
      options: false
    }
  }

  remove = (data) => {
    Alert.alert(
      '',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', onPress: () => console.log('Ok'), style: 'cancel' },
        {
          text: 'Delete', onPress: () => {
            let posts = this.props.state.comments;
            let parameter = {
              id: data.id
            }
            this.props.loader(true);
            Api.request(Routes.commentsDelete, parameter, response => {
              this.props.loader(false);
              if (response.data !== null) {
                posts && posts.length > 0 && posts.map((item, index) => {
                  if (item.id == data.id) {
                    this.setState({ options: false })
                    posts.splice(index, 1)
                    this.props.setComments(posts)
                  }
                })
              }
            });
          }, style: 'cancel'
        }
      ],
      { cancelable: false }
    )
  }

  createSynqt = (data) => {
    let status = false;
    if (data.members && data.members?.length > 0) {
      let temp = data.members
      data.members.length === 1 && data.members.map((item, index) => {
        if(item.account_id == this.props.state.user.id) {
          status = true;
        }
      })
      if(status === false) {
        this.props.navigation.navigate('restaurantStack', { members: temp })
      } 
    }
  }

  replyHandler = (value) => {
    this.setState({ reply: value });
    this.props.reply(value);
  }

  renderHeader = (data, show) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
      }}>
        <UserImage user={data.user} size={30} />
        <View style={{
          paddingLeft: 5,
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '90%',
          alignItems: 'center'
        }}>
          <View>
            <Text style={{
              fontSize: BasicStyles.standardTitleFontSize,
              fontWeight: 'bold'
            }}>{data?.user?.username}</Text>
            <Text style={{
              fontSize: BasicStyles.standardFontSize
            }}>
              {data.date}
            </Text>
          </View>
          {data.user.id === this.props.state.user.id && show === true && <TouchableOpacity onPress={() => { this.setState({ options: !this.state.options }) }}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </TouchableOpacity>}
          {this.state.options === true && show === true && (<TouchableOpacity style={{
            position: 'absolute',
            right: -5,
            top: 40,
            height: 40,
            width: 105,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: Color.gray,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}
            onPress={() => { this.remove(data) }}>
            <Text>Delete Post</Text>
          </TouchableOpacity>)}
        </View>
      </View>
    )
  }

  renderBody = (data) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
      }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize
        }}>{data.message}</Text>

      </View>
    )
  }

  renderActions = (data) => {
    const { theme } = this.props.state
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
        flexDirection: 'row'
      }}>
        <TouchableOpacity style={{
          width: '23%',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          borderColor: data.liked === 'true' ? Color.primary : Color.lightGray,
          borderWidth: 1,
          height: 35,
          marginRight: 5,
          backgroundColor: data.liked === 'true' ? Color.primary : Color.white
        }}
          onPress={() => {
            this.props.onLike(data)
          }}
        >
          <Text style={{
            color: data.liked === 'true' ? Color.white : Color.black,
            fontSize: 11
          }}>{data.liked === 'true' ? 'Liked' : 'Like'}</Text>
        </TouchableOpacity>


        <TouchableOpacity style={{
          width: '23%',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          borderColor: data.joined === 'true' ? Color.primary : Color.lightGray,
          borderWidth: 1,
          height: 35,
          marginRight: 5,
          backgroundColor: data.joined === 'true' ? Color.primary : Color.white
        }}
          onPress={() => {
            this.props.onJoin(data)
          }}
        >
          <Text style={{
            color: data.joined === 'true' ? Color.white : Color.black,
            fontSize: 11
          }}>{data.joined === 'true' ? 'Joined' : 'Join'}</Text>
        </TouchableOpacity>
        <Text style={{ color: 'gray', fontSize: 11 }}>{data?.members?.length} joined</Text>
        {data.user?.id === this.props.state.user.id && <TouchableOpacity style={{
          position: 'absolute',
          right: 0,
          bottom: 20,
          width: '25%',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          height: 35,
          padding: 5,
          backgroundColor: theme ? theme.primary : Color.primary,
          justifyContent: 'center',
          alignItems: 'center'
        }}
          onPress={() => this.createSynqt(data)}>
          <Text style={{
            color: Color.white,
            fontSize: 10
          }} numberOfLines={1} adjustsFontSizeToFit>Create SYNQT</Text>
        </TouchableOpacity>}
      </View>
    )
  }


  renderComments = (comments) => {
    const { user } = this.props.state;
    return (
      <View style={{
        width: '100%',
        alignItems: 'center',
        borderTopColor: Color.lightGray,
        borderTopWidth: 1
      }}>
        {
          comments && comments.map((item, index) => (
            <View
              key={index}
              style={{
                ...BasicStyles.standardWidth
              }}>
              {this.renderHeader({ user: item.account, date: item.created_at_human }, false)}
              {this.renderBody({ message: item.text })}
            </View>
          ))
        }

        {
          user && (
            <View style={{
              width: '90%',
              borderTopColor: Color.lightGray,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: '5%',
              marginRight: '5%'
            }}>
              {
                user?.account_profile && user?.account_profile.url ? (
                  <Image
                    source={user && user.account_profile && user.account_profile.url ? { uri: Config.BACKEND_URL + user.account_profile.url } : require('assets/logo.png')}
                    style={[BasicStyles.profileImageSize, {
                      height: 30,
                      width: 30,
                      borderRadius: 100
                    }]} />
                ) : <FontAwesomeIcon
                  icon={faUserCircle}
                  size={30}
                  style={{
                    color: Color.white
                  }}
                />
              }
              <TextInput style={{
                width: '100%',
                height: 50
              }}
                onSubmitEditing={() => this.props.postReply(comments)}
                onChangeText={(value) => this.replyHandler(value)}
                placeholder={'Type reply here'}
              />
            </View>
          )
        }
      </View>
    )
  }


  render() {
    const { data } = this.props;
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        borderRadius: BasicStyles.standardBorderRadius,
        borderColor: Color.gray,
        borderWidth: .3,
        marginBottom: 20,
        marginTop: 20
      }}>
        {this.renderHeader(data, true)}
        {this.renderBody(data)}
        {this.renderActions(data)}
        {this.renderComments(data.comments)}
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setComments: (comments) => dispatch(actions.setComments(comments)),
    setTempMembers: (tempMembers) => dispatch(actions.setTempMembers(tempMembers))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostCard);
