// App.jsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// screens/LoginScreen.jsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      navigation.navigate("Home", { prof: res.data });
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professor Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderRadius: 10, marginBottom: 15 },
});

// screens/HomeScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, Linking } from "react-native";
import axios from "axios";

export default function HomeScreen({ route }) {
  const { prof } = route.params;
  const [schedule, setSchedule] = useState([]);
  const day = new Date().toLocaleString("en-US", { weekday: "long" });

  useEffect(() => {
    axios.get(`http://localhost:5000/schedule/${prof._id}/${day}`)
      .then(res => setSchedule(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <View style={styles.profileCard}>
        <Image source={{ uri: prof.profilePic }} style={styles.profileImage} />
        <Text style={styles.name}>{prof.name}</Text>
        <Text style={styles.subjects}>Subjects: {prof.subjects.join(", ")}</Text>
      </View>

      <Text style={styles.heading}>Today's Schedule ({day}):</Text>
      <FlatList
        data={schedule}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.lectureCard}>
            <Text style={styles.time}>{item.time}</Text>
            <Text>Section: {item.section}</Text>
            <Text>Room: {item.roomNo}</Text>
            <Text>Subject: {item.subject}</Text>
            <Text onPress={() => Linking.openURL(`tel:${item.crPhone}`)}>CR: {item.crName} ({item.crPhone})</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  subjects: { fontSize: 16, color: "gray" },
  heading: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  lectureCard: { padding: 15, borderWidth: 1, borderRadius: 10, marginBottom: 10, backgroundColor: "#f9f9f9" },
  time: { fontWeight: "bold" },
});
