import React, {Component} from 'react';
import {View} from 'react-native';

import styles from 'modules/display/Styles.js';

class ColorCircle extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.Circle, {backgroundColor: this.props.color}]}></View>
    );
  }
}

export default ColorCircle;
