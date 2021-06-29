import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions, SafeAreaView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAlignLeft, faBars, faChevronLeft, faClock, faHistory, faShoppingBag, faStar, faEdit } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { BasicStyles, Color } from 'common';
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
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
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
              padding: 20
            }}>
              <View style={{
                height: 40,
                borderColor: Color.white,
                borderWidth: 1,
                borderRadius: 25,
                width: '75%',
                marginLeft: '-10%',
                justifyContent: 'center'
              }}>
                <TextInput
                  style={{
                    height: 45,
                    width: '100%',
                    borderWidth: .3,
                    borderRadius: 20,
                    borderColor: Color.gray
                  }}
                  onSubmitEditing={() => { this.props.setStatusSearch(this.state.search) }}
                  onChangeText={text => this.searchHandler(text)}
                  value={this.state.search}
                  placeholder='Search...'
                />
              </View>
              <TouchableOpacity style={{
                position: 'absolute',
                right: 50
              }}
                onPress={() => { this.props.setCreateStatus(true) }}
              >
                  <FontAwesomeIcon
                    icon={faEdit}
                    size={BasicStyles.iconSize}
                    color={Color.primary} />
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
            right: 1
          }}
        >
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
