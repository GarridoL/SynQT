import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import Slider from 'rn-range-slider';
import Thumb from 'modules/sliders/Thumb';
import Rail from 'modules/sliders/Rail';
import RailSelected from 'modules/sliders/RailSelected';
import Notch from 'modules/sliders/Notch';
import Label from 'modules/sliders/Label';
import { connect } from 'react-redux';

const SliderScreen = () => {

  const [low, setLow] = useState(100);
  const [high, setHigh] = useState(900);
  const [min, setMin] = useState(100);
  const [max, setMax] = useState(900);

  const renderThumb = useCallback(() => <Thumb/>, []);
  const renderRail = useCallback(() => <Rail/>, []);
  const renderRailSelected = useCallback(() => <RailSelected/>, []);
  const renderLabel = useCallback(value => <Label text={value}/>, []);
  const renderNotch = useCallback(() => <Notch/>, []);

  return <View>
    <Slider
      min={min}
      max={max}
      step={1}
      disableRange={false}
      floatingLabel={true}
      allowLabelOverflow={true}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      renderLabel={renderLabel}
      renderNotch={renderNotch}
      onValueChanged={(low, high) => {setLow(low), setHigh(high)}}
    />
  </View>;
};
const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setRange: (range) => dispatch(actions.setRange(range)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SliderScreen)