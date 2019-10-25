import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text, View, Item} from 'native-base';
import moment from 'moment';
import {DatePickerAndroid, DatePickerIOS, Platform, TimePickerAndroid, TouchableOpacity} from 'react-native';
import Panel from '../../components/panel';

export default class DatePickerField extends Component {
  static defaultProps = {
    timeZoneOffsetInHours: (-1) * ((new Date()).getTimezoneOffset() / 60),
  };
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    timeZoneOffsetInHours: PropTypes.number,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.onDateChange = this.onDateChange.bind(this);
    this.showTimePicker = this.showTimePicker.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
  }

  onDateChange(date) {
    this.props.updateValue(this.props.attributes.name, date);
  }

  showTimePicker = async (stateKey) => {
    const {attributes} = this.props;
    const currentDate = attributes.value ? new Date(attributes.value) : new Date();
    try {
      const {action, minute, hour} = await TimePickerAndroid.open({
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes(),
      });
      if (action === TimePickerAndroid.timeSetAction) {
        const date = currentDate;
        date.setHours(hour);
        date.setMinutes(minute);
        this.onDateChange(date);
      }
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };
  showDatePicker = async (stateKey) => {
    const {attributes} = this.props;
    const currentDate = attributes.value ? new Date(attributes.value) : new Date();
    try {
      const {action, year, month, day} = await DatePickerAndroid.open(
          {
            date: currentDate,
            minDate: attributes.minDate && new Date(attributes.minDate),
            maxDate: attributes.maxDate && new Date(attributes.maxDate),
          }
      );
      if (action !== DatePickerAndroid.dismissedAction) {
        const currentHour = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const date = new Date(year, month, day);
        if (currentHour) {
          date.setHours(currentHour);
        }
        if (currentMinutes) {
          date.setMinutes(currentMinutes);
        }
        this.onDateChange(date);
      }
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  render() {
    const {theme, attributes, ErrorComponent} = this.props;
    const value = (attributes.value && new Date(attributes.value)) || null;
    const mode = attributes.mode || 'datetime';
    return (
        <View>
          <Text style={{color: theme.labelActiveColor}}>{attributes.label}</Text>
          {(Platform.OS === 'ios') ?
              <View
                  style={{
                    backgroundColor: theme.pickerBgColor,
                    borderBottomColor: theme.inputBorderColor,
                    borderBottomWidth: theme.borderWidth,
                    marginHorizontal: 10,
                    marginVertical: 0,
                    marginLeft: 15,
                  }}
              >
                <TouchableOpacity
                    onPress={() => this.panel.toggle()}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                >
                  <View
                      style={{
                        flexDirection: 'row',
                      }}
                  >
                    {
                      (mode ?
                          (mode === 'date'
                              || mode === 'datetime')
                          : true) &&
                      <View
                          style={{
                            marginHorizontal: 5,
                          }}
                      >
                        <Text>
                          {(value && moment(value).format('ll')) || 'None'}
                        </Text>
                      </View>
                    }
                    {
                      (mode ?
                          (mode === 'time'
                              || mode === 'datetime')
                          : true) &&
                      <View
                          style={{
                            marginHorizontal: 5,
                          }}
                      >
                        <Text>
                          {(value && moment(value).format('LT')) || 'None'}
                        </Text>
                      </View>
                    }
                  </View>
                </TouchableOpacity>
                <ErrorComponent {...{attributes, theme}} />
                <Panel
                    ref={(c) => {
                      this.panel = c;
                    }}
                >
                  <DatePickerIOS
                      date={value || new Date()}
                      mode={mode}
                      maximumDate={attributes.maxDate && new Date(attributes.maxDate)}
                      minimumDate={attributes.minDate && new Date(attributes.minDate)}
                      timeZoneOffsetInMinutes={this.props.timeZoneOffsetInHours * 60}
                      onDateChange={this.onDateChange}
                  />
                </Panel>
              </View>
              :
              <View>
                {
                  (attributes.mode === 'date'
                      || attributes.mode === 'datetime')
                  &&
                  <TouchableOpacity
                      style={theme.inputContainerStyle}
                      onPress={this.showDatePicker}
                  >
                    <View style={theme.inputStyle}>
                      <Text style={value ? {color: theme.pickerColorSelected} : {color: theme.inputColorPlaceholder}}>
                        {(value && moment(value).format('ll')) || 'Date'}
                      </Text>
                    </View>
                    <ErrorComponent {...{attributes, theme}} />
                  </TouchableOpacity>
                }
                {
                  (attributes.mode === 'time'
                      || attributes.mode === 'datetime')
                  &&
                  <TouchableOpacity
                      style={theme.inputContainerStyle}
                      onPress={this.showTimePicker}
                  >
                    <Item style={{flex: 1,}}>
                      <Text>
                        {(value && moment(value).format('LT')) || 'Time'}
                      </Text>
                    </Item>
                    <ErrorComponent {...{attributes, theme}} />
                  </TouchableOpacity>
                }
              </View>
          }
        </View>
    );
  }
}
