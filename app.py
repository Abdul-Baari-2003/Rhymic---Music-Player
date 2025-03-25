from flask import Flask, jsonify
from flask_cors import CORS
from flask import send_from_directory

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ... (your existing routes)

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
        'displayName':'THALA FOR A REASON',
        'cover':'assets/4.jpg',
        'artist':'MS DHONI',
    },
    {
        'path': 'assets/12.mp3',
        'displayName':'Main Zindagi Ka Saath',
        'cover':'assets/12.jpg',
        'artist':'Mohd.Rafi',
    },
    {
        'path': 'assets/17.mp3',
        'displayName':'Shinzou wo Sasageyo',
        'cover':'assets/17.jpg',
        'artist':'Linked Horizon',
    },
    {
        'path': 'assets/18.mp3',
        'displayName':'Suzume no Tojimari',
        'cover':'assets/18.jpg',
        'artist':'RADWIMPS',
    },
    {
        'path': 'assets/19.mp3',
        'displayName':'Toca Toca',
        'cover':'assets/19.jpg',
        'artist':'FLY PROJECTS',
    },
    {
        'path': 'assets/20.mp3',
        'displayName':'Despacito',
        'cover':'assets/20.jpg',
        'artist':'Luis Fonsi,Daddy Yankee',
    },
    {
        'path': 'assets/22.mp3',
        'displayName':'Give Me Some Suunshine',
        'cover':'assets/22.jpg',
        'artist':'Suraj Jagan,Sharman Joshi',
    }
]

# Add a route for the manifest.json file
@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')

# Add a route for the service-worker.js file
@app.route('/service-worker.js')
def service_worker():
    return app.send_static_file('service-worker.js')

# Serve song data to frontend
@app.route('/api/songs', methods=['GET'])
def get_songs():
    return jsonify(songs)

# Route to serve assets (songs and images)
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

# Default route to serve other static files
@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(debug=True)
