import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Dimensions, Share} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUsers, faHome, faBell, faComments, faReply, faShare} from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import { BasicStyles, Color } from 'common';
const width = Math.round(Dimensions.get('window').width)

class Header extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop();
  };

  onShare = async () => {
    const { user } = this.props.state;
    if(user == null){
      return
    }
    try {
      const result = await Share.share({
        message: 'https://wearesynqt/profile/' + user.code
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  render() {
    const { layer } = this.props;
    return (
      <View
        style={{
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            padding: 5,
            backgroundColor: Color.containerBackground
            }}>

          <TouchableOpacity
          onPress={() => this.onShare()}
          >
          <FontAwesomeIcon
            icon={faShare}
            size={BasicStyles.iconSize}
            style={[
              BasicStyles.iconStyle,
              {
                color: Color.gray,
              },
            ]}
          />
          </TouchableOpacity>
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
