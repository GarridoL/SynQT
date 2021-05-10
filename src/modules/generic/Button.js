import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput } from 'react-native'
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient'

class Button extends Component{
    constructor(props){
        super(props)
        this.state={
        }
    }

    render() {
        // console.log(this.props.styles);
        return(
            <View>        
                <TouchableOpacity style={this.props.styles} onPress={() => this.props.redirect()} underlayColor={Color.gray}>
                    <LinearGradient
                        colors = {['#FFE1B2', '#EAA467', '#EAA467']}
                        style={{padding: 10, paddingLeft: 40, paddingRight: 40, borderRadius: 50}}
                    >
                        {this.props.content}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
    const { actions } = require('@redux');
    return {};
}
export default connect(
    mapStateToProps,
    mapDispatchToProps)(Button);