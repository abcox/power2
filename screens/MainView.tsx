import React, { useCallback, useState, useEffect } from 'react';
import {
    ImageBackground,
    SectionList,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootTabScreenProps } from '../types';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const getImageUrlFromId = ({ id, pixels = 600, grayscale = false }: any) => {
    return { uri: `https://picsum.photos/id/${id}/${pixels}?${grayscale ? 'grayscale' : ''}` };
};

const onItemClick = (data: any, navigation: any) => {     // todo: review type any
    //alert(`${data.title} pressed!`)
    navigation.navigate('MediaPlayer', {title: data.title})
}

const DATA = [
    {
        title: null,
        data: [{ title: 'Welcome, Adam' }]
    },
    {
        title: null,
        data: [{
            title: 'Meet Your Coach: Solmaz Barghgirs',
            imageUrlId: 154,
        }]
    },
    {
        title: 'Discover More Courses',
        data: [{
            title: 'ULTIMATE EDGE',
            subtitle: 'The #1 Self-Improvement of...',
            category: 'Relationships',
            imageUrlId: 177,
            contentType: 'video',
            clickable: true
        }, {
            title: 'TIME OF YOUR LIFE',
            subtitle: 'Eliminate Your "To-Do" List and Make T...',
            category: 'Productivity',
            imageUrlId: 829,
            contentType: 'video',
            clickable: true
        }, {
            title: 'ULTIMATE RELATIONSHIP PROGRAM',
            subtitle: '10 Days to Creating Lasting & Impactful Changes',
            category: 'Love & Relationships',
            imageUrlId: 380,
            contentType: 'video',
            clickable: true
        }, {
            title: 'PERSONAL POWER',
            subtitle: '30-Day Program for Unlimited Success',
            category: 'Peak Performance',
            imageUrlId: 741,
            contentType: 'audio',
            clickable: true
        }, {
            title: 'MASTERING INFLUENCE',
            subtitle: '10 Steps to Master the Art of Enrolment',
            category: 'Career & Business',
            imageUrlId: 871,
            contentType: 'audio',
            clickable: true
        }, {
            title: 'CREATING LASTING CHANGE',
            subtitle: 'Learn the Strategies to...',
            category: 'Leadership',
            imageUrlId: 865,
            contentType: 'audio',
            clickable: true
        }, {
            title: 'THE BODY YOUR DESERVE',
            subtitle: 'Sustainable Weight Loss Strategies t...',
            category: 'Health & Energy',
            imageUrlId: 685,
            contentType: 'audio',
            clickable: true
        }, {
            title: 'MONEY MATTERS',
            subtitle: 'Adopt the Tactics to Thrive in the On...',
            category: 'Relationships',
            imageUrlId: 866,
            contentType: 'audio',
            clickable: true
        }]
    }
];

// review TouchableHighlight and see if better to use Pressable
const Item = ({ data, navigation }: any) => (
    <View style={styles.item}>
        <TouchableHighlight onPress={() => data?.clickable && onItemClick(data, navigation)}>
            <ImageBackground
                source={getImageUrlFromId({ id: data.imageUrlId })}
                resizeMode="cover"
                style={styles.image}
                imageStyle={styles.itemBackgroundImageStyle}>
                <View>
                    <Text style={styles.title}>{data.title}</Text>
                    {data.subtitle && <Text style={styles.subtitle}>{data.subtitle}</Text>}
                    {data.category &&
                        <View style={styles.categoryTextAdornment}>
                            <View style={styles.categoryTextAdornmentLeft}>
                                <Text style={styles.categoryText}>{data.category}</Text>
                            </View>
                            <View style={styles.categoryTextAdornmentRight}>
                                <MaterialIcons
                                    //name="info-circle"
                                    size={25}
                                    //color={Colors[colorScheme].text}
                                    //style={{ marginRight: 15 }}
                                    style={styles.mediaType} name="headset" color="white" />
                            </View>
                        </View>}
                </View>
            </ImageBackground>
        </TouchableHighlight>
    </View>
);

const CourseListView = ({ navigation }: any) => (
    <View style={styles.container}>
        <SectionList
            sections={DATA}
            keyExtractor={(item, index) => `${item}${index}`}
            renderItem={({ item }) => <Item data={item} navigation={navigation} />}
            renderSectionHeader={({ section: { title } }) => (title ? null :
                <Text style={styles.header}>{title}</Text>
            )}
        />
    </View>
);

export default function MainView({ navigation }:any) {
    const [appIsReady, setAppIsReady] = useState(false);

    //alert('navigation: ', navigation);

    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Pre-load fonts, make any API calls you need to do here
                //await Font.loadAsync(customFonts);
                // Artificially delay for two seconds to simulate a slow loading
                // experience. Please remove this if you copy and paste the code!
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    //let [fontsLoaded] = useFonts({
    //  Oswald_400Regular,
    //});
    let [fontsLoaded] = Font.useFonts({
        //'Oswald': require('./assets/Oswald-Regular.ttf'),
        //'Inter-SemiBoldItalic': require('../../../assets/Inter-SemiBoldItalic2.otf'),
        //'Oswald-Regular': require('../../../assets/Oswald-Regular.ttf'),
        'Oswald-Medium': require('../assets/fonts/oswald/Oswald-Medium.ttf'),
        //'Inter-SemiBoldItalic': 'https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12',
    });

    //_loadFontsAsync;

    // if (!fontsLoaded) {
    //   return <AppLoading />;
    // }

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onLayout={onLayoutRootView}>
            {/* <Text style={{ fontFamily: 'Inter-SemiBoldItalic', fontSize: 40 }}>Oswald Regular 400</Text> */}
            <CourseListView navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#222',
        color: '#fff',
        justifyContent: 'center',
    },
    text: {
        color: '#fff'
    },
    item: {
        backgroundColor: "#222",
        //margin: 0,
        paddingLeft: 20,
        paddingRight: 20,
        //marginBottom: -5,
        marginVertical: 8,
        borderRadius: 5,
    },
    itemBackgroundImageStyle: {
        borderRadius: 6,
        opacity: .8,
    },
    header: {
        color: '#fff',
        //fontFamily: 'Inter-SemiBoldItalic',
        marginLeft: 35,
        fontSize: 18,
        backgroundColor: "#222"
    },
    title: {
        color: '#fff',
        fontFamily: 'Oswald-Medium',
        marginTop: 25,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 26,
        lineHeight: 30
    },
    subtitle: {
        color: '#fff',
        //fontFamily: 'Arial',
        margin: 20,
        fontSize: 18
    },
    categoryText: {
        color: '#fff',
    },
    mediaType: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 15,
    },
    categoryTextAdornmentLeft: {
        flex: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    categoryTextAdornmentRight: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    categoryTextAdornment: {
        //color: '#fff',
        //margin: 20,
        //fontSize: 12,

        flexDirection: 'row',
        //flex: 1,
        //flexWrap: 'nowrap',

        alignItems: 'center',
        //justifyContent: 'flex-start',
        //justifyContent: 'space-between',

        //pointerEvents: none,
        backgroundColor: 'rgba(52, 52, 52, .6)',
        //opacity: 0.7,
        //border: none,
        color: '#fff',
        paddingLeft: 15,
        //paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        //textAlign: center,
        //textDecoration: none,
        //display: inline-block,
        marginRight: 13,
        marginLeft: 15,
        marginBottom: 10,
        borderRadius: 100,
    },
    image: {
        flex: 1,
        height: '100%',
        justifyContent: "center",
        borderRadius: 5,
        width: '100%',
    },
});
