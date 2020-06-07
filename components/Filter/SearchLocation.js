import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Picker} from '@react-native-community/picker';

import {MaterialIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';
import Loader from '../../components/Loader';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import TextInputComponent from '../TextInputComponent';
import _ from 'lodash';

import * as appAction from '../../store/actions/appAction';

const SearchLocation = (props) => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [activityIndicatorLocation, setActivityIndicatorLocation] = useState(
    false,
  );

  const {
    setSearchByState,
    setSearchByCity,
    openSearchStateCityView,
    setOpenSearchStateCityView,
  } = props;

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';

  const handleSearch = async (value) => {
    setSearch(value);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${value}&key=${myApiKey}`,
    );
    const resData = await response.json();
    setSearchData(resData.results);
    console.log(resData);
    //let newAdressArray = search.split(',');
  };

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
        //await dispatch(appAction.getCities(locationState));
        setOpenSearchStateCityView(false);
        setSearchByCity(locationCity);
        setSearchByState(locationState);
        setActivityIndicatorLocation(false);
      },
      (error) => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const formatText = (item) => {
    const new_address = item.plus_code;
    if (item.plus_code !== undefined) {
      const number_of_strings = item.plus_code.compound_code.split(',');

      if (number_of_strings.length === 3) {
        const first_val = number_of_strings[0].split(' ')[1];
        const last_val = number_of_strings[2];

        return first_val + ',' + last_val;
      } else {
        const first_val = number_of_strings[0].split(' ')[1];
        const last_val = number_of_strings[1];
        return first_val + ' ' + last_val;
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openSearchStateCityView}>
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
          <TouchableOpacity
            onPress={() => {
              setOpenSearchStateCityView(false);
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 20,
                marginTop: 20,
                paddingBottom: 10,
                marginLeft: 10,
                width: 30,
              }}>
              X
            </Text>
          </TouchableOpacity>
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
                  marginRight: 10,
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
        </SafeAreaView>
      </View>
      <View style={{width: '90%', marginHorizontal: 20, alignItems: 'center'}}>
        <TextInputComponent
          placeholder={'Search State or City'}
          onChangeText={handleSearch}
          value={search}
          autoFocus
        />
      </View>
      <View style={{marginHorizontal: 20}}>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={searchData}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listView}
              onPress={() => {
                console.log(item);
                setSearch(item.formatted_address);
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.poppins_regular,
                }}>
                {formatText(item)}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          style={{height: '100%'}}
        />
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
  listView: {
    flexDirection: 'column',
    padding: 5,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
});

export default SearchLocation;
