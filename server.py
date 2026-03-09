from flask import Flask, send_file, render_template_string
import glob, subprocess, os

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Feliz dia de la mujer, HERMOSA</title>
    <style>
        body { background: black; display: flex; flex-direction: column;
               justify-content: center; align-items: center; 
               height: 100vh; margin: 0; }
        video { max-width: 420px; border-radius: 12px; }
        p { color: white; font-family: sans-serif; }
    </style>
</head>
<body>
    <video src="/video" autoplay loop controls></video>
    <p>Generado con Manim 💘</p>
</body>
</html>
"""

def generar_video():
    if not glob.glob("media/videos/**/*.mp4", recursive=True):
        subprocess.run([
            "manim", "-ql", "corazon_titulo.py", "Corazon"
        ])

@app.route("/")
def index():
    generar_video()
    return render_template_string(HTML)

@app.route("/video")
def video():
    archivos = glob.glob("media/videos/**/*.mp4", recursive=True)
    if archivos:
        return send_file(archivos[0], mimetype="video/mp4")
    return "Video aún generándose, recarga en 30 segundos", 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)