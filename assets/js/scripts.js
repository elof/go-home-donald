!function(name,path,ctx){
  var latest,prev=name!=='Keen'&&window.Keen?window.Keen:false;ctx[name]=ctx[name]||{ready:function(fn){var h=document.getElementsByTagName('head')[0],s=document.createElement('script'),w=window,loaded;s.onload=s.onerror=s.onreadystatechange=function(){if((s.readyState&&!(/^c|loade/.test(s.readyState)))||loaded){return}s.onload=s.onreadystatechange=null;loaded=1;latest=w.Keen;if(prev){w.Keen=prev}else{try{delete w.Keen}catch(e){w.Keen=void 0}}ctx[name]=latest;ctx[name].ready(fn)};s.async=1;s.src=path;h.parentNode.insertBefore(s,h)}}
}('Keen', 'https://d26b395fwzu5fz.cloudfront.net/keen-tracking-0.1.1.min.js', this);

Keen.ready(function(){

  var client = window.keenClient = new Keen({
    projectId: '56b299483bc69621b7decc35',
    writeKey: 'c22c34473a1374f6e8397d739b728dde8e9286db07a362ad4c3693976e23b2a2d471e608faf5611b9c48c9391dd17df8b02a0df4ebdaa28afe3d546ef2b50212575fce6aac3ade803013bdb2a2f503877b39ba55e08f69ee31b14469061758fe'
  });

  var sessionCookie = Keen.utils.cookie('keen-example-cookie');
  if (!sessionCookie.get('user_id')) {
    sessionCookie.set('user_id', Keen.helpers.getUniqueId());
  }

  var sessionTimer = Keen.utils.timer();
  sessionTimer.start();

  Keen.listenTo({
    'click .flag img': function(e){
      // 500ms to record an event
      // e.preventDefault();
      client.recordEvent('bernie');
    }
  });


  // THE BIG DATA MODEL!

  client.extendEvents(function(){
      return {
          page: {
              title: document.title,
              url: document.location.href
              // info: {} (add-on)
          },
          referrer: {
              url: document.referrer
              // info: {} (add-on)
          },
          tech: {
              browser: Keen.helpers.getBrowserProfile(),
              // info: {} (add-on)
              ip: '${keen.ip}',
              ua: '${keen.user_agent}'
          },
          time: Keen.helpers.getDatetimeIndex(),
          visitor: {
              id: sessionCookie.get('user_id'),
              time_on_page: sessionTimer.value()
          },
          // geo: {} (add-on)
          keen: {
              timestamp: new Date().toISOString(),
              addons: [
                  {
                      name: 'keen:ip_to_geo',
                      input: {
                          ip: 'tech.ip'
                      },
                      output: 'geo'
                  },
                  {
                      name: 'keen:ua_parser',
                      input: {
                          ua_string: 'tech.ua'
                      },
                      output: 'tech.info'
                  },
                  {
                      name: 'keen:url_parser',
                      input: {
                          url: 'page.url'
                      },
                      output: 'page.info'
                  },
                  {
                      name: 'keen:referrer_parser',
                      input: {
                          page_url: 'page.url',
                          referrer_url: 'referrer.url'
                      },
                      output: 'referrer.info'
                  }
              ]
          }
      };
  });

  client.recordEvent('pageview');
});
