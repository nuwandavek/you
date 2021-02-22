import sys

from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline
from expertai.nlapi.cloud.client import ExpertAiClient


app = Flask(__name__)
CORS(app)
expaiclient = ExpertAiClient()

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

@app.route("/getsentiment")
def sentiment():
    context = request.args.get('context', default = '', type = str)
    print(f'context = {context}')
    language = 'en'
    document = expaiclient.specific_resource_analysis(
        body={"document": {"text": context}}, 
        params={'language': language, 'resource': 'sentiment'})
    sentiment_value = document.sentiment.overall
    print(f'sentiment_value = {sentiment_value}')
    if (sentiment_value <= -20):
        sentiment_bucket = "highly negative"
    elif (sentiment_value <= -10 and sentiment_value > -20):
        sentiment_bucket = "negative"
    elif (sentiment_value <= 10 and sentiment_value > -10):
        sentiment_bucket = "neutral"
    elif (sentiment_value <= 20 and sentiment_value > 10):
        sentiment_bucket = "positive"
    elif (sentiment_value > 20):
        sentiment_bucket = "highly positive"
    res = jsonify({
        "sentiment_value" : sentiment_value,
        "sentiment_class": sentiment_bucket
    })
    return res


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Missing required argument: model path.")
        exit(0)
    set_up_gen_pipeline(sys.argv[1])
    app.run(host="localhost", port=5000, debug=True)
