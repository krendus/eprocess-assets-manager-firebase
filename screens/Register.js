import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '../components/Input'
import { ActivityIndicator } from 'react-native-paper'
import { createUserFirebase } from '../firebase'

const Register = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [team, setTeam] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const handleSignUpResponse = (data, err) => {
    setLoading(false);
    if(data) {
      if(Platform.OS === "android") {
        ToastAndroid.show("Registration successful", ToastAndroid.SHORT)
      } else {    
          Alert.alert("Registration successful", "Registration successful");
      }
      navigation.navigate("Login");
    } else {
      if(Platform.OS === "android") {
          ToastAndroid.show(err, ToastAndroid.SHORT)
      } else {    
          Alert.alert(err, err);
      }
      console.log(err);
    }
  }
  const handleSignUp = () => {
    if(loading) return;
    setLoading(true);
    if (username && password && team && teamLead && role && organization && email && phone) {
        createUserFirebase({
          username: username.trim(),
          password,
          subDetails: JSON.stringify({
            team: team.trim(),
            teamLead: teamLead.trim(),
            email: email.trim(),
            phone: phone.trim(),
            organization: organization.trim(),
            role: role.trim(),
          })
        }, handleSignUpResponse)
    } else {
        setLoading(false);
        if(Platform.OS === "android") {
            ToastAndroid.show("Please enter required fields", ToastAndroid.SHORT)
        } else {    
            Alert.alert("Required fields", "Please enter required fields");
        }
    }
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(false)
    })
    return unsubscribe;
  }, [])
  return (
    <View 
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "#fff"
      }}
    >
      <View style={styles.container}>
        <View style={{ flex: 5 }}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Sign Up!</Text>
            <Text style={styles.subHeader}>Create an account to start using eProcess Assets Manager</Text>
          </View>
          <ScrollView style={styles.inputContainer} showsVerticalScrollIndicator={false}>
            <Input
              value={username}
              setValue={setUsername}
              label={"Username"}
              placeholder="Enter your username"
            />
             <Input
              value={email}
              setValue={setEmail}
              label={"Email"}
              placeholder="Enter your email"
            />
             <Input
              value={phone}
              setValue={setPhone}
              label={"Phone"}
              placeholder="Enter your phone"
            />
            <Input
              value={role}
              setValue={setRole}
              label={"Role"}
              placeholder="Enter your role"
            />
            <Input
              value={team}
              setValue={setTeam}
              label={"Team"}
              placeholder="Enter team's name"
            />
            <Input
              value={teamLead}
              setValue={setTeamLead}
              label={"Team Lead"}
              placeholder="Enter team lead's name"
            />
            <Input
              value={organization}
              setValue={setOrganization}
              label={"Organization"}
              placeholder="Enter organization name"
            />
            <Input
              value={password}
              setValue={setPassword}
              label={"Password"}
              placeholder="Enter your password"
              isPassword={true}
            />
          </ScrollView>
        </View>
        <View style={styles.btnContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: 5, marginBottom: 5 }} >  
            <Text style={styles.notify} on>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.notifyLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
            {loading ? <ActivityIndicator animating={true} color="#fff" /> : <Text style={styles.btnText}>Sign Up</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 10
  },
  header: {
    fontSize: 40,
    fontFamily: "Nunito_700Bold",
    color: "#00597D"
  },
  subHeader: {
    fontSize: 16,
    color: "#00000088",
    fontFamily: "Nunito_500Medium",
  },
  inputContainer: {
    marginTop: 25,
  },
  btnContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  notify: {
    fontSize: 16,
    fontFamily: "Nunito_500Medium",
    textAlign: "center"
  },
  notifyLink: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#00435e"
  },
  btn: {
    backgroundColor: "#00435e",
    borderRadius: 15,
    display: 'flex',
    alignSelf: "stretch",
    marginTop: 10,
    padding: 17,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Nunito_700Bold"
  }
})

export default Register
