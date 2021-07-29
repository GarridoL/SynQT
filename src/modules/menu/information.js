import React, { Component } from 'react';
import { View, Text, Image, } from 'react-native'
import Style from './Style.js'

class Information extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let schedule = this.props.hours && this.props.hours !== 'NULL'? JSON.parse(this.props.hours) : null
    if(schedule && schedule !== 'NULL' && typeof(schedule) !== 'object') {
      schedule = JSON.parse(schedule);
    }
    let information = null
    try {
      information = JSON.parse(this.props.description).information
    } catch (e) {
      console.log(e)
    }
    return (
      <View style={{
        paddingTop: 22
      }}>
        <Text style={{ fontFamily: 'Poppins-SemiBold', }}>{this.props.name}</Text>
        <Text>{information}</Text>
        <Text style={{ fontFamily: 'Poppins-SemiBold', marginTop: 20 }}>RESTAURANT HOURS</Text>
        { schedule && schedule !== 'NULL' && schedule?.schedule?.length > 0 && schedule?.schedule?.map((item, index) => {
          return (
            <View>
              <Text>{item.value} { item.startTime?.hh ? item.startTime?.hh + ':' + item.startTime?.mm + ' ' + item.startTime?.a : ''} {item.startTime?.hh ? '-' : ''} {item.endTime?.hh ? item.endTime?.hh + ':' + item.endTime?.mm + ' ' + item.endTime?.a : ''}</Text>
            </View>
          )
        })}
      </View >
    )
  }

}

export default Information;