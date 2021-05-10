import {StyleSheet, Dimensions} from 'react-native';
import {Color} from 'common';

const width = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  AddLocationContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
  },
  ButtonContainer: {
    backgroundColor: '#22B173',
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  ButtonTextStyle: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  AddressTileContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 80,
    paddingLeft: 20,
    elevation: 1,
    borderBottomWidth: 0.5,
    borderColor: '#E8E8E8',
  },
  AddressTypeContainer: {},
  AddressTypeTextStyle: {},
  AddressContainer: {},
  AddressTextStyle: {
    fontSize: 15,
  },
  CountryContainer: {},
  CountryTextStyle: {},
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  insideModalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: Color.white,
    borderRadius: 20,
    padding: 20,
    paddingBottom: 50,
    width: width - 20,
    height: 260,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // flexDirection:'row',
    // flexWrap: 'wrap',
    // alignItems: 'center',
    // justifyContent: 'flex-start'
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: Color.primaryDark,
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    textAlign: "left",
    alignItems: 'center',
    marginTop: 5,
    color: Color.primaryDark
  },
  textInput: {
    height: 40,
    borderColor: Color.gray,
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 5,
    borderRadius: 5,
    color: Color.darkGray
  },
  btnWhite: {
    height: 50,
    backgroundColor: Color.white,
    width: width - 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderColor: Color.primaryDark,
    borderWidth: 2
  },
  modalClose: {
    color: Color.white,
    fontSize: 34,
    lineHeight: 34
  },
  modalCloseContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 34,
    paddingTop: 2,
    paddingLeft: 7,
    paddingRight: 7,
    borderWidth: 1,
    borderColor: Color.white,
    borderRadius: 17,
    flexDirection: 'row',
    flexWrap: 'wrap',
    textAlign: 'left'
  }
});

export default styles;
