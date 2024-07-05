import os
from flask import Flask, render_template, request, send_from_directory, redirect, jsonify
from werkzeug.utils import secure_filename
from database import migrate, selectAllDocs
from models import processDocument

upload_path = 'documents/'

app = Flask(__name__, static_folder='../frontend', template_folder='../frontend')

@app.route('/')
def index():
    migrate()
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():

    os.makedirs(upload_path, exist_ok=True)

    file = request.files.get("pdfFile")
    filename = str(secure_filename(file.filename))
    savePath = os.path.join(upload_path, filename)
    file.save(savePath)
    
    processDocument(filename, savePath)

    return redirect('/')

@app.route("/download/<nome_do_arquivo>", methods=["GET"])
def get_arquivo(nome_do_arquivo):
    full_path = os.path.join(os.getcwd(), upload_path)
    return send_from_directory(full_path, nome_do_arquivo, as_attachment=True)

@app.route("/list")
def list():
    return jsonify(selectAllDocs())


if __name__ == '__main__':
    app.run(debug=True)

