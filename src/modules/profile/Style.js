import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
export default {
  TextInput: {
    marginTop: 15,
    width: '95%',
    height: 50,
    borderColor: Color.gray,
    borderWidth: .5,
    borderRadius: 50,
    padding: 10,
    color: 'black',
    backgroundColor: Color.white
  },
  TopView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    marginTop: 10
  },
  BottomView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  TextStyle: {
    marginTop: 15,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15
  }
}