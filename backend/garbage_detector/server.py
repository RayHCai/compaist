import tensorflow as tf
import numpy as np
from PIL import Image
import tensorflow_hub as hub
import cv2

def preprocess_image(image_path):
    img = Image.open(image_path).resize((224, 224))
    img = np.array(img).astype(np.float32) / 255.0  # Normalize as float32
    return np.expand_dims(img, axis=0)  # Add batch dimension

# Keywords indicating garbage
garbage_keywords = ["plastic", "bottle", "bag", "can", "waste", "paper", "cup", "box", "carton", "wrapper", "container", "head cabbage"
"broccoli",
"cauliflower",
"zucchini",
"spaghetti squash",
"acorn squash",
"butternut squash",
"cucumber",
"artichoke",
"bell pepper",
"cardoon",
"mushroom",
"Granny Smith",
"strawberry",
"orange",
"lemon",
"fig",
"pineapple",
"banana",
"jackfruit",
"beer bottle"
]

# Load MobileNet V2 model from TensorFlow Hub
print("Loading model...")
model = hub.load("https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/5")
print("Model loaded successfully!")

# Load ImageNet labels
with open("ImageNetLabels.txt", "r") as f:
    class_labels = f.read().splitlines()

# ---- Test with an Image ----
def predict_image(image_path):
    img = preprocess_image(image_path)

    # Inspect model output structure
    output_signature = model.signatures["serving_default"].structured_outputs
    print(f"Model output structure: {output_signature}")

    # Get raw model predictions
    output_key = list(output_signature.keys())[0]  # Automatically get the first output key
    raw_predictions = model.signatures["serving_default"](tf.convert_to_tensor(img))[output_key]

    # Apply softmax to normalize logits
    probabilities = tf.nn.softmax(raw_predictions[0]).numpy()

    pred_class = np.argmax(probabilities)
    confidence = np.max(probabilities) * 100  # Confidence as a percentage
    label = class_labels[pred_class].lower()

    # Check for garbage-related keywords
    is_garbage = any(keyword in label for keyword in garbage_keywords)

    if is_garbage:
        print(f"Result: 🚮 Garbage ({confidence:.2f}% confidence - Detected as '{label}')")
    else:
        print(f"Result: ✅ Not Garbage ({confidence:.2f}% confidence - Detected as '{label}')")


# ---- Real-Time Webcam Prediction ----
def predict_webcam():
    cap = cv2.VideoCapture(0)
    print("Press 'q' to quit webcam feed.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Preprocess the frame
        img = cv2.resize(frame, (224, 224))
        img = np.expand_dims(img / 255.0, axis=0).astype(np.float32)

        # Make prediction
        output_signature = model.signatures["serving_default"].structured_outputs
        output_key = list(output_signature.keys())[0]
        raw_predictions = model.signatures["serving_default"](tf.convert_to_tensor(img))[output_key]

        probabilities = tf.nn.softmax(raw_predictions[0]).numpy()
        pred_class = np.argmax(probabilities)
        confidence = np.max(probabilities) * 100
        label = f"{class_labels[pred_class]} ({confidence:.1f}%)"

        # Display prediction on the frame
        cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow('Garbage Classifier', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# ---- Choose Mode ----
if __name__ == "__main__":
    mode = input("Choose mode: (1) Image Prediction, (2) Webcam Detection: ")

    if mode == "1":
        image_path = input("Enter the path to the image: ")
        predict_image(image_path)
    elif mode == "2":
        predict_webcam()
    else:
        print("Invalid option. Please choose 1 or 2.")
