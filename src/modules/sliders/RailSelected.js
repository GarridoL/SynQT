import React, { memo } from 'react';
import {View} from 'react-native';
import { Color } from 'common';
import {connect} from 'react-redux';

const RailSelected = (props) => {
  return (
    <View style={{
      height: 4,
      backgroundColor: props.state.theme ? props.state.theme.primary : Color.primary,
      borderRadius: 2}}/>
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
)(memo(RailSelected));