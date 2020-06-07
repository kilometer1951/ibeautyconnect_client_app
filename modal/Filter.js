import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
//import Toast from 'react-native-root-toast';
import Modal from 'react-native-modalbox';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from '../components/ButtonComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import * as appAction from '../store/actions/appAction';
import {MaterialIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
//import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';

import StateFilter from '../components/Filter/StateFilter';
import CityFilter from '../components/Filter/CityFilter';
import ProfessionFilter from '../components/Filter/ProfessionFilter';

const Filter = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  const [searchByCity, setSearchByCity] = useState('');
  const [searchByState, setSearchByState] = useState('');
  const [searchByProfession, setSearchByProfession] = useState('');
  const [openStateModal, setOpenStateModal] = useState(false);
  const [openCityModal, setOpenCityModal] = useState(false);
  const [openProfessionModal, setOpenProfessionModal] = useState(false);
  const [activity, setActivity] = useState(false);
  const [no_data, setNo_data] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [activityIndicatorLocation, setActivityIndicatorLocation] = useState(
    false,
  );
  const [showLoader, setShowLoader] = useState(false);

  const {
    openFilterModal,
    setOpenFilterModal,
    setPartnerData,
    setOnePartnerAtATime,
    setIndexToRender,
    setPartnerToRender,
  } = props;

  const onCloseFilterModal = () => {
    setActivity(false);
    setNo_data(false);
    setShowIndicator(false);

    setOpenFilterModal(false);
  };

  const onValueChange = (value: string) => {
    setSearchByCity(value);
  };

  const handleFilter = async () => {
    //perform a query based on search craterial
    setActivity(true);
    setShowIndicator(true);
    const response = await appAction.applyFilter(
      searchByCity,
      searchByState,
      searchByProfession,
      user.user._id,
    );

    if (response.hasPartners) {
      //update AsyncStorage
      const userData = await AsyncStorage.getItem('@userData');
      const parseUserData = userData !== null && (await JSON.parse(userData));
      parseUserData.user.search = 'custom';
      await AsyncStorage.setItem('@userData', JSON.stringify(parseUserData));
      setIndexToRender(0);
      setPartnerToRender(0);
      setOnePartnerAtATime(response.partners[0]);
      setPartnerData(response.partners);
      setActivity(false);
      setShowIndicator(false);
      setOpenFilterModal(false);
    } else {
      setShowIndicator(false);
      setActivity(true);
      setNo_data(true);
    }
    //update AsyncStorage only if a search was found
  };

  const onOpened = async () => {
    setShowLoader(true);
    await dispatch(appAction.getStates());
    await dispatch(appAction.getProfessions());
    setShowLoader(false);
  };

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';
  const myLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        setActivityIndicatorLocation(true);
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${myApiKey}`,
        );
        const res = await response.json();
        let formatted_address = res.results[0].formatted_address;
        let newAdressArray = formatted_address.split(',');
        let address = newAdressArray[0].trim();
        let locationState = newAdressArray[2].slice(0, 3).trim();
        let locationCity = newAdressArray[1].trim();
        let postalCode = newAdressArray[2].split(`${locationState}`)[1].trim();
        await dispatch(appAction.getCities(locationState));
        setSearchByCity(locationCity);
        setSearchByState(locationState);
        setActivityIndicatorLocation(false);
      },
      (error) => {
        console.log(error);
      },
      {enableHighAccuracy: false, timeout: 45000},
    );
  };

  const resetFilter = () => {
    setSearchByCity('');
    setSearchByState('');
    setSearchByProfession('');
  };

  let view = (
    <View style={{padding: 10, flex: 1}}>
      <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
        Filter by state
      </Text>
      <TouchableWithoutFeedback onPress={() => setOpenStateModal(true)}>
        <View style={styles.dropDownList}>
          <Text
            style={{
              fontSize: 22,
              paddingLeft: 13,
              paddingBottom: 10,
              color: searchByState === '' ? '#bdbdbd' : '#000',
              marginTop: 10,
              fontFamily: Fonts.poppins_regular,
            }}>
            {searchByState !== '' ? searchByState : 'State'}
          </Text>
          <Icon
            name="ios-arrow-down"
            size={30}
            style={{marginRight: 10, marginTop: 10}}
          />
        </View>
      </TouchableWithoutFeedback>
      {searchByState !== '' && (
        <View>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
            Filter by city
          </Text>
          <TouchableWithoutFeedback onPress={() => setOpenCityModal(true)}>
            <View style={styles.dropDownList}>
              <Text
                style={{
                  fontSize: 22,
                  paddingLeft: 13,
                  paddingBottom: 10,
                  color: searchByCity === '' ? '#bdbdbd' : '#000',
                  marginTop: 10,
                  fontFamily: Fonts.poppins_regular,
                }}>
                {searchByCity !== '' ? searchByCity : 'City'}
              </Text>
              <Icon
                name="ios-arrow-down"
                size={30}
                style={{marginRight: 10, marginTop: 10}}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}

      <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
        Filter by profession
      </Text>
      <TouchableWithoutFeedback onPress={() => setOpenProfessionModal(true)}>
        <View style={styles.dropDownList}>
          <Text
            style={{
              fontSize: 22,
              paddingLeft: 13,
              paddingBottom: 10,
              color: searchByProfession === '' ? '#bdbdbd' : '#000',
              marginTop: 10,
              fontFamily: Fonts.poppins_regular,
            }}>
            {searchByProfession !== '' ? searchByProfession : 'Profession'}
          </Text>
          <Icon
            name="ios-arrow-down"
            size={30}
            style={{marginRight: 10, marginTop: 10}}
          />
        </View>
      </TouchableWithoutFeedback>
      <ButtonComponent
        moreStyles={{
          width: '100%',
          marginTop: 20,
        }}
        title="Apply filter"
        onButtonPress={handleFilter}
        disabled={searchByState === '' ? true : false}
      />
    </View>
  );

  return (
    <Modal
      style={styles.modal}
      isOpen={openFilterModal}
      onClosed={onCloseFilterModal}
      swipeToClose={openStateModal ? false : true}
      onOpened={onOpened}
      useNativeDriver={true}
      entry="top">
      <View style={{flex: 1}}>
        <View
          style={{
            borderBottomWidth: 1,
            paddingHorizontal: 10,
            borderColor: '#e0e0e0',
          }}>
          <SafeAreaView
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 40}}>
              Filter
            </Text>
            {activityIndicatorLocation ? (
              <View
                style={{
                  paddingRight: 20,
                }}>
                <MaterialIndicator color={Colors.pink} size={20} />
              </View>
            ) : (
              <TouchableWithoutFeedback onPress={myLocation}>
                <View
                  style={{
                    marginTop: 16,
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name="md-locate"
                    size={25}
                    color={Colors.purple_darken}
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_bold,
                      marginTop: 3,
                      color: Colors.purple_darken,
                    }}>
                    Use My Location
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
            {searchByState !== '' && (
              <TouchableOpacity onPress={resetFilter}>
                <View
                  style={{
                    marginTop: 16,
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name="md-refresh"
                    size={25}
                    color={Colors.purple_darken}
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_bold,
                      marginTop: 3,
                      color: Colors.purple_darken,
                    }}>
                    Reset
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </SafeAreaView>
        </View>
        {activity ? (
          <View style={{flex: 1}}>
            <MaterialIndicator
              color={Colors.purple_darken}
              style={{
                marginTop: '40%',
                display: showIndicator ? 'flex' : 'none',
              }}
            />
            {no_data && (
              <View style={{height: '100%'}}>
                <View>
                  <View
                    style={{
                      marginTop: '20%',
                      alignSelf: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <Text
                      style={{
                        alignItems: 'center',
                        fontFamily: Fonts.poppins_regular,
                        textAlign: 'center',
                        fontSize: 18,
                      }}>
                      Snap we didn't find any professional based on your filter.
                      iBeautyConnect is still growing. We are working really
                      hard to to get more licensed professionals on our platform
                      thanks.
                    </Text>
                    <Text style={{alignSelf: 'center'}} />
                  </View>
                  <ButtonComponent
                    moreStyles={{
                      width: '80%',
                      marginTop: 20,
                      alignSelf: 'center',
                    }}
                    title="Okay"
                    onButtonPress={() => {
                      setActivity(false);
                      setNo_data(false);
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        ) : (
          view
        )}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <Icon
            name="ios-arrow-up"
            size={50}
            color="#bdbdbd"
            style={{marginRight: 10}}
          />
        </View>

        <StateFilter
          searchByState={searchByState}
          setSearchByState={setSearchByState}
          openStateModal={openStateModal}
          setOpenStateModal={setOpenStateModal}
          setShowLoader={setShowLoader}
          showLoader={showLoader}
        />

        <CityFilter
          searchByCity={searchByCity}
          setSearchByCity={setSearchByCity}
          openCityModal={openCityModal}
          setOpenCityModal={setOpenCityModal}
        />

        <ProfessionFilter
          setOpenProfessionModal={setOpenProfessionModal}
          openProfessionModal={openProfessionModal}
          setSearchByProfession={setSearchByProfession}
          searchByProfession={searchByProfession}
          setShowIndicator={setShowIndicator}
          setShowLoader={setShowLoader}
          showLoader={showLoader}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
  },
  dropDownList: {
    borderColor: '#bdbdbd',
    borderRadius: 5,
    width: '100%',
    marginTop: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default Filter;
