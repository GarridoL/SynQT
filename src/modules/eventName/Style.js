import { Color } from 'common';
import { Dimensions, Platform } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  Container: {
    width: '100%',
    backgroundColor: Color.containerBackground,
    paddingBottom: 15,
    height: height - 70
  },
  Distance: {
    borderRadius: 6,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: .5,
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
