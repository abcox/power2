// tsx version of https://github.com/expo/playlist-example/blob/master/App.js

/**
 * @flow
 */

import React, { Component } from "react";
import {
    Dimensions,
    Image,
    //Slider, DEPRECATED from core; see @react-native-community/slider
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import { Asset } from "expo-asset";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS, ResizeMode, Video } from "expo-av";
import * as Font from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";
import { Icon, PlaylistItem } from "./types";
import Slider from "@react-native-community/slider";

const PLAYLIST = [
    new PlaylistItem(
        "Comfort Fit - “Sorry”",
        "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3",
        false
    ),
    new PlaylistItem(
        "Big Buck Bunny",
        "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        true
    ),
    new PlaylistItem(
        "Mildred Bailey – “All Of Me”",
        "https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3",
        false
    ),
    new PlaylistItem(
        "Popeye - I don't scare",
        "https://ia800501.us.archive.org/11/items/popeye_i_dont_scare/popeye_i_dont_scare_512kb.mp4",
        true
    ),
    new PlaylistItem(
        "Podington Bear - “Rubber Robot”",
        "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Podington_Bear_-_Rubber_Robot.mp3",
        false
    )
];

const ICON_THROUGH_EARPIECE = "speaker-phone";
const ICON_THROUGH_SPEAKER = "speaker";

const ICON_PLAY_BUTTON = {
    uri: require("../../assets/images/media-player/play_button.png"),
    width: 34,
    height: 51
};
const ICON_PAUSE_BUTTON = {
    uri: require("../../assets/images/media-player/pause_button.png"),
    width: 34,
    height: 51
};
const ICON_STOP_BUTTON = {
    uri: require("../../assets/images/media-player/stop_button.png"),
    width: 22,
    height: 22
};
const ICON_FORWARD_BUTTON = {
    uri: require("../../assets/images/media-player/forward_button.png"),
    width: 33,
    height: 25
};
// NOTE: the old way (code)
// const ICON_BACK_BUTTON = new Icon(
//     require("./assets/images/back_button.png"),
//     33,
//     25
// );
const ICON_BACK_BUTTON = {
    uri: require("../../assets/images/media-player/back_button.png"),
    width: 33,
    height: 25
};
const ICON_LOOP_ALL_BUTTON = {
    uri: require("../../assets/images/media-player/loop_all_button.png"),
    width: 77,
    height: 35
};
// const ICON_LOOP_ONE_BUTTON = new Icon(
//     require("../../assets/images/media-player/loop_one_button.png"),
//     77,
//     35
// );
const ICON_LOOP_ONE_BUTTON = {
    uri: require("../../assets/images/media-player/loop_one_button.png"),
    width: 77,
    height: 35
};
const ICON_MUTED_BUTTON = {
    uri: require("../../assets/images/media-player/muted_button.png"),
    width: 67,
    height: 58
};
const ICON_UNMUTED_BUTTON = {
    uri: require("../../assets/images/media-player/unmuted_button.png"),
    width: 67,
    height: 58
};

const ICON_TRACK_1 = {uri:require("../../assets/images/media-player/track_1.png"), width:166, height:5};
const ICON_THUMB_1 = {uri:require("../../assets/images/media-player/thumb_1.png"), width:18, height:19};
const ICON_THUMB_2 = {uri:require("../../assets/images/media-player/thumb_2.png"), width:15, height:19};

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_ICONS = [{ id: 0, source: ICON_LOOP_ALL_BUTTON }, { id: 1, source: ICON_LOOP_ONE_BUTTON }];

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFF8ED";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 18;
const LOADING_STRING = "... loading ...";
const BUFFERING_STRING = "...buffering...";
const RATE_SCALE = 3.0;
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;

type MediaPlayerProps = {
    index: number;
    isSeeking: boolean;
    shouldPlayAtEndOfSeek: boolean;
    playbackInstance: any;


    showVideo: boolean;
    playbackInstanceName: string;
    loopingType: number;
    muted: boolean;
    playbackInstancePosition: number;
    playbackInstanceDuration: number;
    shouldPlay: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    isLoading: boolean;
    fontLoaded: boolean;
    shouldCorrectPitch: boolean;
    volume: number;
    rate: number;
    videoWidth: number;
    videoHeight: number;
    poster: boolean;
    useNativeControls: boolean;
    fullscreen: boolean;
    throughEarpiece: boolean;
}

interface MediaPlayerState {
    showVideo: boolean;
    playbackInstanceName: string;
    loopingType: number;
    muted: boolean;
    playbackInstancePosition: Nullable<number>;
    playbackInstanceDuration: Nullable<number>;
    shouldPlay: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    isLoading: boolean;
    fontLoaded: boolean;
    shouldCorrectPitch: boolean;
    volume: number;
    rate: number;
    videoWidth: number;
    videoHeight: number;
    poster: boolean;
    useNativeControls: boolean;
    fullscreen: boolean;
    throughEarpiece: boolean;
}

// REF: https://stackoverflow.com/questions/17220114/how-to-declare-a-type-as-nullable-in-typescript
type Nullable<T> = T | undefined | null; // todo: refactor to /src/global.d.ts

export default class MediaPlayer2 extends Component<MediaPlayerProps, MediaPlayerState> {

    _video: any;

    //state = { ...this.props };
    state = {
        showVideo: false,
        playbackInstanceName: LOADING_STRING,
        loopingType: LOOPING_TYPE_ALL,
        muted: false,
        playbackInstancePosition: null,
        playbackInstanceDuration: null,
        shouldPlay: false,
        isPlaying: false,
        isBuffering: false,
        isLoading: true,
        fontLoaded: false,
        shouldCorrectPitch: true,
        volume: 1.0,
        rate: 1.0,
        videoWidth: DEVICE_WIDTH,
        videoHeight: VIDEO_CONTAINER_HEIGHT,
        poster: false,
        useNativeControls: false,
        fullscreen: false,
        throughEarpiece: false
    };



    index = 0;
    isSeeking = false;
    shouldPlayAtEndOfSeek = false;
    playbackInstance = this.props.playbackInstance;

    constructor(props: MediaPlayerProps) {
        super(props);
    }

    componentDidMount() {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix, // Audio..INTERRUPTION_MODE_IOS_DO_NOT_MIX
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix, // Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
            playThroughEarpieceAndroid: false
        });
        (async () => {
            await Font.loadAsync({
                ...MaterialIcons.font,
                "cutive-mono-regular": require("../../assets/fonts/media-player/CutiveMono-Regular.ttf")
            });
            this.setState({ fontLoaded: true });
        })();
    }

    async _loadNewPlaybackInstance(playing: any) {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            // this.playbackInstance.setOnPlaybackStatusUpdate(null);
            this.playbackInstance = null;
        }

        const source = { uri: PLAYLIST[this.index].uri };
        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            shouldCorrectPitch: this.state.shouldCorrectPitch,
            volume: this.state.volume,
            isMuted: this.state.muted,
            isLooping: this.state.loopingType === LOOPING_TYPE_ONE
            // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
            // androidImplementation: 'MediaPlayer',
        };

        if (PLAYLIST[this.index].isVideo) {
            console.log(this._onPlaybackStatusUpdate);
            await this._video.loadAsync(source, initialStatus);
            // this._video.onPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
            this.playbackInstance = this._video;
            const status = await this._video.getStatusAsync();
        } else {
            const { sound, status } = await Audio.Sound.createAsync(
                source,
                initialStatus,
                this._onPlaybackStatusUpdate
            );
            this.playbackInstance = sound;
        }

        this._updateScreenForLoading(false);
    }

    _mountVideo = (component: any) => {
        this._video = component;
        this._loadNewPlaybackInstance(false);
    };

    _updateScreenForLoading(isLoading: boolean) {
        if (isLoading) {
            this.setState({
                showVideo: false,
                isPlaying: false,
                playbackInstanceName: LOADING_STRING,
                playbackInstanceDuration: null,
                playbackInstancePosition: null,
                isLoading: true
            });
        } else {
            this.setState({
                playbackInstanceName: PLAYLIST[this.index].name,
                showVideo: PLAYLIST[this.index].isVideo,
                isLoading: false
            });
        }
    }

    _onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                muted: status.isMuted,
                volume: status.volume,
                loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
                shouldCorrectPitch: status.shouldCorrectPitch
            });
            if (status.didJustFinish && !status.isLooping) {
                this._advanceIndex(true);
                this._updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    };

    _onLoadStart = () => {
        console.log(`ON LOAD START`);
    };

    _onLoad = (status: any) => {
        console.log(`ON LOAD : ${JSON.stringify(status)}`);
    };

    _onError = (error: any) => {
        console.log(`ON ERROR : ${error}`);
    };

    _onReadyForDisplay = (event: any) => {
        const widestHeight =
            (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width;
        if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
            this.setState({
                videoWidth:
                    (VIDEO_CONTAINER_HEIGHT * event.naturalSize.width) /
                    event.naturalSize.height,
                videoHeight: VIDEO_CONTAINER_HEIGHT
            });
        } else {
            this.setState({
                videoWidth: DEVICE_WIDTH,
                videoHeight:
                    (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width
            });
        }
    };

    _onFullscreenUpdate = (event: any) => {
        console.log(
            `FULLSCREEN UPDATE : ${JSON.stringify(event.fullscreenUpdate)}`
        );
    };

    _advanceIndex(forward: boolean) {
        this.index =
            (this.index + (forward ? 1 : PLAYLIST.length - 1)) % PLAYLIST.length;
    }

    async _updatePlaybackInstanceForIndex(playing: any) {
        this._updateScreenForLoading(true);

        this.setState({
            videoWidth: DEVICE_WIDTH,
            videoHeight: VIDEO_CONTAINER_HEIGHT
        });

        this._loadNewPlaybackInstance(playing);
    }

    _onPlayPausePressed = () => {
        if (this.playbackInstance != null) {
            if (this.state.isPlaying) {
                this.playbackInstance.pauseAsync();
            } else {
                this.playbackInstance.playAsync();
            }
        }
    };

    _onStopPressed = () => {
        if (this.playbackInstance != null) {
            this.playbackInstance.stopAsync();
        }
    };

    _onForwardPressed = () => {
        if (this.playbackInstance != null) {
            this._advanceIndex(true);
            this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
        }
    };

    _onBackPressed = () => {
        if (this.playbackInstance != null) {
            this._advanceIndex(false);
            this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
        }
    };

    _onMutePressed = () => {
        if (this.playbackInstance != null) {
            this.playbackInstance.setIsMutedAsync(!this.state.muted);
        }
    };

    _onLoopPressed = () => {
        if (this.playbackInstance != null) {
            this.playbackInstance.setIsLoopingAsync(
                this.state.loopingType !== LOOPING_TYPE_ONE
            );
        }
    };

    _onVolumeSliderValueChange = (value: number) => {
        if (this.playbackInstance != null) {
            this.playbackInstance.setVolumeAsync(value);
        }
    };

    _trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
        if (this.playbackInstance != null) {
            try {
                await this.playbackInstance.setRateAsync(rate, shouldCorrectPitch);
            } catch (error) {
                // Rate changing could not be performed, possibly because the client's Android API is too old.
            }
        }
    };

    _onRateSliderSlidingComplete = async (value: number) => {
        this._trySetRate(value * RATE_SCALE, value === 1);
    };

    _onPitchCorrectionPressed = async () => {
        this._trySetRate(1.0, true);
    };

    _onSeekSliderValueChange = (value: number) => {
        if (this.playbackInstance != null && !this.isSeeking) {
            this.isSeeking = true;
            this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
            this.playbackInstance.pauseAsync();
        }
    };

    _onSeekSliderSlidingComplete = async (value: number) => {
        if (this.playbackInstance != null) {
            this.isSeeking = false;
            const seekPosition = value * (this.state.playbackInstanceDuration ?? 0);
            if (this.shouldPlayAtEndOfSeek) {
                this.playbackInstance.playFromPositionAsync(seekPosition);
            } else {
                this.playbackInstance.setPositionAsync(seekPosition);
            }
        }
    };

    _getSeekSliderPosition() {
        if (
            this.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null
        ) {
            return (
                this.state.playbackInstancePosition /
                this.state.playbackInstanceDuration
            );
        }
        return 0;
    }

    _getMMSSFromMillis(millis: number) {
        const totalSeconds = millis / 1000;
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);

        const padWithZero = (number: number) => {
            const string = number.toString();
            if (number < 10) {
                return "0" + string;
            }
            return string;
        };
        return padWithZero(minutes) + ":" + padWithZero(seconds);
    }

    _getTimestamp() {
        if (
            this.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null
        ) {
            return `${this._getMMSSFromMillis(
                this.state.playbackInstancePosition
            )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
        }
        return "";
    }

    _onPosterPressed = () => {
        this.setState({ poster: !this.state.poster });
    };

    _onUseNativeControlsPressed = () => {
        this.setState({ useNativeControls: !this.state.useNativeControls });
    };

    _onFullscreenPressed = () => {
        try {
            this._video.presentFullscreenPlayer();
        } catch (error: any) {
            console.log(error.toString());
        }
    };

    // _onSpeakerPressed = () => {
    //     this.setState(
    //         state => {
    //             return { throughEarpiece: !state.throughEarpiece };
    //         },
    //         ({ throughEarpiece }) =>
    //             Audio.setAudioModeAsync({
    //                 allowsRecordingIOS: false,
    //                 interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    //                 playsInSilentModeIOS: true,
    //                 shouldDuckAndroid: true,
    //                 interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    //                 playThroughEarpieceAndroid: throughEarpiece
    //             })
    //     );
    // };

    render() {
        return !this.state.fontLoaded ? (
            <View style={styles.emptyContainer} />
        ) : (
            <View style={styles.container}>
                <View />
                <View style={styles.nameContainer}>
                    <Text style={[styles.text, { fontFamily: "cutive-mono-regular" }]}>
                        {this.state.playbackInstanceName}
                    </Text>
                </View>
                <View style={styles.space} />
                <View style={styles.videoContainer}>
                    <Video
                        ref={this._mountVideo}
                        style={[
                            styles.video,
                            {
                                opacity: this.state.showVideo ? 1.0 : 0.0,
                                width: this.state.videoWidth,
                                height: this.state.videoHeight
                            }
                        ]}
                        resizeMode={ResizeMode.CONTAIN} // Video.RESIZE_MODE_CONTAIN
                        onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
                        onLoadStart={this._onLoadStart}
                        onLoad={this._onLoad}
                        onError={this._onError}
                        onFullscreenUpdate={this._onFullscreenUpdate}
                        onReadyForDisplay={this._onReadyForDisplay}
                        useNativeControls={this.state.useNativeControls}
                    />
                </View>
                <View
                    style={[
                        styles.playbackContainer,
                        {
                            opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                        }
                    ]}
                >
                    <Slider
                        style={styles.playbackSlider}
                        //trackImage={ICON_TRACK_1.module}
                        thumbImage={ICON_THUMB_1.uri}
                        value={this._getSeekSliderPosition()}
                        onValueChange={this._onSeekSliderValueChange}
                        onSlidingComplete={this._onSeekSliderSlidingComplete}
                        disabled={this.state.isLoading}
                    />
                    <View style={styles.timestampRow}>
                        <Text
                            style={[
                                styles.text,
                                styles.buffering,
                                { fontFamily: "cutive-mono-regular" }
                            ]}
                        >
                            {this.state.isBuffering ? BUFFERING_STRING : ""}
                        </Text>
                        <Text
                            style={[
                                styles.text,
                                styles.timestamp,
                                { fontFamily: "cutive-mono-regular" }
                            ]}
                        >
                            {this._getTimestamp()}
                        </Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.buttonsContainerBase,
                        styles.buttonsContainerTopRow,
                        {
                            opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                        }
                    ]}
                >
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.wrapper}
                        onPress={this._onBackPressed}
                        disabled={this.state.isLoading}
                    >
                        <Image style={styles.button} source={ICON_BACK_BUTTON.uri} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.wrapper}
                        onPress={this._onPlayPausePressed}
                        disabled={this.state.isLoading}
                    >
                        <Image
                            style={styles.button}
                            source={
                                this.state.isPlaying
                                    ? ICON_PAUSE_BUTTON.uri
                                    : ICON_PLAY_BUTTON.uri
                            }
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.wrapper}
                        onPress={this._onStopPressed}
                        disabled={this.state.isLoading}
                    >
                        <Image style={styles.button} source={ICON_STOP_BUTTON.uri} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.wrapper}
                        onPress={this._onForwardPressed}
                        disabled={this.state.isLoading}
                    >
                        <Image style={styles.button} source={ICON_FORWARD_BUTTON.uri} />
                    </TouchableHighlight>
                </View>
                <View
                    style={[
                        styles.buttonsContainerBase,
                        styles.buttonsContainerMiddleRow
                    ]}
                >
                    <View style={styles.volumeContainer}>
                        <TouchableHighlight
                            underlayColor={BACKGROUND_COLOR}
                            style={styles.wrapper}
                            onPress={this._onMutePressed}
                        >
                            <Image
                                style={styles.button}
                                source={
                                    this.state.muted
                                        ? ICON_MUTED_BUTTON.uri
                                        : ICON_UNMUTED_BUTTON.uri
                                }
                            />
                        </TouchableHighlight>
                        <Slider
                            style={styles.volumeSlider}
                            //trackImage={ICON_TRACK_1.module}
                            thumbImage={ICON_THUMB_2.uri}
                            value={1}
                            onValueChange={this._onVolumeSliderValueChange}
                        />
                    </View>
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.wrapper}
                        onPress={this._onLoopPressed}
                    >
                        <Image
                            style={styles.button}
                            source={LOOPING_TYPE_ICONS[this.state.loopingType].source.uri}
                        />
                    </TouchableHighlight>
                </View>
                <View
                    style={[
                        styles.buttonsContainerBase,
                        styles.buttonsContainerBottomRow
                    ]}
                >
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.wrapper}
                        onPress={() => this._trySetRate(1.0, true)}
                    >
                        <View style={styles.button}>
                            <Text
                                style={[styles.text, { fontFamily: "cutive-mono-regular" }]}
                            >
                                Rate:
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <Slider
                        style={styles.rateSlider}
                        //trackImage={ICON_TRACK_1.module}
                        thumbImage={ICON_THUMB_1.uri}
                        value={this.state.rate / RATE_SCALE}
                        onSlidingComplete={this._onRateSliderSlidingComplete}
                    />
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.wrapper}
                        onPress={() => this._onPitchCorrectionPressed()}
                    >
                        <View style={styles.button}>
                            <Text
                                style={[styles.text, { fontFamily: "cutive-mono-regular" }]}
                            >
                                PC: {this.state.shouldCorrectPitch ? "yes" : "no"}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    {/* <TouchableHighlight
                        onPress={this._onSpeakerPressed}
                        underlayColor={BACKGROUND_COLOR}
                    >
                        <MaterialIcons
                            name={
                                this.state.throughEarpiece
                                    ? ICON_THROUGH_EARPIECE
                                    : ICON_THROUGH_SPEAKER
                            }
                            size={32}
                            color="black"
                        />
                    </TouchableHighlight> */}
                </View>
            {/* <View>
                <Text>
                    rate:{this.state.rate.toString()}
                </Text>
                <Text>
                    shouldCorrectPitch:'{this.state.shouldCorrectPitch.toString()}'
                </Text>
            </View> */}
                <View />
                {this.state.showVideo ? (
                    <View>
                        <View
                            style={[
                                styles.buttonsContainerBase,
                                styles.buttonsContainerTextRow
                            ]}
                        >
                            <View />
                            <TouchableHighlight
                                underlayColor={BACKGROUND_COLOR}
                                style={styles.wrapper}
                                onPress={this._onPosterPressed}
                            >
                                <View style={styles.button}>
                                    <Text
                                        style={[styles.text, { fontFamily: "cutive-mono-regular" }]}
                                    >
                                        Poster: {this.state.poster ? "yes" : "no"}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <View />
                            <TouchableHighlight
                                underlayColor={BACKGROUND_COLOR}
                                style={styles.wrapper}
                                onPress={this._onFullscreenPressed}
                            >
                                <View style={styles.button}>
                                    <Text
                                        style={[styles.text, { fontFamily: "cutive-mono-regular" }]}
                                    >
                                        Fullscreen
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <View />
                        </View>
                        <View style={styles.space} />
                        <View
                            style={[
                                styles.buttonsContainerBase,
                                styles.buttonsContainerTextRow
                            ]}
                        >
                            <View />
                            <TouchableHighlight
                                underlayColor={BACKGROUND_COLOR}
                                style={styles.wrapper}
                                onPress={this._onUseNativeControlsPressed}
                            >
                                <View style={styles.button}>
                                    <Text
                                        style={[styles.text, { fontFamily: "cutive-mono-regular" }]}
                                    >
                                        Native Controls:{" "}
                                        {this.state.useNativeControls ? "yes" : "no"}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <View />
                        </View>
                    </View>
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    emptyContainer: {
        alignSelf: "stretch",
        backgroundColor: BACKGROUND_COLOR
    },
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        backgroundColor: BACKGROUND_COLOR
    },
    wrapper: {},
    nameContainer: {
        height: FONT_SIZE * 1.5
    },
    space: {
        height: FONT_SIZE
    },
    videoContainer: {
        height: VIDEO_CONTAINER_HEIGHT
    },
    video: {
        maxWidth: DEVICE_WIDTH
    },
    playbackContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        minHeight: ICON_THUMB_1.height * 2.0,
        maxHeight: ICON_THUMB_1.height * 2.0
    },
    playbackSlider: {
        alignSelf: "stretch"
    },
    timestampRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "stretch",
        minHeight: FONT_SIZE
    },
    text: {
        fontSize: FONT_SIZE,
        minHeight: FONT_SIZE * 1.5
    },
    buffering: {
        textAlign: "left",
        paddingLeft: 20
    },
    timestamp: {
        textAlign: "right",
        paddingRight: 20
    },
    button: {
        backgroundColor: BACKGROUND_COLOR
    },
    buttonsContainerBase: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    buttonsContainerTopRow: {
        maxHeight: ICON_PLAY_BUTTON.height,
        minWidth: DEVICE_WIDTH / 2.0,
        maxWidth: DEVICE_WIDTH / 2.0
    },
    buttonsContainerMiddleRow: {
        maxHeight: ICON_MUTED_BUTTON.height,
        alignSelf: "stretch",
        paddingRight: 20
    },
    volumeContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: DEVICE_WIDTH / 2.0,
        maxWidth: DEVICE_WIDTH / 2.0
    },
    volumeSlider: {
        width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width
    },
    buttonsContainerBottomRow: {
        maxHeight: ICON_THUMB_1.height,
        alignSelf: "stretch",
        paddingRight: 20,
        paddingLeft: 20
    },
    rateSlider: {
        width: DEVICE_WIDTH / 2.0
    },
    buttonsContainerTextRow: {
        maxHeight: FONT_SIZE,
        alignItems: "center",
        paddingRight: 20,
        paddingLeft: 20,
        minWidth: DEVICE_WIDTH,
        maxWidth: DEVICE_WIDTH
    }
});