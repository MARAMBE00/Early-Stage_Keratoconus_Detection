from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.nasnet import preprocess_input
from PIL import Image
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = "E:/IIT/Lectures/4 Year/FYP/Model/NASNet/Final_tuned_4.keras"
model = load_model(MODEL_PATH, compile=False)

# Define the class labels
CLASS_LABELS = {0: "Keratoconus", 1: "Normal"}

# Preprocessing function
def preprocess_image(image, target_size=(224, 224)):
    image = image.resize(target_size)
    image = img_to_array(image)
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)
    return image

@app.route('/predict', methods=['POST'])
def predict():
    # Check if an image file is present in the request
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    file = request.files['image']

    # Check if the file is an image
    if file.filename == '' or not file.filename.lower().endswith(('png', 'jpeg', 'jpg')):
        return jsonify({"error": "Invalid file type. Only PNG, JPEG, and JPG are allowed."}), 400

    try:
        # Open the image file
        image = Image.open(file.stream).convert('RGB')

        # Preprocess the image
        processed_image = preprocess_image(image)

        # Make prediction
        prediction = model.predict(processed_image)

        # Interpret the result
        predicted_class = int(prediction[0] > 0.5)  # Binary classification threshold
        class_name = CLASS_LABELS.get(predicted_class, None)

        # If the prediction is outside the expected classes, return an error
        if class_name is None:
            return jsonify({"error": "The image does not belong to the expected classes (Keratoconus or Normal)."}), 400

        confidence = float(prediction[0]) if predicted_class == 1 else 1 - float(prediction[0])

        return jsonify({
            "predicted_class": class_name,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return "NASNetMobile Classification Backend is Running!"

if __name__ == '__main__':
    # Run the app on the specified port
    app.run(host='0.0.0.0', port=5000)