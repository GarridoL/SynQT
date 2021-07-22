import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {connect} from 'react-redux';
import { Color } from 'common';

const Label = ({props, text, ...restProps }) => {
  return (
    <View style={{backgroundColor: props.state.theme ? props.state.theme.primary : Color.primary, padding: 8, borderRadius: 4, alignItems: 'center'}} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#fff',
  },
});

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
)(memo(Label));