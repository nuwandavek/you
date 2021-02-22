import sys
import json

from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline
from expertai.nlapi.edge.client import ExpertAiClient
# from expertai.nlapi.cloud.client import ExpertAiClient

def monthToNum(shortMonth):
    return {
            'Jan' : 1,
            'Feb' : 2,
            'Mar' : 3,
            'Apr' : 4,
            'May' : 5,
            'Jun' : 6,
            'Jul' : 7,
            'Aug' : 8,
            'Sep' : 9, 
            'Oct' : 10,
            'Nov' : 11,
            'Dec' : 12
    }[shortMonth]

app = Flask(__name__)
CORS(app)
expert_client = ExpertAiClient()

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

@app.route("/sentiment")
def sentiment():
    context = request.args.get('context', default = '', type = str)
    print(f'context = {context}')
    language = 'en'
    # document = expaiclient.specific_resource_analysis(
    #     body={"document": {"text": context}}, 
    #     params={'language': language, 'resource': 'sentiment'})
    document = expert_client.sentiment(context)
    sentiment_value = document.sentiment.overall
    print(f'sentiment_value = {sentiment_value}')
    if (sentiment_value <= -20):
        sentiment_bucket = "highly negative"
    elif (sentiment_value <= -5 and sentiment_value > -20):
        sentiment_bucket = "negative"
    elif (sentiment_value <= 5 and sentiment_value > -5):
        sentiment_bucket = "neutral"
    elif (sentiment_value <= 20 and sentiment_value > 5):
        sentiment_bucket = "positive"
    elif (sentiment_value > 20):
        sentiment_bucket = "highly positive"
    res = jsonify({
        "sentiment_value" : sentiment_value,
        "sentiment_class": sentiment_bucket
    })
    return res

@app.route("/calendar")
def calendar():
    resp = []
    context = request.args.get('context', default = '', type = str)
    print(f'context = {context}')
    language = 'en'
    context = context.split('<SPLIT>')
    for line in context:
        if(len(line) > 0):
            print(f'line = {line}')
            # document = expaiclient.specific_resource_analysis(
            #     body={"document": {"text": line}}, 
            #     params={'language': language, 'resource': 'entities'})
            document = expert_client.named_entity_recognition(line)
            has_calendar = False
            day = None
            month = None
            year = None
            hour = None
            start = len(line)
            end = -1
            print(type(document))
            if(document.entities is not None):
                for entity in document.entities:
                    if entity.type_ is None:
                        continue
                    if(entity.type_ == "DAT"):
                        has_calendar = True
                        lemma = entity.lemma.split("-")
                        month = lemma[0]
                        day = lemma[1]
                        if(len(lemma) > 2):
                            year = lemma[2]
                    if(entity.type_ == "HOU"):
                        has_calendar = True
                        hour = entity.lemma
                    start = min(start, entity.positions[0].start)
                    end = max(end, entity.positions[0].end)
            
            if(has_calendar):
                today = datetime.today()
                if(not day):
                    day = today.day
                if(not month):
                    month = today.month
                else :
                    month = monthToNum(month)
                if(not year):
                    year = today.year
                if(not hour):
                    hour = "13:00"
            
            jsonobject = {
                    "has_calendar" : has_calendar,
                    "day" : day,
                    "month" : month,
                    "year" : year,
                    "hour" : hour,
                    "start" : start,
                    "end" : end
                    }
            resp.append(jsonobject)
    jsonstring = json.dumps(resp)

    return jsonstring
            

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Missing required argument: model path.")
        exit(0)
    set_up_gen_pipeline(sys.argv[1])
    app.run(host="localhost", port=5000, debug=True)
