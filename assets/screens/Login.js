import React, { useState } from 'react';
import { ActivityIndicator, Button, KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View, Text, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../../AuthContext';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const state = useContext(AuthContext);

    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            state.setLoginState(true,email);
            navigation.goBack();
        } catch(error) {
            console.log(error);
            alert("Sign in Failed: "+ error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Thank you for registering. You can now Login.');
        } catch(error) {
            console.log(error);
            alert("Sign in Failed: "+ error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView>
        <View style={{ alignItems: 'center' }}>

                <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                <ImageBackground source={require("../images/pub.jpg")} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 350, width: '100%' }} blurRadius={2}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <Text style={{ fontSize: 30, fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowRadius: 10 }}>Pub</Text>
                        <Text style={{ fontSize: 30, fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowRadius: 10 }}>Hub</Text>
                    </View>
                    <Ionicons name={'beer'} size={100} color={'orange'} />
                    </View>

                    <Text style={{fontSize: 20,color: 'white',marginTop: 5,fontStyle: 'italic',textShadowColor: 'black', textShadowRadius: 5,}}>Uppsala Nation Pub's</Text>
                </ImageBackground>
                </View>
            

            {/* Title */}
            <Text style={{ color: 'black', fontWeight: 'bold', letterSpacing: 1, fontSize: 40, marginTop:20 }}>Login</Text>



            {/* Form */}
            <View style={{ alignItems: 'center', width: '80%', marginTop: 40 }}>
                <View style={{  padding: 20, borderRadius: 30, width: '100%' }}>
                    <TextInput 
                        placeholder='Email' 
                        placeholderTextColor='black' 
                        onChangeText={(text) => setEmail(text)}
                        style={{ color: 'black', borderWidth:2, borderColor:'black', padding: 10, borderRadius:25 }}
                    />
                    <TextInput 
                        secureTextEntry={true}
                        placeholder='Password' 
                        placeholderTextColor='black' 
                        onChangeText={(text) => setPassword(text)}
                        style={{ color: 'black', borderWidth:2, borderColor:'black', padding: 10, borderRadius:25, marginTop:10 }}
                    />
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={{ width: '100%' }}>
                        <View style={styles.buttonWrapper}>
                            <Button title="Login" onPress={signIn} />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <Button title="Create Account" onPress={signUp} />
                        </View>
                    </View>
                )}
            </View>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        width: '100%',
        marginBottom: 20
    },
});
