import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles } from 'common';
import styles from 'modules/display/Styles.js';
import ColorCircle from 'modules/display/ColorCircle';

class ThemeSettingTile extends Component {
  constructor(props) {
    super(props);
  }

  displayColorCirles = () => {
    return this.props.circles.map((color, index) => {
      return (
        <View style={[styles.ColorContainer, {
          marginTop: 10
        }]} key={index}>
          <ColorCircle color={color} />
        </View>
      );
    });
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.SettingTileContainer}
        onPress={() => {
          this.props.onSelect(this.props.id);
        }}>
        <View style={styles.ThemeDetailsContainer}>
          <View style={styles.ThemeTitleContainer}>
            <Text style={[styles.ThemeTitleTextStyle, {
              fontSize: BasicStyles.standardFontSize
            }]}>
              {this.props.themeTitle}
            </Text>
          </View>
          <View style={styles.ThemeColorsContainer}>
            <Text style={[
              styles.ThemeColorsTextStyle, { fontSize: BasicStyles.standardFontSize }]}>{this.props.colors}</Text>
          </View>
          <View style={styles.ColorsContainer}>
            {this.displayColorCirles()}
          </View>
        </View>
        <View style={styles.IconContainer}>
          <FontAwesomeIcon
            icon={faCheck}
            size={20}
            style={{ color: this.props.selectedTile ? '#3DBB85' : '#FFFFFF', }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default ThemeSettingTile;
