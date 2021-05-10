import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BasicStyles, Color } from 'common'
import Footer from 'modules/generic/Footer'

class TermsAndConditions extends Component {
  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <ScrollView style={{
          backgroundColor: Color.containerBackground
        }}
        showsVerticalScrollIndicator={false}
        >
          <View style={styles.TermsAndConditionsContainer}>
            <View style={styles.SectionContainer}>
              <View style={[styles.SectionDescriptionContainer, {
                marginTop: 25
              }]}>
                <Text style={styles.SectionDescriptionTextStyle}>
                  Thank you for choosing SIML a product of Increment Technologies (“we, us, our”) to provide you (“you, your, yours, user”) with services for money transfer. Our program is very straightforward and easy to use, designed to take you from beginner to advanced which are available on (i) applications available to download on mobile on both iOS and Android, and access our website by using any desktops or mobile devices, by which you can use to send or transfer funds in any location you want, collectively being our services to you (“Program”).
                  In order to access our program, whether or not you are an existing or former user, you confirm that you have read these Terms of Use (“Terms”). Whenever you use our services, you acknowledge that you understand and agree to these Terms, and you also agree to our Privacy and Cookie Policies. We recommend that you print a copy of these Terms for future reference. We may terminate your access to the Services if you breach our Terms.
                  Unless explicitly stated otherwise, any new features that are added to the current Program, including the release of new tools and resources, shall be subject to these Terms.
                  These Terms of Use apply to this website and any other website, application, or other online service that links to these Terms of Use, including author websites and online services, however accessed and/or used, that are operated or otherwise made available by Increment Technologies.
                  Increment Technologies (“we”, “us”, or “our”) reserves the right, at our discretion, to change, modify, add, or remove portions of these terms of use at any time. Please check these terms of use periodically for changes. Your continued use of the site following the posting of changes to these terms of use will mean you accept those changes.
                  This is a legal agreement between you (“you” or “user”) and us and states the material terms and conditions that govern your use of the program. This agreement, together with all updates, supplements, additional terms, and all of the rules and policies collectively constitute and shall be referred to as the “Agreement” between you and Increment Technologies.
                  By accessing the program, you agree to be legally bound by this agreement. If you do not agree to the terms of service and conditions of use stated herein, please immediately leave this site.
                </Text>

                <Text style={styles.SectionDescriptionTextStyle}>
                  Thank you for choosing SIML a product of Increment Technologies (“we, us, our”) to provide you (“you, your, yours, user”) with services for money transfer. Our program is very straightforward and easy to use, designed to take you from beginner to advanced which are available on (i) applications available to download on mobile on both iOS and Android, and access our website by using any desktops or mobile devices, by which you can use to send or transfer funds in any location you want, collectively being our services to you (“Program”).
                  In order to access our program, whether or not you are an existing or former user, you confirm that you have read these Terms of Use (“Terms”). Whenever you use our services, you acknowledge that you understand and agree to these Terms, and you also agree to our Privacy and Cookie Policies. We recommend that you print a copy of these Terms for future reference. We may terminate your access to the Services if you breach our Terms.
                  Unless explicitly stated otherwise, any new features that are added to the current Program, including the release of new tools and resources, shall be subject to these Terms.
                  These Terms of Use apply to this website and any other website, application, or other online service that links to these Terms of Use, including author websites and online services, however accessed and/or used, that are operated or otherwise made available by Increment Technologies.
                  Increment Technologies (“we”, “us”, or “our”) reserves the right, at our discretion, to change, modify, add, or remove portions of these terms of use at any time. Please check these terms of use periodically for changes. Your continued use of the site following the posting of changes to these terms of use will mean you accept those changes.
                  This is a legal agreement between you (“you” or “user”) and us and states the material terms and conditions that govern your use of the program. This agreement, together with all updates, supplements, additional terms, and all of the rules and policies collectively constitute and shall be referred to as the “Agreement” between you and Increment Technologies.
                  By accessing the program, you agree to be legally bound by this agreement. If you do not agree to the terms of service and conditions of use stated herein, please immediately leave this site.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <Footer layer={1} {...this.props}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  TermsAndConditionsContainer: {
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%'
  },
  SectionContainer: {
    width: '100%',
  },
  SectionTitleContainer: {},
  SectionTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
    marginTop: 10
  },
  SectionTwoTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
  },
  SectionDescriptionContainer: {},
  SectionDescriptionTextStyle: {
    textAlign: 'justify',
    fontSize: BasicStyles.standardFontSize
  },
});

export default TermsAndConditions;
