import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import styles from 'modules/addLocation/Style.js';
import {BasicStyles, Color} from 'common';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

class AddressTile extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('[props in Location]', this.props);
    return (
      <TouchableOpacity
        style={[
          styles.AddressTileContainer,
          {
            backgroundColor: this.props.backgroundColor,
            paddingRight: 30
          },
        ]}
        onPress={() => {
          this.props.onPress(this.props.index);
        }}>
        <View style={styles.AddressTypeContainer}>
          <Text
            style={[
              styles.AddressTypeTextStyle,
              {
                color: this.props.fontColor,
                fontWeight: 'bold'
              },
            ]}>
            {this.props.addressType}
          </Text>
        </View>
        <View style={styles.AddressContainer}>
          <Text
            style={[styles.AddressTextStyle, {
                color: this.props.fontColor,
                fontSize: BasicStyles.standardFontSize - 2,
                marginTop: 5,
                marginBottom: 5
              }
            ]}>
            {this.props.address}
          </Text>
        </View>
        <View style={styles.CountryContainer}>
          <Text
            style={[styles.CountryTextStyle, {
              color: this.props.fontColor,
              fontSize: BasicStyles.standardFontSize
            }
          ]}>
            {this.props.country}
          </Text>
        </View>
        <TouchableOpacity
          onPress={this.props.deletingClicked}
          style={
            {
              position: 'absolute',
              right: 15
            }
          }
        >
          <FontAwesomeIcon 
            icon={faTrashAlt}
            size={BasicStyles.iconSize}
            style={{
              color: Color.primary
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

export default AddressTile;
