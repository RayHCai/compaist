from flask import Flask, request, jsonify
from pyzbar.pyzbar import decode
from PIL import Image
<<<<<<< HEAD

app = Flask(__name__)

@app.route('/scan-qr', methods=['POST'])
def scan_qr():
    data = request.json
    image_path = data.get('image_path')

    try:
        # Open the image and decode the QR code
        img = Image.open(image_path)
=======
import os

app = Flask(__name__)

@app.route('/api/qr-code', methods=['POST'])  # ✅ Correct route
def scan_qr():
    print("📥 Received request!")  # Debug log

    data = request.json
    image_path = data.get('image_path')
    print(f"📂 Image path received: {image_path}")  # Debug log

    if not os.path.exists(image_path):
        print("❌ Image file not found.")
        return jsonify({"error": "Image file not found."}), 404

    try:
        img = Image.open(image_path)
        img.verify()  # Check if it's a proper image
        img = Image.open(image_path)  # Reopen after verify
>>>>>>> qr-code
        decoded_data = decode(img)

        if decoded_data:
            qr_content = decoded_data[0].data.decode('utf-8')
<<<<<<< HEAD
            return jsonify({"qr_data": qr_content}), 200
        else:
            return jsonify({"error": "No QR code found."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
=======
            print(f"✅ QR Code Detected: {qr_content}")
            return jsonify({"qr_data": qr_content}), 200
        else:
            print("⚠️ No QR code found in the image.")
            return jsonify({"error": "No QR code found."}), 404

    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)  # ✅ Make sure debug=True for logs
>>>>>>> qr-code
