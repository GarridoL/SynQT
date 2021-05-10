import NfcManager, {Ndef} from 'react-native-nfc-manager';
import { Helper } from 'common';
import API from 'services/api';
import { Vibration, Linking, ToastAndroid } from 'react-native';

export default {
  tag: null,
  parsedUID: null,
  parsedText: null,
  scan(callback){
      NfcManager.registerTagEvent(tag => {
        console.log('Tag Discovered', tag);
        Vibration.vibrate(1000);
        this.tag = tag;
        let url = this._parseUri(tag);
        if (url) {
            Linking.openURL(url)
              .catch(err => {
                  console.warn(err);
              })
        }

        let text = this._parseText(tag);
        if(text == null || text == ''){
          ToastAndroid.show('NFC failed to read!', ToastAndroid.LONG);
          return
        }
        let splitpayload = text.split(Helper.delimeter);
        this.parsedText = splitpayload;

        let nfcUID = this._parseUID(tag);
        this.parsedUID = nfcUID;
        // this.setState({modal: true});
        this._stopDetection();
        let parameter = {
          title: splitpayload[0],
          merchant: splitpayload[1],
          batch_number: splitpayload[2],
          manufacturing_date: splitpayload[3],
          code: splitpayload[4],
          website: splitpayload[5],
          nfc: nfcUID,
        }
        callback(parameter)
      }).then(result => {
          //  alert(console.log('registerTagEvent OK', result))
      })
      .catch(error => {
        console.warn('registerTagEvent fail', error)
      })
  },
  _stopDetection(){
    NfcManager.unregisterTagEvent()
        .then(result => {
            console.log('unregisterTagEvent OK', result)
        })
        .catch(error => {
            console.warn('unregisterTagEvent fail', error)
        })
  },
  _clearMessages(){
      this.tag = null;
  },
  _parseUri(tag){
      try {
          if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
              return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
          }
      } catch (e) {
          console.log(e);
      }
      return null;
  },
  _parseText(tag){
      try {
          if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
              return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
          }
      } catch (e) {
          console.log(e);
      }
      return null;
  },
  _parseUID(tag){
      try {
          if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
              return (tag.id);
          }
      } catch (e) {
          console.log(e);
      }
      return null;
  }
}