import sys

from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

def set_up_gen_pipeline(model_path):
    global gen_pipeline
    gen_pipeline = pipeline('text-generation', model=model_path, framework='pt')  

@app.route("/")
def hello():
    res = jsonify({
        "hello": "world!"
    })
    return res

@app.route("/autocomplete")
def prompt():
    context = request.args.get('context', default = '', type = str)
    print(f'context = {context}')
    outputs = gen_pipeline(context, max_length=200, num_return_sequences=3, do_sample=True, eos_token_id=2, pad_token_id=0, 
    skip_special_tokens=True, top_k=50, top_p=0.95)
    print(f'outputs = {outputs}')

    
    res = jsonify({
        "outputs": outputs 
    })
    return res

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Missing required argument: model path.")
        exit(0)
    set_up_gen_pipeline(sys.argv[1])
    app.run(host="localhost", port=5000, debug=True)
