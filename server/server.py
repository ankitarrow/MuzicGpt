from flask import Flask, request, jsonify
from nendo import Nendo, NendoConfig
app = Flask(__name__)
stemify_nd = Nendo(config=NendoConfig(plugins=["nendo_plugin_stemify_demucs"]))
classify_nd = Nendo(config=NendoConfig(plugins=["nendo_plugin_classify_core"]))
fx_nd = Nendo(config=NendoConfig(plugins=["nendo_plugin_fx_core"]))
loopify_nd = Nendo(config=NendoConfig(plugins=["nendo_plugin_loopify"]))

@app.route('/stemify', methods=['POST'])
def stemify():
    data = request.json
    file_path = data.get('file_path')
    stem_types = data.get('stem_types', [])
    model = data.get('model', "htdemucs_6s")

    try:
        track = stemify_nd.library.add_track(file_path=file_path)
        stems = stemify_nd.plugins.stemify_demucs(track=track, stem_types=stem_types, model=model)
        return jsonify({"status": "success", "stems": [stem.to_dict() for stem in stems]}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/classify', methods=['POST'])
def classify():
    data = request.json
    file_path = data.get('file_path')

    try:
        track = classify_nd.library.add_track(file_path=file_path)
        track = classify_nd.plugins.classify_core(track=track)
        plugin_data = track.get_plugin_data(plugin_name="nendo_plugin_classify_core")
        return jsonify({"status": "success", "data": plugin_data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/fx', methods=['POST'])
def apply_fx():
    data = request.json
    file_path = data.get('file_path')
    wet_level = data.get('wet_level', 0.2)
    dry_level = data.get('dry_level', 0.8)
    room_size = data.get('room_size', 0.1)

    try:
        track = fx_nd.library.add_track(file_path=file_path)
        track = fx_nd.plugins.fx_core.compressor(track=track)
        track = fx_nd.plugins.fx_core.reverb(track=track, wet_level=wet_level, dry_level=dry_level, room_size=room_size)
        track = fx_nd.plugins.fx_core.limiter(track=track)
        return jsonify({"status": "success", "message": "FX applied successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/loopify', methods=['POST'])
def loopify():
    data = request.json
    file_path = data.get('file_path')
    n_loops = data.get('n_loops', 4)
    beats_per_loop = data.get('beats_per_loop', 8)

    try:
        track = loopify_nd.library.add_track(file_path=file_path)
        generated_loops = loopify_nd.plugins.loopify(track=track, n_loops=n_loops, beats_per_loop=beats_per_loop)
        return jsonify({"status": "success", "loops": [loop.to_dict() for loop in generated_loops]}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
