import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faUtensils, faCalendar, faUserCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import Gradient from 'modules/generic/Gradient';
import LinearGradient from 'react-native-linear-gradient';
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
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[Style.MainContainer, {
            flex: 1,
            alignItems: 'center',
            height: height
          }]}>
            <View style={{
              justifyContent: 'center',
              width: '90%',
              marginRight: '5%',
              marginLeft: '5%',
              alignItems: 'center'
            }}>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
                >
                  <View
                    style={{
                      height: 150,
                      width: 150,
                      borderRadius: 100,
                      borderColor: theme ? theme.primary : Color.primary,
                      borderWidth: 2
                    }}
                  >
                    {
                      user?.account_profile && user?.account_profile.url ? (
                        <Image
                          source={user && user.account_profile && user.account_profile.url ? { uri: Config.BACKEND_URL + user.account_profile.url } : require('assets/logo.png')}
                          style={[BasicStyles.profileImageSize, {
                            height: '100%',
                            width: '100%',
                            borderRadius: 100,
                            borderColor: Color.white,
                            borderWidth: 3
                          }]} />
                      ) : <FontAwesomeIcon
                        icon={faUserCircle}
                        size={146}
                        style={{
                          color: theme ? theme.primary : Color.primary
                        }}
                      />
                    }
                    {/* <View style={{
                  height: 35,
                  width: 35,
                  borderRadius: 100,
                  marginRight: 5,
                  position: 'absolute',
                  right: 0,
                  bottom: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Color.white,
                }}>
                  <View style={{
                    backgroundColor: theme ? theme.primary : Color.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    height: 30,
                    width: 30,
                  }}>
                    <FontAwesomeIcon style={{
                      borderColor: Color.primary
                    }}
                      icon={faPencilAlt}
                      size={15}
                      color={Color.white}
                    />
                  </View>
                </View> */}
                  </View>
                </View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 20
                }}>
                  <View style={{
                    flexDirection: 'row',
                  }}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      size={20}
                      style={{ marginRight: 5 }}
                      color={Color.gray} />
                    <Text style={{
                      fontSize: 18,
                      fontFamily: 'Poppins-Bold'
                    }}
                      numberOfLines={1}>{user?.account_information?.first_name ? user?.account_information?.first_name + '  ' + user?.account_information?.last_name : user?.username}
                    </Text>
                  </View>
                  <TouchableOpacity style={{
                    padding: 5,
                    paddingRight: 10,
                    paddingLeft: 10,
                    borderRadius: 20,
                    backgroundColor: Color.lightGray
                  }}
                    onPress={() => this.props.navigation.push('profileStack')}
                  >
                    <Text style={{
                      textAlign: 'center',
                      fontSize: 12
                    }}
                      numberOfLines={4}>complete my profile</Text>
                  </TouchableOpacity>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      textAlign: 'center',
                      fontSize: 24,
                      marginTop: 20
                    }} adjustsFontSizeToFit>Hi guys! Where shall we go?</Text>
                </View>
              </View>
            </View>

            <View style={{
              width: '80%',
              marginTop: 20,
              borderRadius: 25
            }}>
              <View style={{
                height: 130,
                borderColor: Color.gray,
                borderWidth: 1,
                borderRadius: 20,
                alignItems: 'center'
              }}>
                <View style={{
                  borderRadius: 100,
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Color.primary,
                  position: 'absolute',
                  top: -20
                }}>
                  <FontAwesomeIcon icon={faCalendar} size={13} color={Color.white} />
                </View>
                <Text style={{
                  marginTop: 20,
                  textAlign: 'center',
                  padding: 5
                }}
                  adjustsFontSizeToFit
                  numberOfLines={2}
                >See your upcoming reservations from different SYNQTs.</Text>
              </View>

              <LinearGradient
                colors={['#FFE1B2', '#EAA467', '#EAA467']}
                style={{
                  height: 50,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  position: 'absolute',
                  bottom: 0
                }}
                onPress={() => this.redirect('historyStack')}
              >
                <TouchableOpacity
                  onPress={() => this.redirect('historyStack')}
                  style={{
                    height: 50,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    color: Color.white,
                    fontFamily: 'Poppins-SemiBold'
                  }}>Upcoming</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40
            }}>
              <TouchableOpacity
                onPress={() => this.redirect('restaurantStack')}
                style={{
                  borderRadius: 100,
                  height: 70,
                  width: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Color.primary,
                  marginBottom: 5
                }}>
                <FontAwesomeIcon icon={faUtensils} size={30} color={Color.white} />
              </TouchableOpacity>
              <Text style={{ color: Color.gray }}>Create SYNQT</Text>
            </View>
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
