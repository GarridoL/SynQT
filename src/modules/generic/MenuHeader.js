import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faComments, faUsers, faReply} from '@fortawesome/free-solid-svg-icons';
import {NavigationActions, StackActions} from 'react-navigation';
import {connect} from 'react-redux';
import { BasicStyles, Color } from 'common';
const width = Math.round(Dimensions.get('window').width)

class Header extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigation.pop();
  };

  redirect = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: route, params: {
              initialRouteName: route,
              index: 0
            }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const { status } = this.props;
    return (
      <View style={{flex: 1, flexDirection: 'row', width: width, position: 'absolute', backgroundColor: 'white', zIndex: 1000}}>
        <View style={{flex: 13, flexDirection: 'column'}}>
            {status === false ? <View>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  marginLeft: 12,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 10001
                }}

                onPress={() => this.redirect('Connections')}
                >
                <FontAwesomeIcon
                  icon={faUsers}
                  size={35}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: Color.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
            : <View>
            <TouchableOpacity
               style={{
                 justifyContent: 'center',
                 alignItems: 'center',
                 height: 50,
                 width: 50,
                 right: 10,
                 marginLeft: 12,
               }}
                onPress={() => this.props.navigation.navigate('menuStack')}
               >
               <FontAwesomeIcon
                 icon={faReply}
                 size={35}
                 style={[
                   BasicStyles.iconStyle,
                   {
                     color: Color.primary,
                   },
                 ]}
               />
             </TouchableOpacity>
            </View> }
        </View>

        <View style={{flex: 12, flexDirection: 'column'}}>
        {status === true ? <View>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 10001
                }}

                onPress={() => this.redirect('Connections')}
                >
                <FontAwesomeIcon
                  icon={faUsers}
                  size={35}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: Color.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
            : null }
        </View>
        <View style={{flex: 4, flexDirection: 'column'}}>
           <View>
           <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                width: 50,
                right: 5
              }}
              onPress={() => this.redirect('Messenger')}
              >
              <FontAwesomeIcon
                icon={faComments}
                size={35}
                style={[
                  BasicStyles.iconStyle,
                  {
                    color: Color.primary,
                  },
                ]}
              />
            </TouchableOpacity>
           </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
