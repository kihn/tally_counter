;
(function($) {
  var methods = {
    init : function(options) {
      return this.each(function() {
        var self = $(this);
        var data = self.data('tallyCounter');
        var config = $.extend({}, $.fn.tallyCounter.defaults, options);
        var digits = new Array(config.columns);
        if (!data) {
          data = {
            target : self,
            config : config,
            digits : digits,
            number : config.startNumber
          };
          self.data('tallyCounter', data);
        } else {
          digits = data.digits;
        }
        self.css({
          width : (config.widthNumber * config.columns) + 'px',
          height : config.heightNumber + 'px',
          overflow : 'hidden',
          position : 'relative'
        });
        var pos = 0;
        if (config.direction == 'down') {
          pos = config.heightNumber * -10;
        }
        for ( var i = 0; i < config.columns; i++) {
          var img = $('<img/>');
          img.attr({
            id :  self.attr('id')+ '_digit_' + i,
            src : config.numbersImage,
            alt : 'digit_' + i
          });
          img.css({
            position : 'absolute',
            right : (config.widthNumber * i) + 'px',
            top : pos + 'px'
          });
          img.appendTo(self);
        }
        privateMethod.reflect(data);
        self.data('tallyCounter', data);
      });
    },
    inc : function(number) {
      return this.each(function() {
        var self = $(this);
        var data = self.data('tallyCounter');
        if( String(number).length <= data.config.columns){
          data.number += number;
          privateMethod.reflect(data);

          self.data('tallyCounter', data);
        }
      });
    },
    dec : function(number) {
      return this.each(function() {
        var self = $(this);
        var data = self.data('tallyCounter');
        if(data.number > 0){
          data.number -= number ;
          privateMethod.reflect(data);

          self.data('tallyCounter', data);
        }
      });
    },
    current : function(){
      return this.each(function() {
        var self = $(this);
        var data = self.data('tallyCounter');
        //console.log(data);
        return data.number;
      });
    },
    
    set : function(number){
      return this.each(function() {
        var self = $(this);
        var data = self.data('tallyCounter');
        data.number = number;
        privateMethod.reflect(data);

        self.data('tallyCounter', data);
      });
    },
    parupunte : function(){
      return this.each(function() {
        var self = $(this);
        var data = self.data('tallyCounter');
        privateMethod.random_start(data);

        self.data('tallyCounter', data);
      });
    }
  };

  var privateMethod = {
    random_start: function(data){
      var rand_cycle = function(){
        for(var j = 0; j < data.config.columns; j++){
          var img = $('#'+ data.target.attr('id') + '_digit_' + j + ":animated");
          if(img.lenfth == 0){
            continue;
          }
          var to = 0;
          var from = -600;
          var speed = 500 + parseInt((Math.random() * 3500));
          if( Math.round((Math.random() * 1)) % 2 == 0){
            to = -600;
            from = 0;
          }
          img.animate({top:from},1, 'swing').animate({top: to}, speed, 'linear').animate({top: from}, 1, 'swing', rand_cycle);
        }
      };
      for(var i = 0; i < data.config.columns; i++){
        var img = $('#'+ data.target.attr('id') + '_digit_' + i);
        var top= 0;
        if( Math.round((Math.random() * 1)) % 2 == 0){
          top = -600;
        }
        img.animate({top: top}, 1, 'swing', rand_cycle);
      }
    },
    reflect : function(data) {
      var tempArray = String(data.number).split('').reverse();
      if (data.config.columns < tempArray.length) {
        for ( var i = 0; i < data.config.columns; i++) {
          tempArray[i] = '9';
        }
      } else if (parseInt(String(data.number)) < 0) {
        tempArray = '000'.split('');

      }
      //console.log(tempArray.join(',').split(''));
      if(data.config.rankupHandler != null){
        var uniques = $.unique(tempArray.join(',').split(','));

        var flg = false;
        if(tempArray.length == 3 && uniques.length == 1){
          flg = true;
        }
        else{
          flg = false;
        }
        data.config.rankupHandler.apply(this, new Array(flg, $(data.target.parent())));
      }
      
      var direct = -1;
      var startPos = 0;

      if (data.config.direction == 'down') {
        direct = 1;
        startPos = data.config.heightNumber * 10 * -1;
      }
      for ( var i = 0; i < data.config.columns; i++) {
        if (tempArray[i] != data.digits[i]) {
          
          var next = 0;
          var img = $('#'+ data.target.attr('id') + '_digit_' + i);
          if (tempArray[i] == '1' && data.digits[i] == '0') {

            next = startPos
                + (parseInt(tempArray[i]) * data.config.heightNumber * direct);
            img.animate({top : startPos}, 0, 0).animate({
              top : next
            }, 500, 'swing').animate({
              top : next
            }, 1, 'linear');
          } else if (data.digits[i] == '9' && tempArray[i] == '0') {
            next = (startPos + (data.config.heightNumber * 10)) * direct;
            img.animate({
              top : next
            }, 500, 'swing').animate({
              top : next
            }, 1, 'linear');
          } else {
            if (data.digits[i] == null || tempArray[i] > data.digits[i]) {
              next = startPos
              + (((parseInt(tempArray[i])) * data.config.heightNumber) * direct);
              if(data.digits[i] == '0'){
                img.animate({top : startPos}, 0, 0).animate({
                  top : next
                }, 500, 'swing').animate({
                  top : next
                }, 1, 'linear');
              }else{
                next = startPos
                + (((parseInt(tempArray[i])) * data.config.heightNumber) * direct);
                img.animate({
                  top : next
                }, 500, 'swing').animate({
                  top : next
                }, 1, 'linear');
              }
            } else {
              img.animate({
                top : (data.config.heightNumber * 10 * direct)
              }, 500 * ((10 - data.digits[i]) / 10), 'swing').animate({
                top : startPos
              }, 1, 'linear').animate({top :(tempArray[i] * data.config.heightNumber * direct)}, 
                  500 * data.digits[i] / 10, 'swing');
            }
          }
          data.digits[i] = tempArray[i];

        }
      }
      
    }

  };

  $.fn.tallyCounter = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments,
          1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist');
    }
  };

  $.fn.tallyCounter.defaults = {
    numbersImage : "images/up.png",
    heightNumber : 60,
    widthNumber : 60,
    columns : 3,
    startNumber : 0,
    direction : "up",
    rankupHandler: null
  };
})(jQuery);
