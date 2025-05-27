from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, 
    static_url_path='/static',
    static_folder='static',
    template_folder='templates'
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/videos/<path:filename>')
def serve_video(filename):
    video_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'videos')
    return send_from_directory(video_dir, filename)

if __name__ == '__main__':
    app.run(debug=True) 