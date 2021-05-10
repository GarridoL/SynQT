import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import {NavigationActions} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingCart, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { Color, BasicStyles,Routes } from 'common';
import Api from 'services/api/index.js'
const width = Math.round(Dimensions.get('window').width);
import { connect } from 'react-redux';
class NavigationDrawerStructureRight extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      address:[],
    }
  }
  goTo = (screen) => {
    if (this.props.state.user == null) {
      const proceedToLogin = NavigationActions.navigate({
        routeName: 'loginStack'
      });
      this.props.navigationProps.dispatch(proceedToLogin)
      return
    }
    this.props.navigationProps.navigate(screen)
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigationProps.dispatch(navigateAction);
    // const { setActiveRoute } = this.props;
    // setActiveRoute(route)
  }
  
  render() {
    const { notifications, user, activeRoute } = this.props.state;
    const { theme, cart } = this.props.state
    return (
      <View style={{
        flexDirection: 'row',
        width: width - (width * .10),
       
      }}>
{/* ********************************************************Address Area Edit Here*************************************************************************************** */}
      {/* <TouchableOpacity
        onPress={() => this.goTo('ChangeAddress')}
        style={{
          width: '85%'
        }}>
          <View style={{
            width: '100%',
            flexDirection: 'row',
          
        
          }}>
            <FontAwesomeIcon icon={ faMapMarker } size={15} style={[BasicStyles.iconStyle, {
                  color: Color.primary
                }]}/>
            <Text style={{
              fontSize: 12,
              marginRight:30
            }}
            numberOfLines={1}>
              {this.props.state.location ? this.props.state.location.route : "Current Location"}
            </Text>
          </View>
        </TouchableOpacity> */}


{/* *********************************************************************************************************************************************** */}

      {/* {this.props.state.user ?  <View style={{
          width: '15%', 
        }}>
          <TouchableOpacity onPress={() => this.goTo('Cart')}>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                icon={ faShoppingCart }
                size={15}
                style={[BasicStyles.iconStyle, { color: Color.black}]}
              />
              {
                cart.length > 0 &&
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    backgroundColor: theme ? theme.primary : Color.primary,
                    top: 5,
                    left: 20,
                    width: 12,
                    height: 12,
                    borderRadius: 6
                  }}
                >
                  <Text style={{ color: Color.white, fontSize: 9 }}>
                    {cart.length}
                  </Text>
                </View>
              }
            </View>
          </TouchableOpacity>   
        </View> : null} */}
        
      </View>
    );
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setActiveRoute: (route) => dispatch(actions.setActiveRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(NavigationDrawerStructureRight);