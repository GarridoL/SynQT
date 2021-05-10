import {StyleSheet} from 'react-native';
import { Color } from 'common';

const styles = StyleSheet.create({
  Circle: {
    height:30,
    width: 30,
    borderRadius: 15,
  },
  SettingTileContainer: {
    // height: 130,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderBottomWidth: 1,
    borderColor: Color.lightGray,
  },
  ThemeDetailsContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  ThemeTitleContainer: {},
  ThemeTitleTextStyle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  ThemeColorsContainer: {},
  ThemeColorsTextStyle: {
    fontSize: 15,
  },
  ColorsContainer: {
    flexDirection: 'row',
  },
  ColorContainer: {
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  IconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '17%',
    paddingRight: '3%',
    marginTop: 10
  },
});

export default styles;
