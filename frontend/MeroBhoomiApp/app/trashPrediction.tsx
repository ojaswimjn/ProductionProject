import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { API_BASEURL } from "./authDisplayService";
import { getUserProfile } from "./services/authDisplayProfile";
import axios from "axios";
import { useEffect, useState } from "react";
import { getRewardsPoint } from "./services/getRewardsPointService";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";


interface RecyclingTip {
  category_name:string
  description: string;
}

export default function TrashPrediction() {
  const { image, response } = useLocalSearchParams();
  const parsedResponse = response ? JSON.parse(response as string) : null;

  const [points, setPoints] = useState(0);
  const [indPoints, setIndPoints]=useState(0);

  const [isTipModalVisible, setTipModalVisible] = useState(false);
  const [recyclingTips, setRecyclingTips] = useState<RecyclingTip[]>([]);

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
    fetchRecyclingTips();
  }, []);

  const fetchRecyclingTips = async () => {
    try{
      const response = await axios.get(`${API_BASEURL}/wastecategory/?category_name=${parsedResponse.category_name}`)
      const allTips = response.data; 

      const randomizedTips = allTips.sort(()=> Math.random()  - 0.5 ).slice(0, 7);
      setRecyclingTips(randomizedTips)
      console.log(randomizedTips)
    }catch(error : any){
      console.error("Error fetching recycling tips", error);
      alert("Failed to fetch recycling tips.")
    }


  }

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
    <View style={styles.scrollContainer}>
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
      </View>
          <View style={styles.recyclingTipTrigger}>
            <TouchableOpacity onPress={toggleTipModal} style={styles.tipHeaderRow}>
              <Text style={styles.tipHeaderText}>Tips on recycling:</Text>
              <AntDesign name="up" size={20} color="#ffff" />
            </TouchableOpacity>
            <Text style={styles.categoryNameText}>
                  {capitalizeFirstLetter(parsedResponse.category_name)}
            </Text>
            <Text style={styles.categoryHashText}>
              #1
            </Text>



            {recyclingTips.length > 0 ? (
              <>
                {recyclingTips.slice(0, 2).map((tip, index) => {
                  const limitedText =
                    tip.description.length > 100
                      ? `${tip.description.substring(0, 105)}...`
                      : tip.description;

                  return (
                    <Text key={index} style={[styles.modalTipText, styles.previewTip]}>
                      {limitedText}
                    </Text>
                  );
                })}
              </>
            ) : (
              <Text style={[styles.modalTipText, styles.previewTip]}>
                Loading recycling tips...
              </Text>
            )}

            
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
                <AntDesign name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>     
              <Text style={styles.modalTipText}>
              {recyclingTips.length > 0 ? (
                recyclingTips.map((tip, index) => (
                  <Text key={index} style={styles.modalTipItem}>
                    <View key={index} style={styles.tipItem}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.modalTipText}>{tip.description}</Text>
                    </View>
                  </Text>
                ))
              ) : (
                <Text style={styles.modalTipText}>Loading recycling tips...</Text>
              )}
              </Text>
            </ScrollView>

            <TouchableOpacity style={styles.confirmBtnModal} onPress={toggleTipModal}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>


      
    </View>
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
    backgroundColor: "#2B4B40",
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
    backgroundColor: "#2B4B40",
    padding: 20,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    marginBottom: 30,
    shadowColor: "#d9d9d9",
    shadowOffset: { width: 0, height: -90},
    shadowOpacity: 0.04,
    shadowRadius: 0,
    elevation: 12  ,

  },
  
  tipHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryNameText: {
    fontSize: 20,
    marginBottom: 0,
    fontWeight: 500,
    color: "#ffffff",

    
  },
  categoryHashText: {
    fontSize: 20,
    marginTop: 15,
    fontWeight: 500,
    color: "#ffff",

    
  },
  
  tipHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 10,

  },
  
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  
  modalContent: {
    backgroundColor: "#2B4B40",
    padding: 25,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
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
    color: "#ffffff",
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
  modalTipItem: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  modalTipText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 4,
    textAlign: "justify",
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 20,
    color: "#fff",
    marginRight: 8,
  },
  
  confirmBtnModal: {
    backgroundColor: "#E8F1EE",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  
  confirmText: {
    color: "#2B4B40",
    fontSize: 15,
    fontWeight: "bold",
  },
  previewTip: {
    color: "#888", // Lighter color to indicate this is just a preview
    opacity: 0.7, // Slightly reduce opacity for a faded look
  },
  
});
