import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const CancelledItems = props => {
  const {openItemsModal, setOpenItemsModal} = props;
  const items = useSelector(state => state.appReducer.cancelledOrders);
  const [subTotal, setSubTotal] = useState(0.0);
  const [total, setTotal] = useState(0);

  const closeModal = () => {
    setOpenItemsModal(false);
  };

  const getTotal = () => {
    console.log();
    let count_sub_total = 0;
    for (let i = 0; i < items.items.length; i++) {
      let pricePerItem = parseFloat(
        items.items[i].services.servicePricePerHour,
      );

      count_sub_total += parseFloat(pricePerItem);
    }
    setSubTotal(count_sub_total.toFixed(2));
    setTotal((count_sub_total + parseFloat(items.comfort_fee)).toFixed(2));
  };

  const onOpened = () => {
    getTotal();
  };

  return (
    <Modal
      style={styles.modal}
      isOpen={openItemsModal}
      onClosed={closeModal}
      swipeToClose={false}
      onOpened={onOpened}
      entry="bottom">
      <View style={styles.header}>
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
                <Icon name="md-close" size={20} />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '60%',
                marginLeft: 20,
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 19}}>
                {props.headerTitle}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <FlatList
            data={items.items}
            renderItem={({item, index}) => (
              <View style={styles.listView}>
                <View style={styles.serviceContainer}>
                  <View style={styles.leftContainer}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 19,
                      }}>
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
                </View>
              </View>
            )}
            keyExtractor={item => item._id}
          />
        </View>

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            height: '25%',
            paddingTop: 20,
            borderTopWidth: 1,
            paddingHorizontal: 20,
            borderColor: '#e0e0e0',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 10,
            }}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
              Subtotal
            </Text>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
              ${items.subTotal}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 10,
            }}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
              Comfort fee
            </Text>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
              ${items.comfort_fee}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 25}}>
              Total
            </Text>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 25}}>
              ${items.total}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 25}}>
              Returned
            </Text>
            <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 25}}>
              ${items.client_cancellation_fee_received}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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

export default CancelledItems;
