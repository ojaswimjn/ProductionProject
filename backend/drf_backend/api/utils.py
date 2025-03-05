import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np


model_path = "C:/project/ai/trained_model.h5"
model = load_model(model_path)

def predict_image (image_path):
    img = image.load_img(image_path, target_size = (224,224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /=255.0

    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions, axis=1)[0] #in the batch the highest problability of occuring in the position 0 is defined
    accuracy_score = np.max(predictions)

    return predicted_class_index, accuracy_score