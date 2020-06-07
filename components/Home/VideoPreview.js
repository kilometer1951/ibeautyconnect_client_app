import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Colors from '../../contants/Colors';

const VideoPreview = props => {
  const {openPreviewModal, setOpenPreviewModal, videoPreviewData} = props;

  const onClose = () => {
    setOpenPreviewModal(false);
  };

  console.log(videoPreviewData);

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };
  return (
    <Modal
      swipeToClose={true}
      onClosed={onClose}
      isOpen={openPreviewModal}
      onClosingState={onClosingState}>
      <View style={styles.screen}>
        <View
          style={{
            zIndex: 1,
            position: 'absolute',
            width: '100%',
            marginTop: 20,
            padding: 20,
            marginLeft: 10,
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              onClose();
            }}>
            <Icon
              name="md-close"
              size={30}
              style={{alignSelf: 'flex-start'}}
              color="white"
            />
          </TouchableWithoutFeedback>
        </View>
        <Video
          source={videoPreviewData}
          style={styles.video}
          resizeMode="cover"
          onBuffer={() => {
            console.log('buff');
          }}
          onError={() => {
            console.log('error');
          }}
          resizeMode="contain"
          muted={false}
          repeat={true}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPreview;
