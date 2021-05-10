import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import Style from 'modules/generic/TabOptionStyle.js'
import { BasicStyles, Color } from 'common';

class Tab extends Component{
  constructor(props){
    super(props);
    this.state = {
        choice: this.props.choice[0]
    }
  }

  choiceHandler = (value) => {
    this.setState({choice: value});
    this.props.onClick(value)
  }

  render() {
    return (
      <View>
        {
          (this.props.level === 1) && (
            <View style={Style.Tab}>
              <TouchableOpacity style={this.state.choice == this.props.choice[0] ? Style.MenuClicked : Style.Menu} onPress={() => this.choiceHandler(this.props.choice[0])}>
                <Text style={this.state.choice == this.props.choice[0] ? {color: 'white', marginTop: 12} : {color: Color.primary, marginTop: 12, fontWeight: 'bold'}}>{this.props.choice[0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.state.choice == this.props.choice[1] ? Style.InformationClicked : Style.Information} onPress={() => this.choiceHandler(this.props.choice[1])}>
                <Text style={this.state.choice == this.props.choice[1] ? {color: 'white', marginTop: 12} : {color: Color.primary, marginTop: 12, fontWeight: 'bold'}}>{this.props.choice[1]}</Text>
              </TouchableOpacity>
            </View>
          )
        }
        {
          (this.props.level === 2) && (
            <View style={Style.Tab}>
              <TouchableOpacity style={[Style.Information, {width: '100%'}]}>
                <Text style={{color: Color.primary, marginTop: 12, fontWeight: 'bold'}}>{this.props.choice[0]}</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    )
  }

}

export default Tab;