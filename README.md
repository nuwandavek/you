# You

An auto-completion tool that is you.

You let's you train a generative model that can mimic your personal style, and use it as an autocompletion tool. Currently, You trains on WhatsApp chat history, and offers autocomplete suggestions on WhatsApp Web via a Chrome extension. This can be extended to train and autocomplete on more personal communication apps (Messenger, email, slack, Twitter).

## Demo

## Train You on your data

Training You on your own data is somewhat clunky right now. Follow these steps.

### Fine tune the model on your WhatsApp chat history

First, we'll fine-tune the [DistilGPT2](https://huggingface.co/distilgpt2) model on your WhatsApp history. Follow the instructions in [this colab](https://colab.research.google.com/github/nuwandavek/you/blob/master/Training_You.ipynb). At the end of this step, you should have a fine-tuned model on your local machine.

### Start a flask server with your model

Clone the You repository.

```bash
$ git clone https://github.com/nuwandavek/you.git
```

### Install the You Chrome extension
