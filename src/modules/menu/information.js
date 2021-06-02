import React, { Component } from 'react';
import { View, Text, Image, } from 'react-native'
import Style from './Style.js'

class Information extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let schedule = this.props.hours? JSON.parse(this.props.hours) : null
    return (
      <View style={{ paddingTop: 22 }}>
        <Text style={{ fontWeight: 'bold' }}>{this.props.name}</Text>
        <Text>{this.props.description}</Text>
        <Text style={{ fontWeight: 'bold', marginTop: 20 }}>RESTAURANT HOURS</Text>
        { schedule?.schedule?.length > 0 && schedule?.schedule?.map((item, index) => {
          return (
            <View>
              <Text>{item.value} {item.startTime ? item.startTime?.HH + ':' + item.startTime?.mm : ''} {item.startTime ? '-' : ''} {item.endTime ? item.endTime?.HH + ':' + item.endTime?.mm : ''}</Text>
            </View>
          )
        })}
      </View >
    )
  }

}

export default Information;