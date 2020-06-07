import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const PartnerVideos = props => {
  const {
    videosData,
    setVideosData,
    appAction,
    partnerProfileData,
    userId,
    setOpenPreviewModal,
    setVideoPreviewData,
  } = props;
  const [page, setPage] = useState(1);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  //  console.log(imagesData);

  // const handleLoadMorePhotos = async () => {
  //   console.log('jj');
  //   if (!endOfFile) {
  //     setPage(prev => (prev = prev + 1));
  //     const response = await galleryActions.getImages(userId, page);
  //     console.log(response.images.length);
  //     if (!response.status) {
  //       console.log('error parsing server');
  //       return;
  //     }
  //     if (response.message === 'endOfFile') {
  //       setEndOfFile(true);
  //       return;
  //     }
  //     console.log(response.images.length);
  //     await setImagesData(prev => [...prev, ...response.images]);
  //   }
  // };

  const handleRefreshVideo = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(1);
    const response = await appAction.getVideos(userId, 1);
    if (!response.status) {
      console.log('error parsing server');
      return;
    }
    //  console.log(response);
    setVideosData(response.videos);
    setIsRefreshing(false);
  };
  //
  // const handleImagePreivew = path => {
  //   const img = [
  //     {
  //       source: {
  //         uri: path,
  //       },
  //       width: 806,
  //       height: 1020,
  //     },
  //   ];
  //   setPreviewData(prev => [...img]);
  //
  //   setPreviewModal(true);
  // };

  const renderItem = ({item}) => (
    <View style={styles.videoGrid}>
      <TouchableWithoutFeedback
        onPress={() => {
          setVideoPreviewData({uri: `${item.path}`});
          setOpenPreviewModal(true);
        }}>
        <View style={styles.videoContainer}>
          <Video
            source={{uri: `${item.path}`}}
            style={styles.video}
            onBuffer={() => {
              console.log('buff');
            }}
            onError={() => {
              console.log('error');
            }}
            resizeMode="cover"
            paused={false}
            muted={true}
            repeat={true}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  let videos;
  if (videosData.length === 0) {
    return (images = (
      <View
        style={{
          marginTop: '50%',
          flex: 1,
          width: '70%',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Icon name="ios-videocam" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
            textAlign: 'center',
          }}>
          {partnerProfileData.fName} has not added any videos of their work
        </Text>
      </View>
    ));
  }
  videos = (
    <View style={{flex: 1, marginTop: 5}}>
      <FlatList
        refreshControl={
          <RefreshControl
            onRefresh={handleRefreshVideo}
            refreshing={isRefreshing}
            title="Pull to refresh"
            tintColor={Colors.pink}
            titleColor={Colors.pink}
          />
        }
        data={videosData}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={3}
        extraData={videosData}
      />
    </View>
  );
  return <View style={{flex: 1}}>{videos}</View>;
};

const styles = StyleSheet.create({
  videoGrid: {
    marginHorizontal: 1,
  },
  videoContainer: {
    width: 136,
    height: 136,
    marginBottom: 2,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default PartnerVideos;
