function generateContext(){
  var selfName = '';
  var context = ''
  var messages = $(".focusable-list-item");
  messages = messages.slice(-5);
  messages.each(function () {
    var classes = $(this).attr('class');
    var type = '';
    if (classes.includes('message-in')){
      type = 'incoming';
    }
    else if (classes.includes('message-out')){
      type = 'outgoing';
    }
    var texts = $(this).find('.copyable-text');
    if(texts.length==2){
      console.log('reached')
      var metadata = $(texts[0]).data('prePlainText');
      var author = metadata.split(']')[1].trim();
      var time = metadata.split(']')[0].split('[')[1].trim()
      var message = $(texts[1]).text().trim();
      context += author + ' ' + message + '#';
      if (type==='outgoing' && selfName===''){
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

function displayPrompts(prompts, context){
  console.log(context);
  $('#predicted-prompts').remove();
  $('div[data-tab="7"]').append( "<div id='predicted-prompts' style='padding: 20px;margin: 20px; border-radius: 15px; background:#085373'></div>" );
  $('#predicted-prompts').append( "<p style='font-size: 10px; padding: 15px; font-weight: 900; text-transform: uppercase'>Predicted Responses</p>" );
  prompts.forEach((p)=>{
    p = p.generated_text.replace(context, '').trim();
    // console.log(p);

    //Select first complete message
    p = p.split('#')[0];
    $('#predicted-prompts').append( "<p class='prompt' style='border-radius: 5px; padding: 15px;border: 1px solid #083d53;margin: 5px; font-size: 14px'>"+p+"</p>" );
    
  })
  $('.prompt').on('mouseover',function(){
    $('.prompt').css('background','none');
    $(this).css('background','#083d53');
  })

  // $('.prompt')[0].trigger('mouseover');
  const mouseoverEvent = new Event('mouseover');
  document.querySelector('.prompt').dispatchEvent(mouseoverEvent);
  var currentSelectedPrompt = 0;
  var totalPrompts = prompts.length;

  $('.prompt').on('click',function(){
    document.querySelector('body').removeEventListener('keydown',togglePrompt);

    var currentMessage = $('div[data-tab="6"]').text();
    $('div[data-tab="6"]').text('');
    currentMessage = currentMessage.trim() + ' ' + $(this).text();
    $('div[data-tab="6"]').focus();
    document.execCommand('insertText', false, currentMessage);
    $('#predicted-prompts').remove();
    $('div[data-tab="6"]').siblings().hide();
  })

  function togglePrompt(e){
      console.log($('#predicted-prompts').length);
      if($('#predicted-prompts').length){
        e.preventDefault();
        e.stopPropagation();
  
        if (e.keyCode===38){
          // console.log('up');
          currentSelectedPrompt-=1;
          if (currentSelectedPrompt<0){
            currentSelectedPrompt = totalPrompts-1;
          }
          console.log('CURRENT_PROMPT_NO(up)',currentSelectedPrompt);
          document.querySelectorAll('.prompt')[currentSelectedPrompt].dispatchEvent(mouseoverEvent);
        
        }
        else if(e.keyCode===40){
          // console.log('down');
          currentSelectedPrompt+=1;
          if (currentSelectedPrompt>=totalPrompts){
            currentSelectedPrompt = 0;
          }
          console.log('CURRENT_PROMPT_NO(down)',currentSelectedPrompt);
          document.querySelectorAll('.prompt')[currentSelectedPrompt].dispatchEvent(mouseoverEvent);
  
        }
        else if(e.keyCode===27){
          // console.log('escape');
          $('#predicted-prompts').remove();
          document.querySelector('body').removeEventListener('keydown',togglePrompt);
          console.log('CURRENT_PROMPT_NO(escape)',currentSelectedPrompt);
          
          var currentMessage = $('div[data-tab="6"]').text();
          $('div[data-tab="6"]').text('');
          $('div[data-tab="6"]').focus();
          document.execCommand('insertText', false, currentMessage);
          
        }
        else if(e.keyCode===13){
          // console.log('enter');
          document.querySelector('body').removeEventListener('keydown',togglePrompt);
          console.log('CURRENT_PROMPT_NO(enter)',currentSelectedPrompt);
          document.querySelectorAll('.prompt')[currentSelectedPrompt].click();
        }
      }              
  }

  document.querySelector('body').addEventListener('keydown',togglePrompt);

  


  document.querySelector('[data-tab="7"]').scrollIntoView(false);
}

function getPrompts(context){
  $.ajax({
    url: 'http://localhost:5000/autocomplete',
    crossDomain: true,
    dataType: 'json',
    data: {context : context},
    success: (d)=>{
      // console.log(d);
      displayPrompts(d.outputs, context);
    }
  });
}


window.onload = (event) => {


  console.log("Hello");
  
  
  var tabListernerActive = false;
  setTimeout(function(){
  document.body.style.border = '5px solid red';
    if (tabListernerActive==false){
      document.querySelector('#pane-side').addEventListener('click',function(){
        console.log('CLICKED');
        document.querySelectorAll('[data-tab="6"]')[0].addEventListener('keydown',function(e){
          if(e.keyCode===9){
            e.stopPropagation();
            e.preventDefault();
            $('[data-tab="6"]').blur();
            var context = generateContext();
            getPrompts(context);
          }
        })
      
        document.querySelectorAll('[data-tab="6"]')[0].addEventListener('keypress',function(e){
          if(e.keyCode===9){
            e.stopPropagation();
            e.preventDefault();
          }
        })
        tabListernerActive = true;
      })
    }
    
  }, 2000);
};



