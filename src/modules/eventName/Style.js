import { Color } from 'common';
import { Dimensions, Platform } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  Container: {
    backgroundColor: 'white',
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: 15,
    height: height - 70
  },
  // Date: {
  //   borderRadius: 6,
  //   height: 25,
  //   padding: 10,
  //   borderWidth: .5,
  //   borderColor: Color.warning,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   marginRight: 3
  // },
  Distance: {
    backgroundColor: Color.primary,
    borderRadius: 6,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: .5,
    borderColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 3
  },
  Rate: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: .5,
    borderColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 3
  },
  StarContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 35,
    borderWidth: .5,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  Star: {
    height: 25,
    width: 25,
    borderRadius: 50,
    backgroundColor: '#30F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  }
}
