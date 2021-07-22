import React, { memo } from 'react';
import { View } from 'react-native';
import { Color } from 'common';
import {connect} from 'react-redux';

const Notch = props => {
  return (
    <View style={{
      width: 8,
      height: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: props.state.theme ? props.state.theme.primary : Color.primary,
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderTopWidth: 8
    }} {...props}/>
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
)(memo(Notch));