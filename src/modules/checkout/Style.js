import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
export default {
  ScrollView: {
    flex: 1
  },
  MainContainer: {
    backgroundColor: Color.white,
    zIndex: 0
  },
  footerIcon: {
    marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  TextInput: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  formControl: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    width: '100%',
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 25
  },
}