import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView,TextInput, Button, Keyboard, StyleSheet, Image, Linking, ImageBackground, SafeAreaView, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import MapComponent from './Components/MapComponent';
import { Ionicons } from '@expo/vector-icons';
import { Rating, AirbnbRating } from 'react-native-ratings';
import {openPubs} from './Nations';


import { AuthContext } from '../../AuthContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import fetchRating from './fetchRating'; // Import fetchRating

export default function PubDetail({ route }) {
     const userReview = useRef(''); 
     const userRating = useRef(0); // Default rating
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0); // Initialize average rating state
    const Tab = createMaterialTopTabNavigator();

    
    useEffect(() => {
        const fetchReviews = async () => {
            const { pub } = route.params;
            const reviewsRef = collection(FIRESTORE_DB, 'Pubs', pub.name, "Reviews");
            const querySnapshot = await getDocs(reviewsRef);
            const reviewsArray = querySnapshot.docs.map(doc => doc.data());
            setReviews(reviewsArray);

            // Fetch average rating using fetchRating
            const avgRating = await fetchRating(pub.name);
            setAverageRating(avgRating);
        };

        fetchReviews();
    }, [route.params.pub]);

    const handlePhonePress = () => {
      const url = `tel:${pub.ContactInformation}`;
      Linking.canOpenURL(url).then(supported => {
          if (supported) {
              Linking.openURL(url);
          } else {
              console.log("Don't know how to open URI: " + url);
          }
      });
  };


  const handleMapPress = () => {
    const { pub } = route.params;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pub.Address)}`;
    Linking.openURL(url);
  };

    const addReview = async () => {
        const { pub } = route.params;
    if(userReview.current.length>0) {
            const data = {
        userName: state.userName,
        heading: userReview.current,
        rating: userRating.current,
                createdAt: serverTimestamp(),
            };
            const reviewsRef = collection(FIRESTORE_DB, 'Pubs', pub.name, 'Reviews');
            try {
                const docRef = await addDoc(reviewsRef, data);
                console.log("Document written with ID: ", docRef.id);
        userReview.current = '';
                Keyboard.dismiss();
                // Update reviews state with the new review
                setReviews(prevReviews => [...prevReviews, data]);
                // Optionally update average rating locally or refetch
                const updatedAvgRating = await fetchRating(pub.name);
                setAverageRating(updatedAvgRating);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

  const AddReviewComponent = () => {
    return(
      <View style={{marginTop:50, justifyContent:'center', alignItems:'center', padding: 20}}>
          <AirbnbRating
              ratingCount={5}
              defaultRating={3}
              onFinishRating={(rating) => {userRating.current = rating}}/>

          <TextInput
            style={{borderRadius:5, backgroundColor:'white', shadowColor: 'black', shadowOpacity:0.2, shadowRadius:10, elevation: 3, padding:10, marginTop:10, marginBottom:10}}
            onChangeText={(text) => {userReview.current = text}}
            placeholder="Write a review..."
          />
          
          <Button title="Submit Review" onPress={addReview} />
          
        </View>
    )
  }

  const state = useContext(AuthContext);

  const { pub } = route.params;
  const json = pub.openingHours;

  const currentDateTime= new Date();
  const currentDay = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
    <ScrollView>
      <ImageBackground source= {pub.BackgroundImage}  style={{ height: 400,  justifyContent: 'center', alignItems: 'center' }}>
 
      <View style={{bottom:0, left:0, padding:5, borderTopRightRadius: 5, position:'absolute', flexDirection:'row', backgroundColor:'white'}}>
        <Text>{pub.name} {averageRating}</Text>
        <Rating
          type='custom'
          startingValue={averageRating}
          ratingCount={1}
          imageSize={18}
          readonly={true}
          style={{ marginLeft: 5 }}/>
      </View>

      <View style={{bottom:0, right:0, position:'absolute', padding:7, borderTopLeftRadius: 5, backgroundColor:'white'}}>
        <Text >{pub.location}</Text>
      </View>

    </ImageBackground>

    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
  <TouchableOpacity style={styles.phoneButton} onPress={handlePhonePress}>
    <Ionicons name="call-outline" size={24} color="white" />
  </TouchableOpacity>

  {/* <TouchableOpacity style={[styles.mapButton, { marginLeft: 10 }]} onPress={handleMapPress}>
    <Ionicons name="map-outline" size={24} color="white" />
  </TouchableOpacity>
</View> */}

<TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
  <Image
    source={require("../images/images.png")}
    style={{ width: 24, height: 24 }}
  />
</TouchableOpacity>
</View> 
<View>
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>Information</Text>
          <Text>{pub.Information}</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
  <View style={{ width: '70%', shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 10, marginTop: 15, borderRadius: 15, padding: 10 }}>
    <Text style={{ textAlign: 'center' }}>Opening Hours:</Text>
    {Object.entries(json).map(([day, hours]) => (
      <View key={day} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        {day === currentDay ? <Text style={{ fontWeight: 'bold' }}>{day}:</Text> : <Text>{day}:</Text>}
        {hours.length > 0 ? <Text>{hours}</Text> : <Text>Closed</Text>}
      </View>
    ))}
  </View>
</View>  
  
        <View style={{padding:15, marginTop:15}}>
          <Text style={{textAlign:'center'}}>Address: {pub.Address}</Text>
          <Text style={{textAlign:'center'}}>Phone: {pub.ContactInformation}</Text>
          <Text style={{textAlign:'center'}}>Email: {pub.Email}</Text>
        </View>
      </View>

        <View style={{width:'100%', height:400}}>
          <MapComponent/>
        </View>
      

      <View style = {{alignItems:'center'}}>  
      <View style={{ padding: 30, paddingTop: 5, width: '90%', backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 10, elevation: 3, marginTop: 30, borderRadius: 15 }}>
        
        <Text style={{  fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>Reviews</Text>
        {/* Display the reviews */}
        {reviews.map((review, index) => (
          <View style={{ marginTop: 15, backgroundColor: 'white', padding: 10, borderRadius: 5 }} key={index}>
            <Text style={{fontWeight: 'bold'}}>{review.userName}</Text>
            
            {/* <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Anonymous Review: </Text> */}
            <Rating
              type='custom'
              style={{ width: 75 }}
              readonly
              startingValue={review.rating}
              imageSize={15} />
            <Text style={{ marginTop: 5 }}>{review.heading}</Text>
          </View>
        ))}
      </View>
    </View>

        {state.loginState === true ? <AddReviewComponent/> : <Text style={{fontSize:20, paddingTop: 30, textAlign:'center', paddingBottom: 30}}>Login to post reviews</Text>}


      
    </ScrollView>
    </KeyboardAvoidingView>


  )
}

const styles = StyleSheet.create({
  mapButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 120,
    zIndex: 999,
  },
  phoneButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
