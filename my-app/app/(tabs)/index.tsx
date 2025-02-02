import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraShown, updateCameraShown] = useState(true);

  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");

  const [userId, updateUserId] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={ { marginTop: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 } }>
        <TextInput onChangeText={updateEmail} value={email} placeholder="Email" style={
            {
                borderColor: 'black',
                borderWidth: 1,
                color: 'black',
                width: 300,
                paddingVertical: 10,
                paddingLeft: 5
            }
        } autoComplete="email" autoCapitalize="none"/>

        <TextInput onChangeText={updatePassword} value={password} placeholder="Password" style={
            {
                borderColor: 'black',
                borderWidth: 1,
                color: 'black',
                width: 300,
                paddingVertical: 10,
                paddingLeft: 5
            }
        } textContentType="password" autoComplete="password" />

        <Button
          title="Login"
          onPress={async () => {
            const response = await fetch(
              "https://compaist-byagdzcgcpghf4gq.canadacentral-01.azurewebsites.net/auth/login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                  password: password,
                }),
              }
            );

            const json = await response.json();
            updateUserId(json.user.id);
          }}
        />
      </View>
    );
  }

  async function scan(data: BarcodeScanningResult) {
    const scannedResult = data.data;
    console.log(scannedResult);
    updateCameraShown(false);

    const response = await fetch(scannedResult, {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            recId: userId,
        }),
    });

    const json = await response.json();

    updateCameraShown(true);
  }

  if (!cameraShown)
    return (
      <Text
        style={{
          color: "black",
          textAlign: "center",
          fontSize: 25,
          marginTop: 40,
        }}
      >
        Loading...
      </Text>
    );

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={"back"}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(data) => scan(data)}
      ></CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
