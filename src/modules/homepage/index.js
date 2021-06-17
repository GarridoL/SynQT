import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faUtensils, faChevronLeft, faTicketAlt, faShoppingBag, faEdit, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import Gradient from 'modules/generic/Gradient';
import LinearGradient from 'react-native-linear-gradient';
import { NeomorphBlur } from 'react-native-neomorph-shadows';
import Api from 'services/api/index.js';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  onFocusFunction = () => {
    /**
     * Executed each time we enter in this component &&
     * will be executed after going back to this component 
    */

    let deepLinkRoute = this.props.state.deepLinkRoute
    console.log('TESTING::::::::: ', deepLinkRoute)
    if (deepLinkRoute !== null && deepLinkRoute !== '') {
      console.log('DEEP LINK ROUTE:')
      const route = deepLinkRoute.replace(/.*?:\/\//g, '');
      const routeName = route.split('/')[0];
      let parameter = {
        condition: [{
          value: route.split('/')[2],
          clause: '=',
          column: 'id'
        }]
      }
      this.setState({ isLoading: true })
      Api.request(Routes.accountRetrieve, parameter, response => {
        this.setState({ isLoading: false })
        if (response.data.length > 0) {
          this.props.navigation.navigate('viewProfileStack', {
            user: {
              account: {
                username: response.data[0].username,
                information: {
                  first_name: response.data[0].account_information?.first_name,
                  last_name: response.data[0].account_information?.last_name,
                },
                profile: {
                  url: response.data[0].account_profile?.url
                },
                id: route.split('/')[2]
              }
            },
            level: 2
          })
        }
      }, error => {
        this.setState({ isLoading: false })
        console.log(error)
      });
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  redirect(route, layer) {
    if (route === 'historyStack') {
      this.props.navigation.navigate(route, { title: 'Upcoming' })
    } else {
      this.props.navigation.navigate(route)
    }
  }

  render() {
    const { user, theme } = this.props.state;
    return (
      <View style={[Style.MainContainer, {
        backgroundColor: '#E7E9FD',
        flex: 1
      }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: '#E7E9FD'
          }}
        >
          <View style={{
            height: '27%',
            justifyContent: 'center',
            width: '90%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '20%',
            padding: 10,
            alignItems: 'center'
          }}>
            {/* <NeomorphBlur
              style={{
                shadowRadius: 5,
                borderRadius: 70,
                backgroundColor: Color.containerBackground,
                width: width - 40,
                height: height / 3.5,
                padding: 18
              }}
            > */}
            <LinearGradient
              colors={theme && theme.gradient !== undefined && theme.gradient !== null ? theme.gradient : Color.gradient}
              locations={[0, 0.5, 1]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 40 }}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style={{
                  width: '50%',
                  paddingLeft: 20,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text adjustsFontSizeToFit style={{
                    color: Color.white,
                    textAlign: 'center'
                  }}>{user?.account_information?.first_name ? user?.account_information?.first_name + '  ' + user?.account_information?.last_name : user?.username}</Text>
                  <Text adjustsFontSizeToFit style={{
                    fontWeight: 'bold',
                    color: Color.white,
                    textAlign: 'center',
                    fontSize: 23
                  }}>HI GUYS! WHERE SHALL WE GO?</Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                  width: '50%'
                }}
                >
                  <TouchableOpacity
                    style={{
                      height: 120,
                      width: 120,
                      borderRadius: 100,
                      borderColor: Color.white,
                      borderWidth: user?.account_profile && user?.account_profile.url ? 0 : 2
                    }}
                    onPress={() => this.props.navigation.push('profileStack')}>
                    {
                      user?.account_profile && user?.account_profile.url ? (
                        <Image
                          source={user && user.account_profile && user.account_profile.url ? { uri: Config.BACKEND_URL + user.account_profile.url } : require('assets/logo.png')}
                          style={[BasicStyles.profileImageSize, {
                            height: '100%',
                            width: '101%',
                            borderRadius: 100,
                            borderColor: Color.white,
                            borderWidth: 3
                          }]} />
                      ) : <FontAwesomeIcon
                        icon={faUserCircle}
                        size={117}
                        style={{
                          color: Color.white
                        }}
                      />
                    }
                    {/* <View style={{
                      height: 40,
                      width: 40,
                      borderRadius: 100,
                      marginRight: 5,
                      position: 'absolute',
                      right: 5,
                      bottom: -2,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <View style={{
                        height: 25,
                        width: 25,
                        borderRadius: 100,
                        borderWidth: 2,
                        borderColor: Color.primary,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <FontAwesomeIcon style={{
                          borderColor: Color.primary
                        }}
                          icon={faEdit}
                          size={12}
                          color={Color.primary}
                        />
                      </View>
                    </View> */}
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
            {/* </NeomorphBlur> */}
          </View>

          {/* <View style={{
              width: '80%',
              marginLeft: '10%',
              marginRight: '10%',
              marginTop: 50,
              borderRadius: BasicStyles.standardBorderRadius,
              height: 120,
              borderColor: Color.primary,
              borderWidth: 1,
              flexDirection: 'row',
            }}>
              <View style={{
                width: '33%',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                 <TouchableOpacity
                  onPress={() => this.redirect('restaurantStack')}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    backgroundColor: Color.primary,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <FontAwesomeIcon icon={faUtensils} size={30} color={Color.white}/>
                  </TouchableOpacity>
              </View>
              <View style={{
                width: '33%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRightColor: Color.primary,
                borderRightWidth: 1,
                borderLeftColor: Color.primary,
                borderLeftWidth: 1,
              }}>
                <TouchableOpacity
                onPress={() => this.redirect('eventsStack')}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    backgroundColor: Color.primary,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <FontAwesomeIcon icon={faTicketAlt} size={30} color={Color.white}/>
                  </TouchableOpacity>
              </View>
              <View style={{
                width: '33%',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <TouchableOpacity
                  onPress={() => this.redirect('retailsStack')}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    backgroundColor: Color.primary,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <FontAwesomeIcon icon={faShoppingBag} size={30} color={Color.white}/>
                  </TouchableOpacity>
              </View>
            </View> */}



          <View style={{
            marginTop: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <NeomorphBlur
              style={{
                shadowRadius: 5,
                borderRadius: 70,
                backgroundColor: '#E7E9FD',
                width: 150,
                height: 150,
                padding: 5
              }}
            >
              <TouchableOpacity
                onPress={() => this.redirect('restaurantStack')}
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#E7E9FD',
                  borderRadius: 70,
                  borderWidth: 1,
                  borderColor: theme ? theme.primary : Color.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10
                }}>
                <FontAwesomeIcon icon={faUtensils} size={60} color={theme ? theme.primary : Color.primary} />
              </TouchableOpacity>
            </NeomorphBlur>
          </View>



          <View style={{
            width: '50%',
            marginLeft: '25%',
            marginRight: '25%',
            marginTop: 50,
            marginBottom: 100
          }}>
            <NeomorphBlur style={{
              shadowRadius: 10,
              borderRadius: 70,
              backgroundColor: '#E7E9FD',
              width: width / 2,
              height: 60,
              padding: 10,
            }}
            >
              <TouchableOpacity
                onPress={() => this.redirect('historyStack')}
                style={{
                  ...BasicStyles.standardButton,
                  backgroundColor: '#E7E9FD',
                  borderColor: theme ? theme.primary : Color.primary,
                  borderWidth: 1,
                  marginBottom: 10,
                }}>
                <Text style={{
                  color: theme ? theme.primary : Color.primary,
                  fontWeight: 'bold'
                }}>Upcoming</Text>
              </TouchableOpacity>
            </NeomorphBlur>
          </View>
        </ScrollView>

        <Footer layer={0} {...this.props} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(HomePage);
