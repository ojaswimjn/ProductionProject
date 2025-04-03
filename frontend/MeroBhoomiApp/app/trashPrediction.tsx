import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet } from "react-native";

export default function TrashPrediction() {
  const { image, response } = useLocalSearchParams();
  const selectedImage = typeof image === 'string' ? image : image?.[0];

  // Parse response back into an object
  const parsedResponse = response ? JSON.parse(response as string) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trash Prediction</Text>
      selectedImage ? (
      <Image source={{ uri: selectedImage }} style={styles.image} />
    ) : (
      <Text>No image to display</Text>
    )
          {parsedResponse && (
        <View>
          <Text>Category: {parsedResponse.category_name}</Text>
          <Text>Accuracy Score: {parsedResponse.accuracy_score}</Text>
          <Text>Predicted Class Index: {parsedResponse.predicted_class_index}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" ,backgroundColor: '#ffff'},
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
});
