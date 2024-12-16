import React, { useContext } from 'react';
import { View, Pressable, Text, StyleSheet, ImageBackground } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import LoginScreen from './Login';



const Body = ({ state, navigation }) => {
  return (
    <View style={styles.buttonWrapper}>
      {state.loginState ? (
        <LogoutButton onPress={() => state.setLoginState(false)} />
      ) : (
        <LoginButton onPress={() => navigation.navigate('LoginScreen')} />
      )}
    </View>
  );
};

const LogoutButton = ({ onPress }) => {
  return (
    <Pressable style={[styles.button, { backgroundColor: '#dc3545' }]} onPress={onPress}>
      <Text style={styles.buttonText}>Logout</Text>
    </Pressable>
  );
};

const LoginButton = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Login</Text>
    </Pressable>
  );
};

export default function ProfileScreen() {
  const state = useContext(AuthContext);
  const navigation = useNavigation();

  return (


<ImageBackground source={require("../images/pub.jpg")} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }} blurRadius={2}>
      <View style={{ backgroundColor: 'black', justifyContent: 'center', alignItems: 'row' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 30, fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowRadius: 10 }}>Pub</Text>
                <Text style={{ fontSize: 30, fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowRadius: 10 }}>Hub</Text>
              </View>
              <Ionicons name={'beer'} size={100} color={'orange'} />
            </View>
        <Body  style ={{paddingTop: 20}} state={state} navigation={navigation} />
      </View>

    </ImageBackground>
  )}

  
const styles = StyleSheet.create({
    buttonWrapper: {
      width: '100%',
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    Bio: {
      fontSize: 18,
      marginTop: 10,
      color: 'white',
      textAlign: 'center',
    },
  });
