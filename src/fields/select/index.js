import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Dimensions, Modal, TouchableOpacity} from 'react-native';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Content,
  Header,
  Icon,
  Left,
  ListItem,
  Right,
  Text,
  Title,
  View,
} from 'native-base';

const deviceWidth = Dimensions.get('window').width;

export default class SelectField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  toggleModalVisible() {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  toggleSelect(value) {
    const attributes = this.props.attributes;
    const newSelected = attributes.multiple ? attributes.value : value;
    if (attributes.multiple) {
      const index = attributes.objectType ? newSelected.findIndex(option =>
          option[attributes.primaryKey] === value[attributes.primaryKey]
      ) : newSelected.indexOf(value);
      if (index === -1) {
        newSelected.push(value);
      } else {
        newSelected.splice(index, 1);
      }
    }
    this.setState({
      modalVisible: attributes.multiple ? this.state.modalVisible : false,
    }, () => this.props.updateValue(this.props.attributes.name, newSelected));
  }

  render() {
    const {theme, attributes, ErrorComponent} = this.props;
    const selectedText = attributes.multiple ?
        attributes.value.length || 'None' :
        attributes.objectType ?
            (attributes.value && attributes.value[attributes.labelKey]) || 'None'
            : attributes.value || 'None';
    if(attributes.inline)
      return this.renderInline(theme, attributes, ErrorComponent, selectedText);
    else
      return this.renderOverlay(theme, attributes, ErrorComponent, selectedText);
  }

  renderOverlay(theme, attributes, ErrorComponent, selectedText){
    return (
        <View>
          <Text style={{color: theme.labelActiveColor}}>{attributes.label}</Text>
          <ListItem icon onPress={() => this.toggleModalVisible()}
                    style={{...theme.inputContainerStyle, marginLeft: 0}}>
            <View style={{width: deviceWidth / 2, alignItems: 'flex-start'}}>
              <Text numberOfLines={1} ellipSizeMode="tail"
                    style={{color: theme.pickerColorSelected}}>{selectedText}</Text>
            </View>
            <Right style={{borderBottomWidth: 0}}>
              <Icon name="ios-arrow-forward"/>
            </Right>
          </ListItem>
          <View style={{paddingHorizontal: 15}}>
            <ErrorComponent {...{attributes, theme}} />
          </View>
          <Modal
              visible={this.state.modalVisible}
              animationType="none"
              onRequestClose={() => this.toggleModalVisible()}
          >
            <Container style={{flex: 1}}>
              <Header>
                <Left>
                  <Button
                      transparent
                      onPress={() => this.toggleModalVisible()}
                  >
                    <Icon name="arrow-back"/>
                  </Button>
                </Left>
                <Body>
                  <Title>{attributes.label || 'Select'}</Title>
                </Body>
                <Right/>
              </Header>
              <Content>
                {
                  attributes.options.map((item, index) => {
                    let isSelected = false;
                    if (attributes.multiple) {
                      isSelected = attributes.objectType ?
                          attributes.value.findIndex(option =>
                              option[attributes.primaryKey] === item[attributes.primaryKey]
                          ) !== -1 : (attributes.value.indexOf(item) !== -1);
                    }
                    return (
                        <ListItem
                            key={index}
                            onPress={() => this.toggleSelect(item)}
                        >
                          {attributes.multiple &&
                          <CheckBox
                              onPress={() => this.toggleSelect(item)}
                              checked={isSelected}
                          />
                          }
                          <Body>
                            <Text style={{paddingHorizontal: 5}}>
                              {attributes.objectType ? item[attributes.labelKey] : item}
                            </Text>
                          </Body>
                        </ListItem>);
                  })
                }
              </Content>
            </Container>
          </Modal>
        </View>
    );
  }

  renderInline(theme, attributes, ErrorComponent, selectedText){
    return (
        <View>
          <Text style={{color: theme.labelActiveColor}}>{attributes.label}</Text>
          {/*<View style={{width: deviceWidth / 2, alignItems: 'flex-start'}}>*/}
          {/*  <Text numberOfLines={1} ellipSizeMode="tail"*/}
          {/*        style={{color: theme.pickerColorSelected}}>{selectedText}</Text>*/}
          {/*</View>*/}
          <View style={{...theme.inputContainerStyle, paddingLeft: 0, paddingRight: 0}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch',}}>
              {
                attributes.options.map((item, index) => {
                  let isSelected = false;
                  if (attributes.multiple) {
                    isSelected = attributes.objectType ?
                        attributes.value.findIndex(option =>
                            option[attributes.primaryKey] === item[attributes.primaryKey]
                        ) !== -1 : (attributes.value.indexOf(item) !== -1);
                  } else {
                    let currentValue = this.props.attributes.value;
                    if(attributes.primaryKey) {
                      isSelected = this.props.attributes.value[attributes.primaryKey] === item[attributes.primaryKey];
                    } else {
                      isSelected = (Array.isArray(currentValue) ? currentValue[0]: this.props.attributes.value) === item;
                    }
                  }
                  return (
                      <TouchableOpacity
                          key={index}
                          onPress={() => this.toggleSelect(item)}
                          style={{flex: 1, justifyContent: 'center',
                            borderColor: theme.inputBorderColor,
                            borderRightWidth: theme.borderWidth,
                            backgroundColor: (isSelected ? theme.inputActiveBgColor : 'transparent')}}
                      >
                        <Text style={{alignSelf: 'center', paddingHorizontal: 10, color: (isSelected ? theme.inputActiveColor : theme.inputColor)}}>
                          {attributes.objectType ? item[attributes.labelKey] : item}
                        </Text>
                      </TouchableOpacity>);
                })
              }
            </View>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <ErrorComponent {...{attributes, theme}} />
          </View>
        </View>
    );
  }
}
