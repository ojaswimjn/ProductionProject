import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from .models import WasteCategory
import tensorflow as tf

import requests
from .models import ExpoPushToken


import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# import tensorflow as tf
# import absl.logging

# # Suppress TensorFlow warnings and info messages
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress all TensorFlow logs except errors
# tf.get_logger().setLevel('ERROR')  # Set TensorFlow logger level to ERROR

# # Disable oneDNN custom operations
# os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# # Suppress absl warnings
# absl.logging.set_verbosity(absl.logging.ERROR)




model_path = "C:/project/ai/trained_model.h5"
# model_path = "C:/project/ai/trained_modelseventypercent.keras"

model = tf.keras.models.load_model(model_path)

# Define the mapping between predicted indices and category IDs
CATEGORY_MAPPING = {
    0: 9,  # "cardboard"
    1: 8,  # "glass"
    2: 10,  # "metal"
    3: 7,  # "paper"
    4: 11,  # "plastic"
    5: 12,  # "trash"
}

def predict_image (image_path):
    
    img = image.load_img(image_path, target_size = (224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    # model.compile(optimizer='adam',loss='categorical_crossentropy' ,metrics=['accuracy'])

    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions, axis=1)[0] #in the batch the highest problability of occuring in the position 0 is defined
    accuracy_score = np.max(predictions)
    print(f"Predicted class index: {predicted_class_index}")
    print(f"Accuracy score: {accuracy_score}")

    try:
        predicted_category_id = CATEGORY_MAPPING[predicted_class_index]
    except KeyError:
        raise ValueError(f"No mapping found for predicted class index {predicted_class_index}")

    return predicted_category_id, accuracy_score

def send_push_notification(expo_token, title, body):
    message = {
        'to': expo_token,
        'sound': 'default',
        'title': title,
        'body': body,
    }

    response = requests.post("https://exp.host/--/api/v2/push/send", json=message)
    return response.json()

def notify_user(user, title, body):
    try:
        token_obj = ExpoPushToken.objects.get(user=user)
        return send_push_notification(token_obj.token, title, body)
    except ExpoPushToken.DoesNotExist:
        return None

        
