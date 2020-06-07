import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Animated,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {MaterialIndicator} from 'react-native-indicators';
import * as Animatable from 'react-native-animatable';

import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
//import {PinchGestureHandler, State} from 'react-native-gesture-handler';

import ModalHeader from '../ModalHeader';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const Partners = props => {
  const {
    partnerData,
    setOpenModal,
    setPartnerProfileData,
    onePartnerAtATime,
    setOnePartnerAtATime,
    homeActivity,
    setHomeActivity,
    loadPartner,
    setOpenFilterModal,
    indexToRender,
    setIndexToRender,
    setPartnerToRender,
    partnerToRender,
    setPreviewData,
    setPreviewModal,
    setMoveNextView,
    openPreviewModal,
    setOpenPreviewModal,
    videoPreviewData,
    setVideoPreviewData,
  } = props;
  const [header, setHeader] = useState(false);

  const scrollView = useRef();
  const bounceButton = useRef();
  const viewEffect = useRef();
  const [volume, setVolume] = useState(true);

  const openProfile = item => {
    setVolume(true);
    setPartnerProfileData(item);
    setOpenModal(true);
  };

  const handleUndo = () => {
    setPartnerToRender(prev => {
      --prev;
      return prev;
    });
    const array = partnerToRender - 1;
    setOnePartnerAtATime(partnerData[array]);
    setVolume(true);
    scrollView.current.scrollTo();
  };

  const handleNextPartner = () => {
    bounceButton.current.rotate(800);
    setMoveNextView(true);

    setTimeout(() => {
      setMoveNextView(false);
    }, 1000);
    setPartnerToRender(prev => {
      ++prev;
      return prev;
    });

    if (partnerToRender + 1 >= partnerData.length) {
      //remove view and load new data
      setPartnerToRender(0);
      loadPartner();
    } else {
      const array = partnerToRender + 1;
      setOnePartnerAtATime(partnerData[array]);
      scrollView.current.scrollTo();
    }
  };

  const handleImagePreivew = path => {
    const img = [
      {
        source: {
          uri: path,
        },
      },
    ];
    setPreviewData(img);
    setPreviewModal(true);
  };

  let view = (
    <View style={{flex: 1}}>
      <ScrollView
        style={styles.screen}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ref={scrollView}>
        <View style={{width: '100%', height: 50, backgroundColor: '#fff'}} />
        <SafeAreaView>
          <View style={styles.topHeader}>
            <Animatable.Text
              style={{
                fontFamily: Fonts.poppins_bold,
                color: Colors.grey_darken,
                fontSize: 16,
                textTransform: 'uppercase',
              }}>
              {onePartnerAtATime.profession +
                ', ' +
                onePartnerAtATime.locationCity +
                ', ' +
                onePartnerAtATime.locationState}
            </Animatable.Text>
          </View>
        </SafeAreaView>
        <View style={styles.topHeader_2}>
          <View style={{width: '50%'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 25,
              }}>
              {onePartnerAtATime.fName}
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={openProfile.bind(this, onePartnerAtATime)}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: onePartnerAtATime.profilePhoto,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Animated.View style={styles.container} ref={viewEffect}>
          <TouchableWithoutFeedback
            onPress={handleImagePreivew.bind(this, onePartnerAtATime.image1)}>
            <Image
              source={{uri: onePartnerAtATime.image1}}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableWithoutFeedback>
        </Animated.View>
        {onePartnerAtATime.salesVideo !== '' && (
          <View style={styles.container}>
            <View style={{position: 'absolute', zIndex: 1, padding: 10}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setVolume(prev => {
                    //let newPrev = !prev;
                    return !prev;
                  });
                }}>
                <Icon
                  name={volume ? 'ios-volume-off' : 'ios-volume-high'}
                  size={30}
                  color="#e0e0e0"
                />
              </TouchableWithoutFeedback>
            </View>

            <TouchableWithoutFeedback
              onPress={() => {
                setVideoPreviewData({uri: `${onePartnerAtATime.salesVideo}`});
                setOpenPreviewModal(true);
              }}>
              <Video
                source={{
                  uri: onePartnerAtATime.salesVideo,
                }}
                style={{height: '100%', width: '100%', borderRadius: 10}}
                onBuffer={() => {
                  //  console.log('buff');
                }}
                onError={() => {
                  //  console.log('error');
                }}
                resizeMode="cover"
                paused={false}
                repeat={true}
                defaultMuted={true}
                muted={volume}
                //  fullScreenOnLongPress={false}
              />
            </TouchableWithoutFeedback>
          </View>
        )}

        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={handleImagePreivew.bind(this, onePartnerAtATime.image2)}>
            <Image
              source={{
                uri: onePartnerAtATime.image2,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={handleImagePreivew.bind(this, onePartnerAtATime.image3)}>
            <Image
              source={{
                uri: onePartnerAtATime.image3,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={handleImagePreivew.bind(this, onePartnerAtATime.image4)}>
            <Image
              source={{
                uri: onePartnerAtATime.image4,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={handleImagePreivew.bind(this, onePartnerAtATime.image5)}>
            <Image
              source={{
                uri: onePartnerAtATime.image5,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
      <View style={styles.floatingButtonsLeft}>
        <View style={{alignSelf: 'flex-end'}}>
          <TouchableWithoutFeedback onPress={handleNextPartner}>
            <Animatable.View style={styles.button} ref={bounceButton}>
              <Icon name="md-close" size={40} color="#000" />
            </Animatable.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.floatingButtonsRight}>
        <View>
          {partnerToRender !== 0 && (
            <TouchableWithoutFeedback onPress={handleUndo}>
              <View style={styles.button}>
                <Icon name="ios-undo" size={40} color={Colors.pink} />
              </View>
            </TouchableWithoutFeedback>
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              scrollView.current.scrollTo();
              setOpenFilterModal(true);
            }}>
            <View style={styles.button}>
              <Icon name="ios-funnel" size={40} color={Colors.green} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={openProfile.bind(this, onePartnerAtATime)}>
            <Animatable.View
              style={styles.button}
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite">
              <Icon name="md-eye" size={40} color={Colors.purple_darken} />
            </Animatable.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      {homeActivity ? (
        <MaterialIndicator
          color={Colors.purple_darken}
          style={{marginTop: 30}}
        />
      ) : (
        partnerData.length !== 0 && view
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtonsLeft: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  floatingButtonsRight: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    marginBottom: 20,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 100,
    height: 60,
    width: 60,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    elevation: 5,
    marginTop: 20,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },

  topHeader: {
    marginTop: 10,
    width: '100%',
  },

  topHeader_2: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
    bottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  container: {
    borderRadius: 10,
    height: 400,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
    marginBottom: 40,
  },
});

export default Partners;
