import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
export default {
  Tab: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    height: 50,
    fontSize: 20,
    borderColor: Color.primary
  },
  MenuClicked: {
    width: '50%',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
  },
  Menu: {
    width: '50%',
    textAlign: 'center',
    alignItems: 'center'
  },
  Information: {
    width: '50%',
    textAlign: 'center',
    alignItems: 'center',
    borderColor: Color.primary,
  },
  InformationClicked: {
    width: '50%',
    borderLeftWidth: 1,
    textAlign: 'center',
    alignItems: 'center',
    borderColor: Color.primary,
    backgroundColor: Color.primary
  },
}