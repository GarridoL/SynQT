import { Color, BasicStyles } from 'common';
import { Dimensions, Platform } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  ModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  }
}