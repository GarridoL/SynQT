import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { Color } from 'common'
import ThemeSettingTile from 'modules/display/ThemeSettingTile.js';
import Footer from 'modules/generic/Footer'
const height = Math.round(Dimensions.get('window').height);

const dummyThemeData = [
  {
    title: 'Test Mode',
    details: 'Add description here',
    colors: ['#5842D7', '#FFCC00', '#4CCBA6', '#F88BFF'],
  },
  {
    title: 'Test Mode 1',
    details: 'Add description here',
    colors: ['#4CCBA6', '#FFCC00', '#5842D7', '#F88BFF'],
  },
  {
    title: 'Test Mode 2',
    details: 'Add description here',
    colors: ['#FFCC00', '#4CCBA6', '#5842D7', '#F88BFF'],
  },
  {
    title: 'Test Mode 2',
    details: 'Add description here',
    colors: ['#F88BFF', '#4CCBA6', '#5842D7', '#FFCC00'],
  }
];
class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTile: 0,
    };
  }

  componentDidMount(){
    const { theme } = this.props.state;
    dummyThemeData.map((item, index) => {
      if(item.colors[0] === theme?.primary) {
        this.setState({selectedTile: index})
      }
    })
  }

  selectHandler = (index) => {
    let _theme = dummyThemeData[index].colors
    const {setTheme} = this.props;
    let temGrad = []
    if(_theme[0] === '#4CCBA6'){
      temGrad =['#987BE7', '#b1f2e0', '#4CCBA6']
    }else if (_theme[0] === '#FFCC00'){
      temGrad =['#987BE7', '#ffeb96', '#FFCC00']
    }else if(_theme[0] === '#F88BFF'){
      temGrad =['#987BE7', '#eb97f0', '#f22bff']
    }else{
      temGrad =['#987BE7', '#9276E6', '#5741D7']
    }
    setTheme({
      primary: _theme[0],
      secondary: _theme[1],
      tertiary: _theme[2],
      fourth: _theme[3],
      gradient: temGrad
    });
    console.log(_theme)
    this.setState({selectedTile: index});
  };
  

  displayThemeTiles = () => {
    return dummyThemeData.map((data, index) => {
      return (
        <ThemeSettingTile
          id={index}
          key={index}
          selectedTile={index === this.state.selectedTile ? true : false}
          onSelect={this.selectHandler}
          themeTitle={data.title}
          colors={data.details}
          circles={data.colors}
          theme = {this.props.state.theme}
        />
      );
    });
  };
  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: Color.containerBackground
          }}
          >
          <View
          style={{
            height: height + 25,
            flex: 1
          }}

          >
            {this.displayThemeTiles()}
          </View>
        </ScrollView>
        
        <Footer layer={1} {...this.props}/>
      </View>
    )
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setTheme: (theme) => dispatch(actions.setTheme(theme))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Display)