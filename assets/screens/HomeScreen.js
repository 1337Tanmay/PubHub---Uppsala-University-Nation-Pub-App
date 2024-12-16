import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ImageBackground, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import openPubs from './Nations';
import fetchRating from './fetchRating'; // Ensure this path is correct

export default function App({ navigation }) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [openPubsNow, setOpenPubsNow] = useState([]);
  const [closedPubsNow, setClosedPubsNow] = useState([]);
  const [openingTodayPubs, setOpeningTodayPubs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    categorizePubs();
  }, [currentDateTime]); // Calls categorizePubs directly

  const categorizePubs = async () => { // Make this function async
    const currentDay = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    let openPubsNowTemp = [];
    let closedPubsNowTemp = [];
    let openingTodayPubsTemp = [];

    const ratingPromises = openPubs.map(async (pub) => {
      const rating = await fetchRating(pub.name); // Fetch rating for each pub
      return { ...pub, averageRating: rating }; // Append rating to pub object
    });

    const pubsWithRatings = await Promise.all(ratingPromises); // Wait for all ratings

    pubsWithRatings.forEach(pub => {
      const openingHours = pub.openingHours[currentDay];
      if (openingHours && openingHours.length > 0) {
        const [openTime, closeTime] = openingHours[0].split('-');
        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);
        const currentHour = parseInt(currentTime.split(':')[0]);
        const currentMinute = parseInt(currentTime.split(':')[1]);

        if ((currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) &&
            (closeHour > openHour ? (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) : true)) {
          openPubsNowTemp.push({ ...pub, openTime, closeTime });
        } else if (currentHour < openHour || (currentHour === openHour && currentMinute < openMinute)) {
          openingTodayPubsTemp.push({ ...pub, openTime, closeTime });
        } else {
          closedPubsNowTemp.push({ ...pub, openTime, closeTime });
        }
      } else {
        closedPubsNowTemp.push(pub);
      }
    });

    setOpenPubsNow(openPubsNowTemp);
    setClosedPubsNow(closedPubsNowTemp);
    setOpeningTodayPubs(openingTodayPubsTemp);
  };
  

  const renderOpen = () => {
    if (openPubsNow.length > 0) {
      return openPubsNow.map((pub, index) => (
        <Pressable key={index} onPress={() => navigation.push('PubScreen', { pub })}>
          <View style={styles.pubContainer}>
            <Image style={{ width: 80, height: 80, marginBottom: 10 }} source={pub.Logo} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.greenDot} />
              <Text style={styles.pubName}>{pub.name + " "}</Text>
              <Text style={styles.ratingText}>
                {pub.averageRating ? pub.averageRating.toFixed(1) : "0.0"} <Ionicons name="star" size={15} color="gold" />
              </Text>
            </View>
            <Text style={styles.openPubsTime}>
              Opens at {pub.openTime} - Closes at {pub.closeTime}
            </Text>
          </View>
        </Pressable>
      ));
    } else {
      return (
        <View>
          <Text style={{ color: 'black', fontSize: 20, fontStyle: 'italic' }}>No pubs are currently open</Text>
        </View>
      );
    }
  };
  
  const renderOpeningToday = () => {
    if (openingTodayPubs.length > 0) {
      return openingTodayPubs.map((pub, index) => (
        <Pressable key={index} onPress={() => navigation.push('PubScreen', { pub })}>
          <View style={styles.pubContainer}>
            <Image style={{ width: 80, height: 80, marginBottom: 10 }} source={pub.Logo} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.yellowDot} />
              <Text style={styles.pubName}>{pub.name + " "}</Text>
              <Text style={styles.ratingText}>
                {pub.averageRating ? pub.averageRating.toFixed(1) : "0.0"} <Ionicons name="star" size={15} color="gold" />
              </Text>
            </View>
            <Text style={styles.openingTodayPubsTime}>
              Opens at {pub.openTime} - Closes at {pub.closeTime}
            </Text>
          </View>
        </Pressable>
      ));
    } else {
      return (
        <View>
          <Text style={{ color: 'black', fontSize: 20, fontStyle: 'italic' }}>All of today's pubs are open</Text>
        </View>
      );
    }
  };
  
  const renderClosed = () => {
    if (closedPubsNow.length > 0) {
      return closedPubsNow.map((pub, index) => (
        <Pressable key={index} onPress={() => navigation.push('PubScreen', { pub })}>
          <View style={styles.pubContainer}>
            <Image style={{ width: 80, height: 80, marginBottom: 10 }} source={pub.Logo} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.redDot} />
              <Text style={styles.pubName}>{pub.name + " "}</Text>
              <Text style={styles.ratingText}>
                {pub.averageRating ? pub.averageRating.toFixed(1) : "0.0"} <Ionicons name="star" size={15} color="gold" />
              </Text>
            </View>
            <Text style={styles.closedPubsTime}>
              Opens at {pub.openTime} - Closes at {pub.closeTime}
            </Text>
          </View>
        </Pressable>
      ));
    } else {
      return (
        <View>
          <Text style={{ color: 'black', fontSize: 20, fontStyle: 'italic' }}>No closed pubs to display</Text>
        </View>
      );
    }
  };
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.Logo}>
          <ImageBackground source={require("../images/pub.jpg")} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 300, width: '100%' }} blurRadius={2}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 30, fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowRadius: 10 }}>Pub</Text>
                <Text style={{ fontSize: 30, fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowRadius: 10 }}>Hub</Text>
              </View>
              <Ionicons name={'beer'} size={100} color={'orange'} />
            </View>

            <Text style={styles.Bio}>Uppsala Nation Pub's</Text>
          </ImageBackground>

        </View>


        <Text style={styles.Home}>Home</Text>
        <Text style={styles.desc}>🍻 Welcome to Uppsala University Nation Pubs! 🍔 Explore the best pubs & eateries in town! 🎉</Text>
        <Text style={{ fontSize: 15, fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>Opening times may vary, contact the pub for further information or visit their website</Text>

        <View style={styles.Status}>
          <Text style={styles.pubsStatusTitle}>Open Pubs</Text>
          <View style={{ height: 5, width: '100%', backgroundColor: 'lightgreen', shadowColor: 'green', shadowOpacity: 0.8, shadowRadius: 10, elevation: 3 }}></View>

          <View style={styles.pubStatusContainer}>
            {renderOpen()}
          </View>

          <Text style={styles.pubsStatusTitle}>Opening Later</Text>
          <View style={{ height: 5, width: '100%', backgroundColor: 'yellow', shadowColor: 'yellow', shadowOpacity: 0.8, shadowRadius: 10, elevation: 3 }}></View>

          <View style={styles.pubStatusContainer}>
            {renderOpeningToday()}
          </View>

          <Text style={styles.pubsStatusTitle}>Closed Pubs</Text>
          <View style={{ height: 5, width: '100%', backgroundColor: 'red', shadowColor: 'red', shadowOpacity: 0.8, shadowRadius: 10, elevation: 3 }}></View>

          <View style={styles.pubStatusContainer}>
            {renderClosed()}
          </View>

        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  pubContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    padding: 20,
    width: 300,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3
  },
  pubStatusContainer: {
    padding: 30,
    alignItems: 'center',
  },
  Home: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textDecorationLine: 'underline'
  },
  desc: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center'
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 5,
    shadowColor: 'green',
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3
  },
  yellowDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'yellow',
    marginRight: 5,
    shadowColor: 'yellow',
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 5,
    shadowColor: 'red',
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3
  },
  Status: {
    width: '90%',
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3
  },
  pubsStatusTitle: {
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    width: '100%'
  },
  pubName: {
    fontWeight: 'bold',
  },
  openPubsTime: {
    fontStyle: 'italic',
  },
  openingTodayPubsTime: {
    fontStyle: 'italic',
    color: 'orange',
  },
  closedPubsTime: {
    fontStyle: 'italic',
  },
  Bio: {
    fontSize: 20,
    color: 'white',
    marginTop: 5,
    fontStyle: 'italic',
    textShadowColor: 'black',
    textShadowRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  Logo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
});
