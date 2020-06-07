import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Colors from '../contants/Colors';
import Fonts from '../contants/Fonts';

const ModalHeader = props => {
  const {
    modal_to_close,
    setOpenModalOrder,
    setOpenModalPartner,
    setOpenAppointmentModal,
    navigation,
    onClose,
  } = props;
  const closeModal = () => {
    if (modal_to_close === 'orders') {
      onClose();
      setOpenModalOrder(false);
    }
    if (modal_to_close === 'appointment') {
      setOpenAppointmentModal(false);
    }
    if (modal_to_close === 'partner_modal') {
      setOpenModalPartner(false);
    }
  };
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor:
            modal_to_close === 'partner_modal' ? '#fff' : Colors.blue,
        },
      ]}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              const options = {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              };
              ReactNativeHapticFeedback.trigger('impactLight', options);
              closeModal();
            }}>
            <View
              style={{
                marginHorizontal: 20,
                height: 30,
                width: 30,
                paddingTop: 4,
                alignItems: 'center',
              }}>
              <Icon
                name="md-close"
                size={20}
                color={modal_to_close === 'partner_modal' ? '#000' : '#fff'}
              />
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              width: '60%',
              marginLeft: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 19,
                color: '#fff',
              }}>
              {props.headerTitle}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '10%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default ModalHeader;
