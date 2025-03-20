/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState, } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

} from 'react-native';

import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";


function App() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef(null);
  const [videoText, setVideoText] = useState('Старт');

  async function reqPermission() {
    const permission = await requestPermission();
  }

  function startingVideoRecording(cam) {
    cam.current.startRecording({
      onRecordingFinished: async (video) => {
        const path = video.path;
        await CameraRoll.saveAsset(`file://${path}`, {
          type: 'video',
        });
      },
      onRecordingError: (error) => console.error(error),
    });
    setVideoText('Стоп');
  }

  async function stoppingVideoRecording(cam) {
    await cam.current.stopRecording();
    setVideoText('Старт');
  }

  useEffect(()=>{
    reqPermission();
  },[]);

  if (!hasPermission || !device) {
    return (
    <View>
      <Text>Error</Text>
    </View>
  )}

  return (
    <View style = {styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        video={true}
      />
      <TouchableOpacity style = {[styles.snapContainer]}
        onPress = {async() =>{
          if (camera.current){
            const photo = await camera.current.takePhoto();
            await CameraRoll.saveAsset(`file://${photo.path}`, {
              type: 'photo',
            });
            console.log(photo);
          }
        }}
        >
        <Text>Фото</Text>
    </TouchableOpacity>

    <TouchableOpacity style = {[styles.snapContainer]}
        onPress = {async() =>{
          if (camera.current){
            if (videoText == 'Старт'){
              startingVideoRecording(camera);
            } else {
              stoppingVideoRecording(camera);
            }
          }
        }}
        >
        <Text>{videoText}</Text>
    </TouchableOpacity>    
  </View>
  )
}



const styles = StyleSheet.create({
  absoluteFill: {
    flex:1,
  },
  container: {
    flex: 1,
    justifyContent:'flex-end',
  },
  snapContainer: {
    borderWidth: 2,
    borderColor: '#ff0000',
    height: 70,
    width: 70,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    //position: 'relative',
    //top: 180,
    //flex: 1,
  },
  cam: {
    height: '100%',
    //flex: 1,
    //marginTop: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },  
});

export default App;
