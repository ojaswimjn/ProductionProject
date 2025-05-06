// app/TipDetail.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Pressable } from "react-native";

const { width } = Dimensions.get("window");

export default function TipDetail() {
  const { title, detail, image } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: image as string }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>{detail}</Text>

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    flex: 1,
  },
  image: {
    width: "100%",
    height: width * 0.6,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2B4B40",
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#2B4B40",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
