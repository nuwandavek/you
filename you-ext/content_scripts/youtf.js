(function() {
    console.log('hellohello');
    browser.runtime.onMessage.addListener((message) => {
        console.log('yo')
        console.log(message);
    });
  
  })();
  