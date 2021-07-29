import React, { Component } from 'react';
import { View, Platform, Text, Image, TouchableOpacity, Dimensions, Modal, Pressable, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles, Routes } from 'common';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import styles from './Style'
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: [
        {
          title: 'Edit Group Name',
          type: 'button'
        },
        {
          title: 'Rate Now',
          type: 'icon'
        },
        {
          title: 'Close',
          type: 'close'
        }
      ],
      visible: false,
      title: this.props.title,
      isLoading: false
    }
  }

  titleHandler = (value) => {
    this.setState({ title: value })
  }

  updateName = () => {
    const { setCurrentTitle, setAllMessages } = this.props;
    let parameter = {
      id: this.props.groupId,
      title: this.state.title
    }
    this.setState({ isLoading: true })
    Api.request(Routes.messengerGroupUpdate, parameter, response => {
      console.log(response, 'resonse');
      this.setState({ isLoading: false })
      if (response.data === true) {
        setCurrentTitle(this.state.title)
        let temp = this.props.state.allMessages;
        temp.length > 0 && temp.map((item, index) => {
          console.log(item.messenger_group_id, this.props.groupId, 'test');
          if(item.messenger_group_id === this.props.groupId) {
            item.title = this.state.title
          }
        })
        setAllMessages(temp);
        this.setState({ visible: false })
      }
    });
  }

  renderModal() {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {
            this.setState({ visible: false });
          }}
        >{this.state.isLoading ? <Spinner mode="full" /> : null}
          <View style={styles.centeredView}>
            <View style={[
              styles.modalView, {
                borderWidth: .3,
                borderColor: Color.gray
              }
            ]}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                 fontFamily: 'Poppins-SemiBold',
                  fontSize: BasicStyles.standardTitleFontSize
                }}>Edit Group Name</Text>
                <TextInput
                  style={{
                    borderColor: Color.gray,
                    borderWidth: .5,
                    borderRadius: 50,
                    width: width - 100,
                    marginTop: 30,
                    paddingLeft: 20,
                    height: Platform.OS == 'ios' ? 30 : null,
                  }}
                  multiline={true}
                  numberOfLines={1}
                  onChangeText={text => this.titleHandler(text)}
                  value={this.state.title}
                  placeholder="Group Name"
                />
              </View>
              <View style={{
                flexDirection: 'row-reverse',
                marginTop: 40
              }}>
                <TouchableOpacity style={{
                  backgroundColor: Color.primary,
                  height: 35,
                  width: '20%',
                  alignItems: 'center',
                  borderRadius: 25,
                  justifyContent: 'center'
                }}
                  onPress={() => { Keyboard.dismiss(); this.updateName() }}
                >
                  <Text style={{ color: 'white', fontSize: BasicStyles.standardFontSize }}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: Color.gray,
                  height: 35,
                  width: '20%',
                  marginRight: '2%',
                  alignItems: 'center',
                  borderRadius: 25,
                  justifyContent: 'center'
                }}
                  onPress={() => {this.setState({ visible: false }) }}
                >
                  <Text style={{ color: 'white', fontSize: BasicStyles.standardFontSize }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  render() {
    const { options } = this.state;
    return (
      <View style={{
        position: 'absolute',
        zIndex: 1000,
        bottom: 10,
        right: 0,
        height: height * 0.5,
        width: width,
        backgroundColor: Color.white,
        borderTopLeftRadius: BasicStyles.standardBorderRadius,
        borderTopRightRadius: BasicStyles.standardBorderRadius,
        borderWidth: 1,
        borderColor: Color.lightGray
      }}
      >
        <ScrollView style={{marginBottom: 100}}>
          <View style={{ alignItems: 'center', marginBottom: 50, marginTop: 10 }}>
            <View style={{ borderBottomWidth: 2, marginBottom: 10, borderBottomColor: 'gray', width: 70 }}></View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', }}>More settings</Text>
          </View>
          {
            options.map(item => {
              return (
                <TouchableOpacity style={{
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderBottomColor: Color.lightGray
                }}
                  onPress={() => {
                    if (item.title === 'Rate Now') {
                      this.props.navigation.navigate('rateStack', { data: [], synqtId: this.props.synqtId, status: this.props.status })
                    } else if (item.title === 'Close') {
                      this.props.setShowSettings(!this.props.state.showSettings);
                    }
                  }}
                >
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    color: item.type === 'close' ? Color.danger : 'black'
                  }}>{item.title}</Text>
                  {item.type === 'button' && <View style={{
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 35,
                    position: 'absolute',
                    right: 10,
                    borderRadius: 20,
                    backgroundColor: Color.primary
                  }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ visible: true })
                      }}>
                      <Text style={{
                        color: Color.white,
                        fontSize: BasicStyles.standardFontSize
                      }}>Edit</Text>
                    </TouchableOpacity>
                  </View>}
                  {item.type === 'icon' && <View style={{
                    position: 'absolute',
                    right: 30,
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      size={30}
                      style={{ color: Color.primary }} />
                  </View>}
                </TouchableOpacity>
              )
            })}
        </ScrollView>
        {this.state.visible && this.renderModal()}
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setShowSettings: (showSettings) => dispatch(actions.setShowSettings(showSettings)),
    setCurrentTitle: (currentTitle) => dispatch(actions.setCurrentTitle(currentTitle)),
    setAllMessages: (allMessages) => dispatch(actions.setAllMessages(allMessages)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);