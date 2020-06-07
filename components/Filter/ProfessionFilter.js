import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Picker} from '@react-native-community/picker';

import Modal from 'react-native-modalbox';
import {MaterialIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';
import Loader from '../../components/Loader';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import * as appAction from '../../store/actions/appAction';

const ProfessionFilter = (props) => {
  const professions = useSelector((state) => state.appReducer.professions);

  const {
    searchByProfession,
    setSearchByProfession,
    openProfessionModal,
    setOpenProfessionModal,
    showLoader,
  } = props;

  let responseView;

  const onClose = () => {
    setOpenProfessionModal(false);
  };

  const onClosingState = (state) => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const handleSelectedState = async () => {
    console.log('selected');
  };

  const appendLabel = (name) => {
    if (name === 'Esthetician') {
      return '(Make up, Skin care, facials .....)';
    }
    if (name === 'Cosmetologist') {
      return '(Hairstylist, Nail technician .....)';
    }
    if (name === 'Barber') {
      return '(Style and Shave , Dress, Groom .....)';
    }
    if (name === 'Tattoo Artist') {
      return '(Decorative Tattoos .....)';
    }
    if (name === 'Fitness Trainer') {
      return '(Workout, Yoga, Strength Training .....)';
    }
    if (name === 'Massage Therapist') {
      return '(Relieve Pain, Rehabilitate Injuries .....)';
    }
    if (name === 'Chiropractor') {
      return '(Spinal Adjustments,  Realign the Bones and Joints .....)';
    }
    if (name === 'Yoga Instructor') {
      return '';
    }
  };

  const profession = professions.map((profession, index) => {
    return (
      <Picker.Item
        label={profession.name + ' ' + appendLabel(profession.name)}
        value={profession.name}
        key={index}
      />
    );
  });

  return (
    <Modal
      style={styles.modal}
      isOpen={openProfessionModal}
      position="bottom"
      swipeToClose={false}
      backdropPressToClose={false}
      onClosed={onClose}>
      <View style={styles.topHeader}>
        <TouchableWithoutFeedback
          onPress={() => {
            setSearchByProfession(
              searchByProfession === ''
                ? professions[0].name
                : searchByProfession,
            );
            setOpenProfessionModal(false);
          }}>
          <View style={{display: showLoader ? 'none' : 'flex'}}>
            <Text style={{fontFamily: Fonts.poppins_regular}}>Done</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bottomHeader}>
        {showLoader ? (
          <View
            style={{
              paddingRight: 20,
            }}>
            <MaterialIndicator color={Colors.pink} size={40} />
          </View>
        ) : (
          <Picker
            selectedValue={searchByProfession}
            style={{height: '100%', width: '100%'}}
            onValueChange={(itemValue, itemIndex) => {
              setSearchByProfession(itemValue);
            }}>
            {profession}
          </Picker>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '30%',
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

export default ProfessionFilter;
