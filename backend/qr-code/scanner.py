from flask import Flask, request, jsonify
from pyzbar.pyzbar import decode
from PIL import Image

app = Flask(__name__)

@app.route('/scan-qr', methods=['POST'])
def scan_qr():
    data = request.json
    image_path = data.get('image_path')

    try:
        # Open the image and decode the QR code
        img = Image.open(image_path)
        decoded_data = decode(img)

        if decoded_data:
            qr_content = decoded_data[0].data.decode('utf-8')
            return jsonify({"qr_data": qr_content}), 200
        else:
            return jsonify({"error": "No QR code found."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
