import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Audio } from 'expo-av';

// https://github.com/expo/playlist-example

export default function MediaPlayerScreen({ route, navigation }: RootTabScreenProps<'MediaPlayer'>) {
  const { title } = route.params as any;

  // sound stuff:
  const [sound, setSound]: any = React.useState();

  const playSound = async () => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      //require('../assets/audio/fight-club.mp3'),
      { uri: 'https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3' },
      { shouldPlay: true }
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }
  
  const stopSound = async () => {
    await sound.stopAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  // render:
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Media Player</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/MediaPlayerScreen.tsx" title={title} />
      <View style={{flexDirection:'row'}}>
        <Button title="Play" onPress={playSound} />
        <View style={{margin:5}}></View>
        <Button title="Stop" onPress={stopSound} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
