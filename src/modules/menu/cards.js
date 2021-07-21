import React, { Component } from 'react';
import { View, Text, Image, } from 'react-native';
import Style from './Style.js';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

class Cards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.props.state;
    return (
      this.props.data && this.props.data.map((u, i) => {
        return (
          <View style={Style.Container}>
            {u.images?.length > 0 ? (
              <Image
                style={Style.Image}
                source={u.images && u.images.length > 0 ? { uri: Config.BACKEND_URL + u.images[0].url } : require('assets/test.jpg')}
              />
            ) :
              (
                <View style={{
                  width: '45%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FontAwesomeIcon color={'gray'} icon={faImage} size={60} style={{ marginLeft: 10, marginTop: 1 }} />
                </View>
              )}
            <View style={Style.Text}>
              <Text style={Style.Title} adjustsFontSizeToFit numberOfLines={1}>{u.title}</Text>
              <Text style={{color: theme ? theme.primary : Color.primary}} numberOfLines={1} adjustsFontSizeToFit>{u.price?.length > 0 ? u.price[0].currency + ' ' + u.price[0].price : 'No specific price.'}</Text>
              <Text style={Style.Description} numberOfLines={3}>{u.description}</Text>
            </View>
          </View>
        );
      })
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
  mapDispatchToProps)(Cards);