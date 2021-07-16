import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Color, BasicStyles} from 'common';
import { connect } from 'react-redux';

class FloatingButton extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    const { theme } = this.props.state;
    return (
			<View style={{flexDirection: 'row', position: 'absolute', bottom: 70, width: '100%'}}>
        <View style={{width: '50%'}}>
				<TouchableOpacity
          style={{
            alignItems:'center',
            justifyContent:'center',
            width:80,
            left: 70,
            height:80,
            backgroundColor: theme ? theme.secondary : Color.secondary,
            borderRadius:40,
            elevation: BasicStyles.elevation
          }}
          onPress={() => {
            this.props.onClose();
          }}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size={40}
            color={'white'}
          />
          </TouchableOpacity>
          </View>
          <View style={{width: '50%'}}>
        <TouchableOpacity
          style={{
            alignItems:'center',
            justifyContent:'center',
            width:80,
            right: -50,
            height:80,
            backgroundColor: theme ? theme.secondary : Color.secondary,
            borderRadius: 40,
            elevation: BasicStyles.elevation
          }}
          onPress={() => {this.props.onClick()}}
        >
          <FontAwesomeIcon
            icon={faCheck}
            size={40}
            color={'white'}
          />
          </TouchableOpacity>
        </View>
			</View>
    )
  }

}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(FloatingButton);