import React, { useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import Slider from 'rn-range-slider';
import Thumb from 'modules/sliders/Thumb';
import Rail from 'modules/sliders/Rail';
import RailSelected from 'modules/sliders/RailSelected';
import Not from 'modules/sliders/Notch';
import Label from 'modules/sliders/Label';
import { connect } from 'react-redux';

const SliderScreen = (props) => {

  const [low, setLow] = useState(100);
  const [high, setHigh] = useState(9000);
  const [min, setMin] = useState(100);
  const [max, setMax] = useState(9000);
  const renderThumb = useCallback(() => <Thumb props={props}/>, []);
  const renderRail = useCallback(() => <Rail props={props}/>, []);
  const renderRailSelected = useCallback(() => <RailSelected props={props}/>, []);
  const renderLabel = useCallback(value => <Label text={value} props={props}/>, []);
  const renderNotch = useCallback(() => <Not props={props}/>, []);

  useEffect(() => {
    props.setRange({low, high})
  }, [low, high, props.setRange])

  return (
  <View>
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
  </View>
  )
}


const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setRange: (range) => dispatch(actions.setRange(range))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SliderScreen)