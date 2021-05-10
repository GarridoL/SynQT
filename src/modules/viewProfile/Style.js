import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
export default {
  TextInput: {
    marginTop: 15,
    width: '95%',
    height: 55,
    borderColor: Color.gray,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 50,
    padding: 10
  },
  TopView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  BottomView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  TextStyle: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 15
  },
  circleImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderColor: Color.primary,
    borderWidth: 3,
    overflow: "hidden",
  },
  actionBtn: {
    height: 30,
    backgroundColor: Color.primary,
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
}