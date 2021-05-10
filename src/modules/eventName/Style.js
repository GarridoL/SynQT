import { Color } from 'common';
import { Dimensions } from 'react-native';
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
  Date: {
    borderRadius: 6,
    position: 'absolute',
    right: width - 215,
    height: 25,
    width: '25%',
    padding: 6,
    borderWidth: .5,
    borderColor: Color.warning,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  Distance: {
    backgroundColor: Color.primary,
    borderRadius: 6,
    height: 18,
    position: 'absolute',
    right: width - 273,
    width: 55,
    borderWidth: .5,
    borderColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  Rate: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 18,
    position: 'absolute',
    right: width - 330,
    width: 55,
    borderWidth: .5,
    borderColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  StarContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 18,
    position: 'absolute',
    right: 10,
    width: 50,
    borderWidth: .5,
    borderColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  Star: {
    height: 15,
    width: 15,
    borderRadius: 8,
    backgroundColor: '#30F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  }
}
