import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faUtensils, faChevronLeft, faTicketAlt, faShoppingBag, faEdit, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import Gradient from 'modules/generic/Gradient'
import LinearGradient from 'react-native-linear-gradient'
class HomePage extends Component {
  constructor(props) {
    super(props); 3
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
        backgroundColor: Color.containerBackground,
        flex: 1
      }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: Color.containerBackground
          }}
        >
          <SafeAreaView>
            <LinearGradient
              colors={theme && theme.gradient !== undefined && theme.gradient !== null ? theme.gradient : Color.gradient}
              locations={[0, 0.5, 1]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '15%', paddingRight: 250, paddingLeft: 10 }}
            >
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ marginTop: 50 }}>
                  <Text style={{
                    textAlign: 'center',
                    color: Color.white
                  }}>{user?.account_information?.first_name ? user?.account_information?.first_name + '  ' + user?.account_information?.last_name : user?.username}</Text>
                  <Text style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: Color.white,
                    fontSize: 25,
                    width: 200
                  }}>What's the Consensus.</Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                  width: '100%'
                }}
                >
                  <TouchableOpacity
                    style={{
                      height: 135,
                      width: 135,
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
                            borderWidth: 2
                          }]} />
                      ) : <FontAwesomeIcon
                        icon={faUserCircle}
                        size={132}
                        style={{
                          color: Color.white
                        }}
                      />
                    }
                    <View style={{
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
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </SafeAreaView>

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
            // width: '30%',
            // marginLeft: '10%',
            // marginRight: '10%',
            marginTop: 50,
            // // borderRadius: BasicStyles.standardBorderRadius,
            // height: 120,
            // borderColor: Color.primary,
            // borderWidth: 1,
            // flexDirection: 'row',
          }}>
            <View style={{
              // width: '33%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <TouchableOpacity
                onPress={() => this.redirect('restaurantStack')}
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 70,
                  borderWidth: 1,
                  borderColor: Color.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  elevation: 3,
                  shadowColor: Color.primary,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  marginBottom: 10
                }}>
                <FontAwesomeIcon icon={faUtensils} size={60} color={Color.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{
            width: '50%',
            marginLeft: '25%',
            marginRight: '25%',
            marginTop: 50
          }}>
            <TouchableOpacity
              onPress={() => this.redirect('historyStack')}
              style={{
                ...BasicStyles.standardButton,
                backgroundColor: Color.white,
                borderColor: Color.primary,
                borderWidth: 1,
                elevation: 3,
                shadowColor: Color.primary,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                marginBottom: 10
              }}>
              <Text style={{
                color: Color.primary
              }}>Upcoming</Text>
            </TouchableOpacity>
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
