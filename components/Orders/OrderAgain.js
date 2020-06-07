import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {MaterialIndicator} from 'react-native-indicators';
import * as appAction from '../../store/actions/appAction';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';
import Icon from 'react-native-vector-icons/Ionicons';

const OrderAgain = props => {
  const {
    orderAgainData,
    setPartnerProfileData_services,
    setOpenMessageModal,
    setOpenModal,
    setOpenModalOrder,
    setPartnerProfileData,
    setTabToRender,
    setOpenRatingControl,
    setRatingControlData,
    setOrderAgainData,
  } = props;

  const user = useSelector(state => state.authReducer.user);
  //const [isMounted, setIsmounted] = useState(false);
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);

  const handleServiceView = async partnerData => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setPartnerProfileData_services(partnerData);
    setTabToRender('services');
    setOpenModal(true);
    setOpenModalOrder(false);
  };

  const handleRatingView = (partnerId, cartId) => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setRatingControlData({
      partnerId,
      clientId: user.user._id,
      cartId,
    });
    setOpenRatingControl(true);
  };

  const handleLoadMore = async () => {
    if (!endOfFile) {
      if (!isLoadingMoreData) {
        setIsLoadingMoreData(true);
        const response = await appAction.getOrderAgain(user.user._id, page);
        setIsLoadingMoreData(false);
        //  console.log(response.images.length);
        if (!response.status) {
          console.log('error parsing server');
          return;
        }
        if (response.endOfFile === true) {
          setEndOfFile(true);
          return;
        }
        //  console.log(page);
        setPage(prev => (prev = prev + 1));
        await setOrderAgainData(prev => [...prev, ...response.cart]);
      }
    }
  };

  let cart;

  if (orderAgainData.length === 0) {
    return (cart = (
      <View
        style={{
          marginTop: '50%',
          alignItems: 'center',
          flex: 1,
        }}>
        <Icon name="ios-cart" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          You have not placed any orders yet
        </Text>
      </View>
    ));
  } else {
    cart = (
      <View style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orderAgainData}
          renderItem={({item, index}) => (
            <View style={styles.listView}>
              <TouchableWithoutFeedback
                onPress={handleServiceView.bind(this, item.partner)}>
                <View style={styles.serviceContainer}>
                  <View style={styles.leftContainer}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{uri: item.partner.profilePhoto}}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_bold,
                          marginLeft: 5,
                        }}>
                        {item.partner.fName + ' ' + item.partner.lName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_regular,
                          marginLeft: 5,
                        }}>
                        {item.partner.profession}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rightContainer}>
                    <TouchableWithoutFeedback
                      onPress={handleServiceView.bind(this, item.partner)}>
                      <View style={styles.button}>
                        <Icon
                          name="md-add-circle"
                          size={30}
                          style={{marginRight: 10}}
                          color={Colors.pink}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.poppins_regular,
                            marginTop: 5,
                          }}>
                          Order again
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={handleRatingView.bind(
                        this,
                        item.partner._id,
                        item._id,
                      )}>
                      <View style={styles.button}>
                        <Icon
                          name="md-star"
                          size={30}
                          style={{marginLeft: 10}}
                          color={Colors.green}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.poppins_regular,
                            marginTop: 5,
                            marginLeft: 10,
                          }}>
                          Rate order
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
          keyExtractor={item => item._id}
          extraData={orderAgainData}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          style={{marginTop: 2}}
          onMomentumScrollBegin={() => {
            handleLoadMore();
          }}
          ListFooterComponent={
            <View
              style={{
                alignItems: 'center',
                position: 'absolute',
                alignSelf: 'center',
              }}>
              {isLoadingMoreData && (
                <MaterialIndicator color={Colors.purple_darken} size={30} />
              )}
            </View>
          }
        />
      </View>
    );
  }

  return <View style={styles.screen}>{cart}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listView: {
    flexDirection: 'column',
    padding: 10,
    marginTop: 10,
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
    marginTop: 20,
    borderRadius: 10,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: '100%',
  },
  leftContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  rightContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: '30%',
    padding: 5,
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 30,
  },
});

export default OrderAgain;
