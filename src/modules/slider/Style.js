import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  container: {
    flex: 1,
  },
  navSectionStyle: {
    paddingTop: 5,
    paddingBottom: 5
    // width: 200
  },
  navSectionStyleNoBorder: {
    paddingTop: 5,
    paddingBottom: 5
  },
  navSectionStyleBorderTop: {
    borderTopColor: Color.primary,
    borderTopWidth: 1
  },
  sectionHeadingStyle: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: Color.primary,
    alignItems: 'center'
  },
  footerContainer: {
    padding: 20,
    fontSize: 8
  },
  activeDrawer: {
    shadowRadius: 10,
    borderRadius: 8,
    backgroundColor: Color.containerBackground,
    width: width / 2,
    height: 40,
    flexDirection: 'row-reverse',
    paddingLeft: 10,
    alignItems: 'center'
  },
  inActiveDrawer: {
    width: width,
    height: 40,
    flexDirection: 'row-reverse',
    paddingLeft: 10,
    alignItems: 'center'
  }
};