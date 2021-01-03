from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline
gen_pipeline = pipeline('text-generation', model='./output', framework='pt')

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    res = jsonify({
        "hello": "world!"
    })
    return res

@app.route("/autocomplete")
def prompt():
    context = request.args.get('context', default = '', type = str)
    outputs = gen_pipeline(context, max_length=50, num_return_sequences=3)

    
    res = jsonify({
        "outputs": outputs 
    })
    return res

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)