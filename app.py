from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

# Correctly set static and template folders
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Define the list of songs
songs = [
    {
        'path': 'assets/2.mp3',
        'displayName': 'Alone',
        'cover': 'assets/2.jpg',
        'artist': 'Alan Walker',
    },
    {
        'path': 'assets/3.mp3',
        'displayName': 'Darkside',
        'cover': 'assets/3.jpg',
        'artist': 'Alan Walker',
    },
    {
        'path': 'assets/4.mp3',
        'displayName': 'THALA FOR A REASON',
        'cover': 'assets/4.jpg',
        'artist': 'MS DHONI',
    },
    {
        'path': 'assets/12.mp3',
        'displayName': 'Main Zindagi Ka Saath',
        'cover': 'assets/12.jpg',
        'artist': 'Mohd. Rafi',
    },
    {
        'path': 'assets/17.mp3',
        'displayName': 'Shinzou wo Sasageyo',
        'cover': 'assets/17.jpg',
        'artist': 'Linked Horizon',
    },
    {
        'path': 'assets/18.mp3',
        'displayName': 'Suzume no Tojimari',
        'cover': 'assets/18.jpg',
        'artist': 'RADWIMPS',
    },
    {
        'path': 'assets/19.mp3',
        'displayName': 'Toca Toca',
        'cover': 'assets/19.jpg',
        'artist': 'FLY PROJECTS',
    },
    {
        'path': 'assets/20.mp3',
        'displayName': 'Despacito',
        'cover': 'assets/20.jpg',
        'artist': 'Luis Fonsi, Daddy Yankee',
    },
    {
        'path': 'assets/22.mp3',
        'displayName': 'Give Me Some Sunshine',
        'cover': 'assets/22.jpg',
        'artist': 'Suraj Jagan, Sharman Joshi',
    }
]

# Serve song data to frontend
@app.route('/api/songs', methods=['GET'])
def get_songs():
    return jsonify(songs)

# Serve manifest.json and service-worker.js correctly
@app.route('/manifest.json')
def manifest():
    return send_from_directory('.', 'manifest.json')

@app.route('/service-worker.js')
def service_worker():
    return send_from_directory('.', 'service-worker.js')

# Serve assets (MP3, images, etc.)
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

# Serve other static files (CSS, JS, etc.)
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# Serve index.html as homepage
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True)
