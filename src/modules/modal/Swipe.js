import React, {Component} from 'react';
import {View, Text, Modal, ScrollView} from 'react-native';
import styles from './Styles.js'
import  Swiper from './Swiper';
class Swipe extends Component {
 

  choiceHandler = (value) => {
    this.setState({choice: value})
  }

  render() {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onClose(null);
        }}
        collapsable={true}>
        <ScrollView style={styles.ModalContainer}>
          <View style={{
            marginBottom: 100
          }}>
            <Swiper
              messengerGroup={this.props.messengerGroup}
              item={this.props.item}
              history={this.props.history}
              navigation={this.props.navigation}
              topFloatButton={true}
              bottomFloatButton={false}
              onClose={(value) => {
              this.props.onClose(value)
            }}/>
          </View>
        </ScrollView>
      </Modal>
    );
  }
}

export default Swipe;
