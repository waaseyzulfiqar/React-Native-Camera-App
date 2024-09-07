import {
  StyleSheet,
  View,
  Button,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<any>([]);
  const [showAlbum, setShowAlbum] = useState(false);

  const camera = useRef<any>(null);



  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    const picture = await camera.current.takePictureAsync();
    console.log(picture);
    setCapturedImages([...capturedImages, picture.uri]);
  }

  const handleShowAlbum = () => {
    setShowAlbum(true);
  };

  const handleBackToCamera = () => {
    setShowAlbum(false);
  };

    const handlePress = (index:any) => {
      const updatedImages = [...capturedImages]; // Create a copy of the array
      updatedImages.splice(index, 1); // Remove the image at the specified index
      setCapturedImages(updatedImages); // Update the component state
    }

  return (
    <View style={styles.container}>
      {!showAlbum ? (
        <View style={{ flex: 1 }}>
          <CameraView ref={camera} style={styles.camera} facing={facing}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.text}>Flip Camera</Text>
                <TouchableOpacity
                  style={styles.redButton}
                  onPress={takePicture}
                ></TouchableOpacity>
              </TouchableOpacity>
            </View>
          </CameraView>
          {capturedImages.length > 0 && (
            <TouchableOpacity
              style={styles.albumButton}
              
            >
              <Ionicons name="image-outline" style={styles.albumButton} onPress={handleShowAlbum}></Ionicons>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToCamera}
          >
            <Text style={styles.albumText}>Back to Camera</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {capturedImages.map((image: any, index: any) => (
              <View style={{ flex: 1, marginTop: 35, marginLeft: 10 }}>
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                />
                <Ionicons size={30} name="trash-outline" style={styles.icon} onPress={() => handlePress(index)}/>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  icon: {
    color: "#fff",
    position: "relative",
    bottom: 43,
    left: 10,
  },
  backButton: {
    // flex: 1,
    justifyContent: 'center', 
    marginTop: 40,
    padding: 10,
    alignItems: 'center',
    backgroundColor: "blue",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  albumContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  albumButton: {
    position: "absolute",
    fontSize: 36,
    bottom: 30,
    right: 45,
    color: '#fff'
  },
  albumText: {
    fontSize: 18,
    color: "white",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
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
  image: {
    maxWidth: 200,
    height: 180,
    resizeMode: "cover",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderStyle: "solid",
    borderRadius: 5,

  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 50,
  },
  camera: {
    flex: 1,
  },
  redButton: {
    width: 50,
    height: 50,
    backgroundColor: "red",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
