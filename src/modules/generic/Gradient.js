import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient'
class Gradient extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <LinearGradient
            colors={['#987BE7', '#9276E6', '#5741D7']}
            locations={[0,-0.5,1]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={this.props.style}
            >
                {this.props.content}
            </LinearGradient>
        )
    }
}

export default Gradient;