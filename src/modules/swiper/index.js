
import React, {Component} from 'react'
import {StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, ImageBackground, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faTimes} from '@fortawesome/free-solid-svg-icons';

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth = Dimensions.get('window').width

const Images = [
    { id: "1", uri: require('assets/test.jpg'), title: "Italian Pizza", location: "Cebu City, Philippines"},
    { id: "2", uri: require('assets/logo_white.png'), title: "Siml Logo", location: "Cebu City, Philippines" },
    { id: "3", uri: require('assets/test2.jpg'), title: "French Burger", location: "Cebu City, Philippines" },
    { id: "4", uri: require('assets/logo_white.png'), title: "Siml", location: "Cebu City, Philippines" },
    { id: "5", uri: require('assets/test.jpg'), title: "Italian Pizza", location: "Cebu City, Philippines" },
]

class Swiper extends Component{
    constructor(props){
        super(props)

        this.position = new Animated.ValueXY()
        this.state = {
            currentIndex: 0,
            isMoveLeft: false,
            isMoveRight: false,
            scroll: true,
            pan: new Animated.ValueXY(),
        }

        this.rotate = this.position.x.interpolate({
            inputRange: [-ScreenWidth/2, 0, ScreenWidth/2],
            outputRange: ['-30deg', '0deg', '10deg'],
            extrapolate: 'clamp'
        })

        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
            ...this.position.getTranslateTransform()
            ]
        }

        this.likeOPacity = this.position.x.interpolate({
            inputRange: [-ScreenWidth/2, 0, ScreenWidth/2],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        })

        this.disLikeOPacity = this.position.x.interpolate({
            inputRange: [-ScreenWidth/2, 0, ScreenWidth/2],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        })

        this.nextCardOPacity = this.position.x.interpolate({
            inputRange: [-ScreenWidth/2, 0, ScreenWidth/2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        })

        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-ScreenWidth/2, 0, ScreenWidth/2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        })
        
    }
    componentWillMount(){
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: () => this.setState({ scroll: true }),
            onPanResponderMove: (evt, gestureState) => {
                this.position.setValue({x: gestureState.dx, y: gestureState.dy})
                console.log(gestureState.dx);
                if(gestureState.dx < 0){
                  this.setState({isMoveLeft: true})
                  this.setState({isMoveRight: false})
                }else if(gestureState.dx > 0){
                  this.setState({isMoveRight: true})
                  this.setState({isMoveLeft: false})
                }

            },
            onPanResponderRelease: (evt, gestureState) => {
              this.setState({isMoveRight: false})
              this.setState({isMoveLeft: false})
                if(gestureState.dx > 120){
                    Animated.spring(this.position, {
                        toValue: { x: ScreenWidth + 100, y: gestureState.dy }
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                }
                else if (gestureState.dx < -120) {
                    Animated.spring(this.position, {
                      toValue: { x: -ScreenWidth - 100, y: gestureState.dy }
                    }).start(() => {
                      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                        this.position.setValue({ x: 0, y: 0 })
                      })
                    })
                  }
                  else if (gestureState.dy < -120) {
                    Animated.spring(this.position, {
                      toValue: { x: gestureState.dx, y: -ScreenHeight - 100 }
                    }).start(() => {
                      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                        this.position.setValue({ x: 0, y: 0 })
                      })
                    })
                  }
                  else {
                    Animated.spring(this.position, {
                      toValue: { x: 0, y: 0 },
                      friction: 2
                    }).start()
                  }
            }
        })
    }
    renderUsers = () => {
        return Images.map((item, i) => {
          if (i < this.state.currentIndex) {
            return null
          }
          else if (i == this.state.currentIndex) {
            return (
              <Animated.View
                {...this.PanResponder.panHandlers}
                key={item.id} style={[this.rotateAndTranslate, { height: ScreenHeight - 120, width: ScreenWidth, paddingLeft: 15, paddingRight: 15}]}>
                <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                  <Text style={{ borderWidth: 1, borderColor: this.state.isMoveRight ? 'green' : 'transparent', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>{this.state.isMoveRight ? 'LIKE' : null}</Text>
                </Animated.View>
    
                <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                  <Text style={{ borderWidth: 1, borderColor: this.state.isMoveLeft ? 'red' : 'transparent', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>{this.state.isMoveLeft ? 'NOPE' : null}</Text>
                </Animated.View>
    
                <ImageBackground
                  style={{ flex: 1, height: null, width: null, resizeMode: 'cover'}}
                  imageStyle={{flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}}
                  source={item.uri}>
                  <View style={{position: 'absolute', bottom: 20}}>
                    <Text style={{color: 'white', left: 10, fontSize: 20, fontWeight: 'bold'}}>{item.title}</Text>
                    <Text style={{color: 'white', left: 10}}>{item.location}</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      alignItems:'center',
                      justifyContent:'center',
                      width:100,
                      right: -50,
                      height:100,
                      backgroundColor:'#4CCBA6',
                      borderRadius:100,
                      position: 'absolute',
                      bottom: 100,
                      right: 15
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      size={50}
                      color={'white'}
                    />
                  </TouchableOpacity>
                  <View style={{position: 'absolute', bottom: 20, right: 15, flexDirection: 'row'}}>
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'#FFCC00'}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'#FFCC00'}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'#FFCC00'}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'white'}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'white'}
                  />
                  </View>
                </ImageBackground>
    
              </Animated.View>
            )
          }
          else {
            return (
              <Animated.View
                key={item.id} style={[{
                  opacity: this.nextCardOpacity,
                  transform: [{ scale: this.nextCardScale }],
                  height: ScreenHeight - 120, width: ScreenWidth, padding: 10, position: 'absolute'
                }]}>
                <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                  <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
    
                </Animated.View>
    
                <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                  <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
    
                </Animated.View>
    
                <ImageBackground
                  style={{ flex: 1, height: null, width: null, resizeMode: 'cover'}}
                  imageStyle={{flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}}
                  source={item.uri} >
                  <View style={{position: 'absolute', bottom: 20}}>
                    <Text style={{color: 'white', left: 10, fontSize: 20, fontWeight: 'bold'}}>{item.title}</Text>
                    <Text style={{color: 'white', left: 10}}>{item.location}</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      alignItems:'center',
                      justifyContent:'center',
                      width:100,
                      right: -50,
                      height:100,
                      backgroundColor:'#4CCBA6',
                      borderRadius:100,
                      position: 'absolute',
                      bottom: 100,
                      right: 15
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      size={50}
                      color={'white'}
                    />
                  </TouchableOpacity>
                  <View style={{position: 'absolute', bottom: 20, right: 15, flexDirection: 'row'}}>
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'#FFCC00'}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'#FFCC00'}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'#FFCC00'}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'white'}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={30}
                    color={'white'}
                  />
                  </View>
                </ImageBackground>
    
              </Animated.View>
            )
          }
        }).reverse()
      }
      
      render() {
        return (
          <View style={{ flex: 1 }}>
            <View style={{ height: 60 }}>
    
            </View>
            <View style={{ flex: 1 }}>
              {this.renderUsers()}
            </View>
            <View style={{ height: 60 }}>
    
            </View>
    
    
          </View>
    
        );
      }
}

export default Swiper;