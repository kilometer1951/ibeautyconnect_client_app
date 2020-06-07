import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  Keyboard,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {MaterialIndicator} from 'react-native-indicators';
//import Toast from 'react-native-root-toast';
//import useSocket from 'use-socket.io-client';

import Icon from 'react-native-vector-icons/Ionicons';
import {TabHeading, Tab, Tabs} from 'native-base';
import * as appAction from '../store/actions/appAction';

import ModalHeader from '../components/ModalHeader';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from '../components/ButtonComponent';
import MessageModal from '../components/MessageModal';
import TextInputComponent from '../components/TextInputComponent';
import PartnerImages from '../components/Home/PartnerImages';
import VideoPreview from '../components/Home/VideoPreview';
import PartnerVideos from '../components/Home/PartnerVideos';
import PartnerServices from '../components/Home/PartnerServices';
import Reviews from '../components/Home/Reviews';
import PartnerAccountModalHeader from '../components/Home/PartnerAccountModalHeader';
import {URL} from '../socketURL';
import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const PartnerAccountModal = props => {
  const user = useSelector(state => state.authReducer.user);
  const socket = io(URL);

  //const [socket] = useSocket('http://localhost:5002');
  //connect socket
  //socket.connect();

  const [imagesData, setImagesData] = useState([]);
  const [activity, setActivity] = useState(true);
  const [videosData, setVideosData] = useState([]);
  const [partnerReview, setPartnerReview] = useState([]);
  const [activityVideos, setActivityVideos] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const [activityReviews, setActivityReviews] = useState(false);
  const [videoPreviewData, setVideoPreviewData] = useState({});

  const [totalRating, setTotalRating] = useState('');

  const {
    setOpenModal,
    openModal,
    setPartnerProfileData,
    partnerProfileData,
    setHasCart,
    setOpenModalOrder,
    tabToRender,
  } = props;

  const loadImages = async () => {
    const userId = partnerProfileData._id;
    setActivity(true);
    const response = await appAction.getImages(userId, 1);
    if (!response.status) {
      //  console.log('error parsing server');
      return;
    }
    setImagesData(response.images);
    setActivity(false);
  };

  const loadVideos = async () => {
    const userId = partnerProfileData._id;
    setActivityVideos(true);
    const response = await appAction.getVideos(userId, 1);
    if (!response.status) {
      //  console.log('error parsing server');
      return;
    }
    setVideosData(response.videos);
    setActivityVideos(false);
  };

  const loadReviews = async () => {
    const partnerId = partnerProfileData._id;
    setActivityReviews(true);
    const response = await appAction.getReviews(partnerId, user.user._id);
    //  console.log(response);
    if (!response.status) {
      //  console.log('error parsing server');
      return;
    }
    setTotalRating(response.totalRating);
    setPartnerReview(response.reviews);
    setActivityReviews(false);
  };

  useEffect(() => {
    loadImages();
  }, []);
  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    loadReviews();
  }, []);

  const onClosingState = state => {
    //  console.log('the open/close of the swipeToClose just changed');
  };

  return (
    <Modal animationType="slide" transparent={false} visible={openModal}>
      <ModalHeader
        headerTitle={''}
        modal_to_close="partner_modal"
        setOpenModalPartner={setOpenModal}
      />
      <View style={{marginBottom: 10}}>
        <PartnerAccountModalHeader
          partnerProfileData={partnerProfileData}
          setOpenMessageModal={setOpenMessageModal}
        />
      </View>

      <Tabs
        tabBarUnderlineStyle={{
          backgroundColor: Colors.purple_darken,
          height: 1,
        }}
        initialPage={tabToRender === 'services' ? 2 : 0}>
        <Tab
          heading={
            <TabHeading>
              <Text style={styles.tabTextStyle}>Portfolio</Text>
            </TabHeading>
          }>
          {activity ? (
            <View
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{marginTop: 30}}
              />
            </View>
          ) : (
            <PartnerImages
              appAction={appAction}
              partnerProfileData={partnerProfileData}
              imagesData={imagesData}
              setImagesData={setImagesData}
              userId={partnerProfileData._id}
            />
          )}
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{marginLeft: 5}}>Videos</Text>
            </TabHeading>
          }>
          {activity ? (
            <View
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{marginTop: 30}}
              />
            </View>
          ) : (
            <PartnerVideos
              appAction={appAction}
              partnerProfileData={partnerProfileData}
              videosData={videosData}
              setVideosData={setVideosData}
              userId={partnerProfileData._id}
              setOpenPreviewModal={setOpenPreviewModal}
              setVideoPreviewData={setVideoPreviewData}
            />
          )}
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{marginLeft: 5}}>Services</Text>
            </TabHeading>
          }>
          <PartnerServices
            services={partnerProfileData.services}
            partnerId={partnerProfileData._id}
            setOpenModal={setOpenModal}
            setHasCart={setHasCart}
            setOpenModalOrder={setOpenModalOrder}
          />
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{marginLeft: 5}}>Reviews</Text>
            </TabHeading>
          }>
          {activity ? (
            <View
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{marginTop: 30}}
              />
            </View>
          ) : (
            <Reviews
              partnerReview={partnerReview}
              partnerProfileData={partnerProfileData}
              activityReviews={activityReviews}
              totalRating={totalRating}
            />
          )}
        </Tab>
      </Tabs>

      <MessageModal
        openMessageModal={openMessageModal}
        setOpenMessageModal={setOpenMessageModal}
        partnerProfileData={partnerProfileData}
      />

      <VideoPreview
        openPreviewModal={openPreviewModal}
        setOpenPreviewModal={setOpenPreviewModal}
        videoPreviewData={videoPreviewData}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  modalStyle: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  professionTag: {
    backgroundColor: Colors.blue,
    borderRadius: 30,
    padding: 8,
    flexDirection: 'row',
  },
  professionTagText: {
    fontSize: 12,
    fontFamily: Fonts.poppins_regular,
    color: Colors.midnight_blue,
    paddingRight: 10,
    marginLeft: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  tabTextStyle: {marginLeft: 5, fontFamily: Fonts.poppins_regular},
});

export default PartnerAccountModal;
