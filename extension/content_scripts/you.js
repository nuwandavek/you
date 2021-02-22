function generateContext() {
  var selfName = '';
  var context = ''
  var messages = $(".focusable-list-item");
  messages = messages.slice(-5);
  messages.each(function () {
    var classes = $(this).attr('class');
    var type = '';
    if (classes.includes('message-in')) {
      type = 'incoming';
    }
    else if (classes.includes('message-out')) {
      type = 'outgoing';
    }
    var texts = $(this).find('.copyable-text');
    if (texts.length == 2) {
      console.log('reached')
      var metadata = $(texts[0]).data('prePlainText');
      var author = metadata.split(']')[1].trim();
      var time = metadata.split(']')[0].split('[')[1].trim()
      var message = $(texts[1]).text().trim();
      context += author + ' ' + message + '#';
      if (type === 'outgoing' && selfName === '') {
        selfName = author;
      }
    }
  });
  // console.log(text);

  currentMessage = $('div[data-tab="6"]').text();

  context += selfName + ' ' + currentMessage;
  context = context.trim();

  console.log('context : ', context);
  console.log('author : ', selfName);
  return context;
}

function getContextForSentiment() {
  var context = ''
  var messages = $(".focusable-list-item");
  messages = messages.slice(-5);
  messages.each(function () {
    var texts = $(this).find('.copyable-text');
    if (texts.length == 2) {
      var message = $(texts[1]).text().trim();
      context += message;
    }
  });
  return context;
}


function getContextForCalendar() {
  var context = '';
  var messageDOMs = [];
  var authors = [];
  var selfName = '';
  var messages = $(".focusable-list-item");
  messages = messages.slice(-5);
  messages.each(function () {
    var classes = $(this).attr('class');
    var type = '';
    if (classes.includes('message-in')) {
      type = 'incoming';
    }
    else if (classes.includes('message-out')) {
      type = 'outgoing';
    }


    var texts = $(this).find('.copyable-text');
    if (texts.length == 2) {
      var metadata = $(texts[0]).data('prePlainText');
      var author = metadata.split(']')[1].trim().slice(0, -1);
      var message = $(texts[1]).text().trim();
      messageDOMs.push(texts[1]);
      // message = message.replaceAll('?', '<Q>')
      // message = message.replaceAll('&', '<AND>')
      context += message + '<SPLIT>';
      if (type === 'outgoing' && selfName === '') {
        selfName = author;
      }
      if (type != 'outgoing') {
        authors.push(author);
      }
    }
  });
  return [context, messageDOMs, authors, selfName];
}

function displayPrompts(prompts, context) {
  console.log(context);
  $('#predicted-prompts').remove();
  $('div[data-tab="7"]').append("<div id='predicted-prompts' style='padding: 20px;margin: 20px; border-radius: 15px; background:#085373'></div>");
  $('#predicted-prompts').append('<div style="flex-direction: row;display: flex;"><img src="https://raw.githubusercontent.com/nuwandavek/you/master/extension/icons48.png"><p style="font-size: 12px; padding: 15px; font-weight: 900; text-transform: uppercase">You : Predicted Responses</p></div>');
  prompts.forEach((p) => {
    p = p.generated_text.replace(context, '').trim();
    // console.log(p);

    //Select first complete message
    p = p.split('#')[0];
    $('#predicted-prompts').append("<p class='prompt' style='border-radius: 5px; padding: 15px;border: 1px solid #083d53;margin: 5px; font-size: 14px'>" + p + "</p>");

  })
  $('.prompt').on('mouseover', function () {
    $('.prompt').css('background', 'none');
    $(this).css('background', '#083d53');
  })

  // $('.prompt')[0].trigger('mouseover');
  const mouseoverEvent = new Event('mouseover');
  document.querySelector('.prompt').dispatchEvent(mouseoverEvent);
  var currentSelectedPrompt = 0;
  var totalPrompts = prompts.length;

  $('.prompt').on('click', function () {
    document.querySelector('body').removeEventListener('keydown', togglePrompt);

    var currentMessage = $('div[data-tab="6"]').text();
    $('div[data-tab="6"]').text('');
    currentMessage = currentMessage.trim() + ' ' + $(this).text();
    $('div[data-tab="6"]').focus();
    document.execCommand('insertText', false, currentMessage);
    $('#predicted-prompts').remove();
    $('div[data-tab="6"]').siblings().hide();
  })

  function togglePrompt(e) {
    console.log($('#predicted-prompts').length);
    if ($('#predicted-prompts').length) {
      e.preventDefault();
      e.stopPropagation();

      if (e.keyCode === 38) {
        // console.log('up');
        currentSelectedPrompt -= 1;
        if (currentSelectedPrompt < 0) {
          currentSelectedPrompt = totalPrompts - 1;
        }
        console.log('CURRENT_PROMPT_NO(up)', currentSelectedPrompt);
        document.querySelectorAll('.prompt')[currentSelectedPrompt].dispatchEvent(mouseoverEvent);

      }
      else if (e.keyCode === 40) {
        // console.log('down');
        currentSelectedPrompt += 1;
        if (currentSelectedPrompt >= totalPrompts) {
          currentSelectedPrompt = 0;
        }
        console.log('CURRENT_PROMPT_NO(down)', currentSelectedPrompt);
        document.querySelectorAll('.prompt')[currentSelectedPrompt].dispatchEvent(mouseoverEvent);

      }
      else if (e.keyCode === 27) {
        // console.log('escape');
        $('#predicted-prompts').remove();
        document.querySelector('body').removeEventListener('keydown', togglePrompt);
        console.log('CURRENT_PROMPT_NO(escape)', currentSelectedPrompt);

        var currentMessage = $('div[data-tab="6"]').text();
        $('div[data-tab="6"]').text('');
        $('div[data-tab="6"]').focus();
        document.execCommand('insertText', false, currentMessage);

      }
      else if (e.keyCode === 13) {
        // console.log('enter');
        document.querySelector('body').removeEventListener('keydown', togglePrompt);
        console.log('CURRENT_PROMPT_NO(enter)', currentSelectedPrompt);
        document.querySelectorAll('.prompt')[currentSelectedPrompt].click();
      }
    }
  }

  document.querySelector('body').addEventListener('keydown', togglePrompt);




  document.querySelector('[data-tab="7"]').scrollIntoView(false);
}

function getPrompts(context) {
  $.ajax({
    url: 'http://localhost:5000/autocomplete',
    crossDomain: true,
    dataType: 'json',
    data: { context: context },
    success: (d) => {
      // console.log(d);
      displayPrompts(d.outputs, context);
    }
  });
}

function displaySentiment(val, idx) {
  var sentimentColor = "#27ae60";
  if (val.sentiment_class === "highly negative") {
    sentimentColor = "#c0392b";
  }
  else if (val.sentiment_class === "negative") {
    sentimentColor = "#e74c3c";
  }
  else if (val.sentiment_class === 'neutral') {
    sentimentColor = "#f1c40f";
  }
  else if (val.sentiment_class === "positive") {
    sentimentColor = "#2ecc71";
  }

  var imgParent = $('#main').find('header').find('._1l12d');
  $(imgParent).css("border", sentimentColor + " 3px solid");

  var sideParent = $($('._1MZWu')[idx]).find('._1l12d')
  $(sideParent).css("border", sentimentColor + " 3px solid");

  var name = $('#main').find('header').find('._1hI5g._1XH7x._1VzZY').text();
  $('#main').find('header').find('._1hI5g._1XH7x._1VzZY').text(name + " [Sentiment : " + val.sentiment_class + "]")

}

function getSentiment(context, idx) {
  $.ajax({
    url: 'http://localhost:5000/sentiment',
    crossDomain: true,
    dataType: 'json',
    data: { context: context },
    success: (d) => {
      // console.log(d);
      displaySentiment(d, idx);
    }
  });
  // var val = Math.floor(Math.random() * 10) - 2;
  // displaySentiment(val, idx);
}

function displayCalendar(vals, DOMs, context, authors, selfName) {
  var context = context.split('<SPLIT>');
  authors = [...new Set(authors)];
  var nonSelfNames = '';

  if (authors.length > 1) {
    nonSelfNames = authors.join(', ');
  }
  else {
    nonSelfNames = authors[0];
  }


  console.log(selfName, '-|-', nonSelfNames)
  console.log(vals, vals.length);

  for (var i = 0; i < vals.length; i++) {
    var temp = vals[i];
    console.log(context[i], temp)
    if (temp.has_calendar) {
      var message = context[i];
      var day = temp.day.padStart(2, '0');
      var month = String(temp.month).padStart(2, '0');
      var year = String(temp.year);
      var hour = temp.hour.split(":")[0];

      // var link = "https://calendar.google.com/calendar/u/0/r/eventedit?text=Quick Chat with " + nonSelfNames + "&details=This is a quick Chat with you (" + selfName + ") and " + nonSelfNames + ". This invite was automatically detected and created by You! &dates=20210222T190000Z/20210222T193000"
      var link = "https://calendar.google.com/calendar/u/0/r/eventedit?text=Quick Chat with " + nonSelfNames + "&details=This is a quick Chat with you (" + selfName + ") and " + nonSelfNames + ". This invite was automatically detected and created by You! &dates=" + year + month + day + "T" + hour + "0000Z/" + year + month + day + "T" + hour + "3000"

      $(DOMs[i]).text('')
      $(DOMs[i]).append('<span>' + message.slice(0, temp.start) + '<a target="_blank" href="' + link + '" style="text-decoration: underline;text-decoration-style: dashed;">' + message.slice(temp.start, temp.end) + '</a>' + message.slice(temp.end) + '</span>')

    }
  }

}

function getCalendar(c) {
  var context = c[0];
  var DOMs = c[1];
  var authors = c[2];
  var selfName = c[3];

  $.ajax({
    url: 'http://localhost:5000/calendar',
    crossDomain: true,
    dataType: 'json',
    data: { context: context },
    success: (d) => {
      // console.log(d);
      displayCalendar(d, DOMs, context, authors, selfName);
    }
  });

  // var vals = [
  //   { has_calendar: false },
  //   { has_calendar: true },
  //   { has_calendar: false },
  // ];
  // displayCalendar(vals, DOMs, context, authors, selfName);
}

$(document).ready(function () {

  console.log("Hello, you!");

  var icon = '<div style="position:absolute;right:10px;top:10px;z-index:10;padding: 2px;border: 2px solid #27ae60;border-radius: 10px;text-align: center;"><img src="https://raw.githubusercontent.com/nuwandavek/you/master/extension/icons48.png"><p>YOU</p><p style="font-size: 10px;">active</p></div>'
  $('body').append(icon)


  var tabListernerActive = false;
  var sentimentCalListenerActive = false;
  var interval = setInterval(function () {
    // document.body.style.border = '5px solid red'; 
    if (sentimentCalListenerActive === false) {
      if ($("._1MZWu").length > 0) {
        $("._1MZWu").click(function () {
          console.log("Get Sentiment");
          var idx = $(this).index();

          var sentimentContext = getContextForSentiment();
          getSentiment(sentimentContext, idx);

          console.log("Get Calendar");
          var c = getContextForCalendar();
          getCalendar(c);
        });
        sentimentCalListenerActive = true;
      }

    }
    if (tabListernerActive === false) {
      if ($('[data-tab="6"]').length > 0) {
        console.log($('[data-tab="6"]'), 'yoyo');
        console.log('Adding Event Listeners for tabs');
        $('[data-tab="6"]').on('keydown', function (e) {
          if (e.keyCode === 9) {
            e.stopPropagation();
            e.preventDefault();
            console.log('Tab!')
            $('[data-tab="6"]').blur();
            var context = generateContext();
            getPrompts(context);
          }
        });

        $('[data-tab="6"]').on('keypress', function (e) {
          if (e.keyCode === 9) {
            e.stopPropagation();
            e.preventDefault();
          }
        });

        tabListernerActive = true;
        console.log('cleared');
        clearInterval(interval);

      }
    }
  }, 1000);
});



