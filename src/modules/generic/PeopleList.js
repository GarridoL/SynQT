import React, { Component } from 'react';
import { View, ScrollView, Image, Dimensions, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import UserImage from 'components/User/Image';
import { TouchableOpacity } from 'react-native';
const height = Math.round(Dimensions.get('window').height);

class PeopleList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    const { theme } = this.props.state;
    return (
      <View style={{
        width: '100%',
        position: 'relative',
        flexDirection: 'row'
      }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ margin: '1%' }}>
          {this.props.add === true && <FontAwesomeIcon
            icon={faPlusCircle}
            size={this.props.size ? this.props.size : 45}
            style={{
              color: Color.primary,
              marginLeft: 20,
              fontSize: 1
            }}
            onPress={() => this.props.redirectTo()}
          />}
          {
            data && data.length > 0 && data.map((item, index) => (
              <TouchableOpacity style={{
                borderWidth: this.props.add === false ? 1 : 0,
                borderColor: theme ? theme.secondary : Color.secondary,
                borderRadius: this.props.size ? this.props.size : 45,
                width: this.props.size ? this.props.size : 45,
                height: this.props.size ? this.props.size : 45,
                marginLeft: 3,
                alignItems: 'center',
                justifyContent: 'center'
              }}
                onPress={() => {
                  this.props.navigation.navigate('viewProfileStack', { 
                  user: {
                    account: {
                      profile: item.account?.profile,
                      username: item.account?.username,
                      information: item.account?.information
                    }
                  },
                  level: 1 }) }}>
                <UserImage
                  key={index}
                  user={
                    item.account
                  }
                  color={Color.primary}
                  size={this.props.size ? this.props.size : 45}
                  borderWidth={this.props.add === false ? 1 : 0}
                  borderColor={this.props.add === false ? theme ? theme.secondary : Color.secondary : null}
                  style={{
                    borderWidth: this.props.add === false ? 1 : 0,
                    borderColor: theme ? theme.secondary : Color.secondary,
                    borderRadius: this.props.size ? this.props.size : 45,
                    width: this.props.size ? this.props.size : 45,
                    height: this.props.size ? this.props.size : 45,
                  }}
                />
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setTheme: (theme) => dispatch(actions.setTheme(theme))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(PeopleList);
