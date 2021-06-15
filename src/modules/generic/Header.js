import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions, SafeAreaView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAlignLeft, faBars, faChevronLeft, faClock, faHistory, faShoppingBag, faStar, faEdit } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { BasicStyles, Color } from 'common';
import { NeomorphBlur, Neomorph } from 'react-native-neomorph-shadows';
const width = Math.round(Dimensions.get('window').width)

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null
    }
  }

  searchHandler = (value) => {
    this.setState({ search: value });
  }

  back = () => {
    this.props.navigationProps.pop();
  };
  render() {
    const { routeName } = this.props.navigation.state;
    const { theme } = this.props.state;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#E7E9FD',
          width: width,
          height: 100,
          marginTop: 25,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.toggleDrawer()
          }}
          style={{
            height: 50,
            width: 50,
            marginLeft: 5,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 20
          }}
        >
          <Neomorph style={BasicStyles.neomorphIcon}>
            <FontAwesomeIcon
              icon={faAlignLeft}
              size={BasicStyles.iconSize}
              style={[
                BasicStyles.iconStyle,
                {
                  color: Color.primary,
                },
              ]}
            />
          </Neomorph>
        </TouchableOpacity>

        {
          routeName === 'Status' && (
            <View style={{
              flex: 1,
              flexDirection: 'row',
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              padding: 10
            }}>
              <View style={{
                height: 40,
                borderColor: Color.white,
                borderWidth: 1,
                borderRadius: 25,
                width: '50%',
                marginRight: '2%',
                marginLeft: '-13%',
                justifyContent: 'center'
              }}>
                <TextInput
                  style={{
                    height: 45,
                    width: '50%'
                  }}
                  onSubmitEditing={() => { this.props.setStatusSearch(this.state.search) }}
                  onChangeText={text => this.searchHandler(text)}
                  value={this.state.search}
                  placeholder='Search...'
                />
              </View>
              <TouchableOpacity style={{
                position: 'absolute',
                right: 80
              }}
                onPress={() => { this.props.setCreateStatus(true) }}
              >
                <Neomorph style={BasicStyles.neomorphIcon}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    size={BasicStyles.iconSize}
                    color={Color.primary} />
                </Neomorph>
              </TouchableOpacity>
            </View>
          )
        }

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('historyStack', { title: 'History' })}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            width: 50,
            position: 'absolute',
            right: 20
          }}
        >
          <Neomorph style={BasicStyles.neomorphIcon}>
            <FontAwesomeIcon
              icon={faHistory}
              size={BasicStyles.iconSize}
              style={[
                BasicStyles.iconStyle,
                {
                  color: Color.primary,
                },
              ]}
            />
          </Neomorph>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setStatusSearch: (statusSearch) => dispatch(actions.setStatusSearch(statusSearch)),
    setCreateStatus: (createStatus) => dispatch(actions.setCreateStatus(createStatus))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
