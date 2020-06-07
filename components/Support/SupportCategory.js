import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Picker,
} from 'react-native';

import Modal from 'react-native-modalbox';

const SupportCategory = props => {
  const supportList = [
    'Appointment not respected',
    'Check in',
    'Reschedule',
    'Call Me',
    'Report',
    'Other',
  ];

  const {category, setOpenCategory, openCategory, setCategory} = props;

  const onClose = () => {
    setOpenCategory(false);
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const support = supportList.map((list, index) => {
    return <Picker.Item label={list} value={list} key={index} />;
  });

  return (
    <Modal
      style={styles.modal}
      isOpen={openCategory}
      position="bottom"
      swipeToClose={false}
      backdropPressToClose={false}
      onClosed={onClose}>
      <View style={styles.topHeader}>
        <TouchableWithoutFeedback
          onPress={() => {
            setCategory(category === '' ? supportList[0] : category);
            setOpenCategory(false);
          }}>
          <View>
            <Text>Done</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bottomHeader}>
        <Picker
          selectedValue={category}
          style={{height: '100%', width: '100%'}}
          onValueChange={(itemValue, itemIndex) => {
            setCategory(itemValue);
          }}>
          {support}
        </Picker>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '55%',
    width: '100%',
    borderRadius: 5,
  },
  topHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  bottomHeader: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
});

export default SupportCategory;
