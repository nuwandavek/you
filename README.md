# You  <img src="extension/icons48.png" width="30"/> 

An auto-completion tool that is you.

You lets you train a generative model that can mimic your personal style, and use it as an autocompletion tool. Currently, You trains on WhatsApp chat history, and offers autocomplete suggestions on WhatsApp Web via a Chrome extension. This can be extended to train and autocomplete on more personal communication apps (Messenger, email, slack, Twitter). Everything runs locally and is completely private. 

Contributors : [nuwandavek](https://twitter.com/nuwandavek), [rishicomplex](https://twitter.com/rishicomplex)
Blog Post : [https://vivekaithal.co/posts/you-complete-you/](https://vivekaithal.co/posts/you-complete-you/)

## Demo
![Demo](demo.gif)
## Train You on your data

Training You on your own data is somewhat clunky right now. Follow these steps. First, clone the You repository.

```bash
$ git clone https://github.com/nuwandavek/you.git
$ cd you
$ pip install -r requirements.txt
```


### Fine tune the model on your WhatsApp chat history

First, we'll fine-tune the [DistilGPT2](https://huggingface.co/distilgpt2) model on your WhatsApp history. Follow the instructions in [this colab](https://colab.research.google.com/github/nuwandavek/you/blob/master/Training_You.ipynb). Remember, more the data, the better You work(s)! Download the `model.zip` file at the end of this step, and unzip it to a location of your choice.

### Install the You Browser extension
> *Note : This extension was tested for Firefox and Chrome* 

**Firefox**

- Enter `about:debugging#/runtime/this-firefox` in the address bar
- Click on `Load Temporary Add-on...` 
- Select the manifest.json file in the `extension` folder
- Click on `Reload` for good measure

**Chrome**

- Enter `chrome://extensions/` in the address bar
- Toggle `Developer Mode` (top-right) if you haven't already
- Click on `Load unpacked`
- Select the entire `extension` folder


### Start a server with your model
As the first command line argument, pass the path to the directory containing the model you trained above.

```
python server.py ../Downloads/output
```

### Usage
- Once you haver the browser extension and the server working, go to `https://web.whatsapp.com/`. 
- Make sure the extension is working (you should see a logo at the top-right of the screen indicating that the extension is active).
- Now Click on any user you want to chat with, as usual. 
- Whenever you want `You` to fill in, press the `tab` key (you can `tab` to get the whole message prompt, or to finish a sentrence you've already started typing.)
- Select one of the 3 prompts (keyboard and mouse supported), or press the `Esc` key to ignore the prompts.

---

### ToDos
- Model
    - [x] Finetune DistilGPT2 on Whatsapp chat history
    - [x] Preprocess and clean data
    - [ ] Compute uncertainty and filter responses
    - [ ] Compute recommended training data size
    - [ ] Experiment with conversation pre-training on a large corpus
    - [ ] Checkout other architectures
    - [ ] Experiment with `platform` flag in the same model to handle multiple chat platforms
- UI
    - [x] Chrome/Firefox extension for Whatsapp web (feature complete)
    - Extend to 
        - [ ] Facebook/messeger
        - [ ] Hangouts
        - [ ] Gmail
        - [ ] Slack
        - [ ] Twitter
- Access
    - [ ] Blog Post!
    - [ ] Make training easier (can it be any easier, though?)
    - [ ] Explore using `tf.js` in the extension to avoid the server (will allow many many more people to use it)
    
---

### Contributing
Checkout the ToDos. Extending the UI to other platforms may be the easiest place to begin.
