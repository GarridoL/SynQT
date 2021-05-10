import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
export default {
  ScrollView: {
    flex: 1
  },
  MainContainer: {
    flex: 1,
    backgroundColor: Color.white,
    zIndex: 0
  },
  footerIcon: {
    marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  sliderContainer: {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%'
  },
}