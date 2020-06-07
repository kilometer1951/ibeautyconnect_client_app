import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appAction from '../store/actions/appAction';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import RefreshNetworkError from '../components/RefreshNetworkError';

import CancelledItems from '../components/CancelledOrders/CancelledItems';

const CancellatedOrdersScreen = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  const [cancelledOrdersData, setcancelledData] = useState([]);

  const [activity, setActivity] = useState(false);
  const [openItemsModal, setOpenItemsModal] = useState(false);

  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);

  useEffect(() => {
    const getCancelledOrders = async () => {
      setActivity(true);
      const response = await appAction.getCancelledOrders(user.user._id, 1);
      setcancelledData(response.cart);
      setActivity(false);
    };
    getCancelledOrders();
  }, []);

  const handleLoadMore = async () => {
    if (!endOfFile) {
      if (!isLoadingMoreData) {
        setIsLoadingMoreData(true);
        const response = await appAction.getCancelledOrders(
          user.user._id,
          page,
        );
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
        setPage((prev) => (prev = prev + 1));
        await setcancelledData((prev) => [...prev, ...response.cart]);
      }
    }
  };

  const handleViewItemsModal = async (items) => {
    dispatch(appAction.setOrderCancelledItemsData(items));
    setOpenItemsModal(true);
  };

  let view;

  if (cancelledOrdersData.length === 0) {
    view = (
      <View
        style={{
          marginTop: '50%',
          alignItems: 'center',
          flex: 1,
        }}>
        <Icon
          name="ios-cart"
          size={30}
          color="#9e9e9e"
          style={{marginBottom: 20}}
        />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          You have not cannceled any orders
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={cancelledOrdersData}
          renderItem={({item, index}) => (
            <View style={styles.listView}>
              <View style={styles.serviceContainer}>
                <View style={styles.leftContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{uri: item.partner.profilePhoto}}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={{width: '80%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_bold,
                          fontSize: 15,
                          marginLeft: 5,
                        }}>
                        {item.partner.fName + ' ' + item.partner.lName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_light,
                          fontSize: 15,
                          marginLeft: 5,
                        }}>
                        {Moment(item.booking_date).format('MMM, D YYYY')}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_regular,
                          marginLeft: 5,
                        }}>
                        {item.partner.profession}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_regular,
                          fontSize: 15,
                          marginLeft: 5,
                          color: item.noShow ? Colors.pink : Colors.blue,
                        }}>
                        {item.cancelledBy === 'client' && 'Client Cancelled'}
                        {item.cancelledBy === 'partner' && 'No Show'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rightContainer}>
                  <TouchableWithoutFeedback
                    onPress={handleViewItemsModal.bind(this, item)}>
                    <View style={styles.button}>
                      <Icon
                        name="ios-add"
                        size={25}
                        style={{marginRight: 10}}
                        color={Colors.pink}
                      />
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_regular,
                          marginTop: 2,
                        }}>
                        Expand order
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
          extraData={cancelledOrdersData}
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

  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Profile');
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  height: 30,
                  width: 30,
                  paddingTop: 4,
                  alignItems: 'center',
                }}>
                <Icon name="md-arrow-back" size={20} />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '60%',
                marginLeft: 17,
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 19}}>
                Cancelled Orders
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
      {activity ? (
        <MaterialIndicator
          color={Colors.purple_darken}
          style={{marginTop: 20}}
        />
      ) : (
        view
      )}

      <CancelledItems
        openItemsModal={openItemsModal}
        setOpenItemsModal={setOpenItemsModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: '11%',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
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
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 30,
  },
});

export default CancellatedOrdersScreen;
