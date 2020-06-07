import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {Tooltip} from 'react-native-elements';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';

import {useSelector, useDispatch} from 'react-redux';

const DisplayCart = props => {
  const {
    itemPerPartner,
    openDelete,
    setOpenDeleteModal,
    subTotal,
    total,
    handleCheckOut,
  } = props;
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          data={itemPerPartner}
          renderItem={({item, index}) => (
            <View style={styles.listView}>
              <TouchableWithoutFeedback>
                <View style={styles.serviceContainer}>
                  <View style={styles.leftContainer}>
                    <Text
                      style={{fontFamily: Fonts.poppins_regular, fontSize: 19}}>
                      {item.services.serviceName}
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        fontFamily: Fonts.poppins_bold,
                        fontSize: 16,
                        color: '#9e9e9e',
                      }}>
                      ${item.services.servicePricePerHour}
                    </Text>

                    <Text
                      style={{
                        fontFamily: Fonts.poppins_bold,
                        fontSize: 16,
                        color: '#9e9e9e',
                      }}>
                      {item.services.serviceHour}
                    </Text>
                  </View>
                  <View style={styles.rightContainer}>
                    <TouchableWithoutFeedback
                      onPress={openDelete.bind(this, item._id)}>
                      <View style={styles.button}>
                        <Icon
                          name="md-trash"
                          size={30}
                          style={{marginRight: 10}}
                          color={Colors.purple_darken}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
          keyExtractor={item => item._id}
        />
      </View>

      <View
        style={{
          width: '100%',
          alignItems: 'center',
          height: '20%',
          paddingTop: 20,
        }}>
        <ButtonComponent
          moreStyles={{
            width: '80%',
            alignItems: 'flex-start',
            backgroundColor: Colors.purple_darken,
          }}
          title={'Checkout $' + total}
          onButtonPress={handleCheckOut}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'column',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: '100%',
    padding: 20,
  },
  leftContainer: {
    width: '80%',
    flexDirection: 'column',
  },
  rightContainer: {
    width: '20%',
    alignItems: 'flex-end',
  },
});

export default DisplayCart;
