import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { API_BASEURL } from "./authDisplayService";
import { getUserProfile } from "./services/authDisplayProfile";
import axios from "axios";
import { useEffect, useState } from "react";
import { getRewardsPoint } from "./services/getRewardsPointService";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";



export default function TrashPrediction() {
  const { image, response } = useLocalSearchParams();
  const parsedResponse = response ? JSON.parse(response as string) : null;

  const [points, setPoints] = useState(0);
  const [indPoints, setIndPoints]=useState(0);

  const [isTipModalVisible, setTipModalVisible] = useState(false);
  const toggleTipModal = () => {
    setTipModalVisible(!isTipModalVisible);
  };


  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  
  useEffect(() => {
    if (parsedResponse) {
      updateRewardPoints(parsedResponse);
    }
  }, []);

  const updateRewardPoints = async (parsedResponse: any) => {
    const accuracy_score = parsedResponse.accuracy_score;

    let pointsToAdd = 0;
    if (accuracy_score > 0.9) {
      pointsToAdd = 10;
    } else if (accuracy_score > 0.7 && accuracy_score < 0.9) {
      pointsToAdd = 5;
    } else {
      pointsToAdd = 0;
    }

    setIndPoints(pointsToAdd)
    try {
      const userProfile = await getUserProfile();
      const userId = userProfile.id;

      const description = `From waste type: ${parsedResponse.category_name}`;

      const response = await axios.patch(
        `${API_BASEURL}/reward/updatereward/`,
        {
          user_id: userId,
          points: pointsToAdd,
          description: description,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setPoints(response.data.points);
    } catch (error: any) {
      console.error("Error updating reward points:", error);
      alert("Failed to update reward points.");
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Your Trash Prediction</Text>

        {parsedResponse && (
          <View style={styles.predictionContainer}>
            <Image
              source={{ uri: `${API_BASEURL}${parsedResponse.image_url}` }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.predictionDetails}>
              <Text style={styles.categoryText}>
                {capitalizeFirstLetter(parsedResponse.category_name)}
              </Text>
              <Text style={styles.predictionText}>
              Accuracy: {parsedResponse.accuracy_score.toFixed(3)}
              </Text>
              
              <Text style={styles.recyclingNote}>
                Recycling this type of item helps reduce waste and conserve
                resources.
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.pointsEarned}>Points Earned </Text>

        <View style={styles.pointsContainer}>
          <View style={styles.pointsLeft}>
            <Text style={styles.earnedText}>{indPoints} points</Text>
            <Text style={styles.totalText}>Total: {points}</Text>
            <Text style={styles.coinInfo}>
              For each recycled item, you get a different amount of coins based on the accuracy. To get higher points upload best angled single image and recycle it.
            </Text>
          </View>
          <Image
            source={require("../assets/images/coins.webp")} // replace with your image path
            style={styles.coinImage}
            resizeMode="contain"
          />
        </View>


        {/* <View style={styles.tipContainer}>
          <Text style={styles.tipHeader}>♻️ Recycling Tip</Text>
          <Text style={styles.tipText}>
            Always rinse recyclable containers to avoid contamination. Sorting
            clean materials increases recycling efficiency!
          </Text>
        </View> */}

        <View style={styles.recyclingTipTrigger}>
          <TouchableOpacity onPress={toggleTipModal} style={styles.tipHeaderRow}>
            <Text style={styles.tipHeaderText}>Tips on recycling:</Text>
            <AntDesign name="up" size={20} color="#0077b6" />
          </TouchableOpacity>
          <Text style={styles.modalTipText}>
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.

              </Text>
        </View>

        <Modal
          isVisible={isTipModalVisible}
          onBackdropPress={toggleTipModal}
          style={styles.bottomModal}
          backdropOpacity={0.3}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recycling Tips</Text>
              <TouchableOpacity onPress={toggleTipModal}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalCategory}>Plastic</Text>
              <Text style={styles.modalTipTitle}>#1</Text>
              <Text style={styles.modalTipText}>
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.

              </Text>

              <Text style={styles.modalTipText}>
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.

              </Text>

              <Text style={styles.modalTipText}>
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.
                Twist on the bottle caps before tossing them in the bin to make it easier for recyclers.

              </Text>

              {/* You can map through multiple tips here if needed */}
            </ScrollView>

            <TouchableOpacity style={styles.confirmBtnModal} onPress={toggleTipModal}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>


      </View>
    </ScrollView>
  );



}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  predictionContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#d9d9d9",
    shadowOffset: { width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 0,
    elevation: 12  ,
  },
  image: {
    width: 130,
    height: 160,
    borderRadius: 10,
    marginRight: 20,
  },
  predictionDetails: {
    flex: 1,
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 20,
    // marginBottom: 0,
    fontWeight: 500,
    
  },
  predictionText: {
    fontSize: 16,
    marginBottom: 4,
    
  },
  recyclingNote: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    // textAlign: "justify"

  },
  pointsEarned: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    // textAlign: "center",
  },
  pointsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#d9d9d9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 12,
    alignItems: "center",
  },
  pointsLeft: {
    flex: 1,
  },
  earnedText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  coinInfo: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    textAlign: "justify"
  },
  coinImage: {
    width: 120,
    height: 140,
    marginLeft: 10,
  },
  tipContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 30,
  },
  tipHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#555",
  },
  recyclingTipTrigger: {
    backgroundColor: "#d0f0fd",
    padding: 14,
    borderRadius: 14,
    marginBottom: 30,
  },
  
  tipHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  tipHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0077b6",
  },
  
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0077b6",
  },
  
  modalScroll: {
    paddingBottom: 20,
  },
  
  modalCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  
  modalTipTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  
  modalTipText: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
    textAlign: "justify",
  },
  
  confirmBtnModal: {
    backgroundColor: "#90caf9",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  
  confirmText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  
});
