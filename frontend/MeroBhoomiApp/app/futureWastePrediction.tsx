import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { API_BASEURL } from './authDisplayService';

const screenWidth = Dimensions.get('window').width;

interface Prediction  {
    date:String
    predicted_weight: number
}
export default function FutureWasteChart() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${API_BASEURL}/future-waste-predict/`); 
      const data = await response.json();
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4f46e5" />;
  }

  // Prepare the data
  const chartData = {
    labels: predictions.map((item) => {
        const date = new Date(item.date.toString());
        return `${date.getDate()}/${date.getMonth() + 1}`; // Format like 2/5, 6/5
    }),
    datasets: [
      {
        data: predictions.map((item) => item.predicted_weight),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Predicted Waste Collection (May 2025)
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32} // Width of the chart
        height={250}
        yAxisSuffix="kg"
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // Purple-ish line
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#4f46e5',
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
}
