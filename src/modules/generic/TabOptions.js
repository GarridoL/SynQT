import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import Style from 'modules/generic/TabOptionStyle.js'
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: this.props.choice[0]
    }
  }

  choiceHandler = (value) => {
    this.setState({ choice: value });
    this.props.onClick(value)
  }

  render() {
    const { theme } = this.props.state;
    return (
      <View>
        {
          (this.props.level === 1) && (
            <View style={[Style.Tab, { borderColor: theme ? theme.primary : Color.primary }]}>
              <TouchableOpacity
                onPress={() => this.choiceHandler(this.props.choice[0])}
                style={[
                  this.state.choice == this.props.choice[0] ? Style.MenuClicked : Style.Menu, {
                    backgroundColor: this.state.choice == this.props.choice[0] ? (theme ? theme.primary : Color.primary) : 'white'
                  }
                ]}
              >
                <Text style={this.state.choice == this.props.choice[0] ? { color: 'white', marginTop: 12 } : { color: Color.primary, marginTop: 12, fontWeight: 'bold' }}>{this.props.choice[0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.choiceHandler(this.props.choice[1])}
                style={[
                  this.state.choice == this.props.choice[1] ? Style.InformationClicked : Style.Information, {
                    backgroundColor: this.state.choice == this.props.choice[1] ? (theme ? theme.primary : Color.primary) : 'white'
                  }
                ]}
              >
                <Text style={this.state.choice == this.props.choice[1] ? { color: 'white', marginTop: 12 } : { color: Color.primary, marginTop: 12, fontWeight: 'bold' }}>{this.props.choice[1]}</Text>
              </TouchableOpacity>
            </View>
          )
        }
        {
          (this.props.level === 2) && (
            <View style={[Style.Tab, { borderColor: theme ? theme.primary : Color.primary }]}>
              <TouchableOpacity style={[Style.Information, { width: '100%' }]}>
                <Text style={{ color: Color.primary, marginTop: 12, fontWeight: 'bold' }}>{this.props.choice[0]}</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    )
  }

}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setTempMembers: (tempMembers) => dispatch(actions.setTempMembers(tempMembers))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(Tab);