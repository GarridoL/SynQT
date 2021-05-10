import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
export default {
  Container: {
    width: '100%',
    paddingTop: 22,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  Image: {
    width: '45%',
    height: '100%',
    borderRadius: 15
  },
  Text: {
    marginLeft: 20,
    width: 200,
    height: 100
  },
  Title: {
    fontWeight: 'bold',
  },
  Price: {
    color: '#5842D7'
  },
  Tab: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 0.3,
    height: 50,
    fontSize: 20,
    borderColor: '#828282'
  },
  MenuClicked: {
    width: '50%',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: '#5842D7',
  },
  Menu: {
    width: '50%',
    textAlign: 'center',
    alignItems: 'center'
  },
  Information: {
    width: '50%',
    borderLeftWidth: 1,
    textAlign: 'center',
    alignItems: 'center',
    borderColor: '#828282',
  },
  InformationClicked: {
    width: '50%',
    borderLeftWidth: 1,
    textAlign: 'center',
    alignItems: 'center',
    borderColor: '#828282',
    backgroundColor: '#5842D7'
  },
  ImageMain: {
    height: height - 109,
    width: '100%',
    borderRadius: 20
  }
}