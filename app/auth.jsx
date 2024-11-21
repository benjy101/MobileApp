import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

const API_URL = 'https://mcmapi-main-d097772.d2.zuplo.dev';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordInputRef = useRef(null);

  const validateInput = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty or whitespace.');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Password cannot be empty or whitespace.');
      return false;
    }
    return true;
  };

  // Function to handle login
  const handleLogin = async () => {
    if (!validateInput()) return;

    
  const passwordInputRef = useRef(null);

  useLayoutEffect(() => {
    passwordInputRef.current = passwordInputRef.current; // This line is crucial for ensuring the ref is updated correctly
  }, []);

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Login successful!');
        
      } else {
        Alert.alert('Login Failed', data.message || 'Incorrect username or password.');
      }
    } catch (error) {
      console.error('Login error:', error); 
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.image} />
      <Text style={styles.title}>Enter Your Login Credentials</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => {
          if (passwordInputRef.current) {
            passwordInputRef.current.focus();
          }
        }} 
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          ref={passwordInputRef} 
          returnKeyType="done"
          onSubmitEditing={handleLogin} 
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible((prev) => !prev)}
          style={styles.passwordToggle}>
          <Text>{passwordVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.loginButton, loading && styles.disabledButton]}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loginButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
