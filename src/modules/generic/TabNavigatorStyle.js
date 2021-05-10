import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
export default {
  footerIcon: {
    marginTop: Platform.OS == 'ios' ? 30 : 0
  }
}