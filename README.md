# You  <img src="extension/icons48.png" width="30"/> 

An auto-completion tool that is you.

You let's you train a generative model that can mimic your personal style, and use it as an autocompletion tool. Currently, You trains on WhatsApp chat history, and offers autocomplete suggestions on WhatsApp Web via a Chrome extension. This can be extended to train and autocomplete on more personal communication apps (Messenger, email, slack, Twitter).

## Demo

## Train You on your data

Training You on your own data is somewhat clunky right now. Follow these steps. Clone the You repository, and add a `model` folder.

```bash
$ git clone https://github.com/nuwandavek/you.git
$ cd you
$ pip install -r requirements.txt
$ mkdir model
```


### Fine tune the model on your WhatsApp chat history

First, we'll fine-tune the [DistilGPT2](https://huggingface.co/distilgpt2) model on your WhatsApp history. Follow the instructions in [this colab](https://colab.research.google.com/github/nuwandavek/you/blob/master/Training_You.ipynb). Download the `model.zip` file at the end of this step, and move the contents into the `model` folder you created above.  

### Install the You Browser extension
> *Note : This extension was tested for Firefox and Chrome* 

**Firefox**

- Enter `about:addons` in the address bar
- Click on the `Gear icon`, and select `Install Add-on from file...` option from the menu. 
- Select the manifest.json file in the `extension` folder

**Chrome**

- Enter `chrome://extensions/` in the address bar
- Toggle `Developer Mode` (top-right) if you haven't already
- Click on `Load unpacked`
- Select the entire `extension` folder


### Start a server with your model

```
python server.py
```

