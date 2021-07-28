import React, { memo } from 'react';
import { View } from 'react-native';
import {connect} from 'react-redux';
import {Color} from 'common';

const THUMB_RADIUS = 12;

const Thumb = (props) => {
  return (
    <View style={{
      width: THUMB_RADIUS * 2,
      height: THUMB_RADIUS * 2,
      borderRadius: THUMB_RADIUS,
      borderWidth: 2,
      borderColor: props.state.theme ? props.state.theme.primary : Color.primary,
      backgroundColor: '#ffffff'
    }}/>
  );
};

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setRange: (range) => dispatch(actions.setRange(range))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(Thumb));