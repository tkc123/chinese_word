
var app = angular.module( 'myApp', ['onsen']);


/* =====================
  top.index
===================== */

app.controller('topCtrl', function(){
	
	this.gameStart = function(){
		//myNavigator.pushPage('select.html');
        myNavigator.pushPage('game.html');
	};
});

/* =====================
  result.index
===================== */

app.controller('resultCtrl', function(){
	
	var me = this;
    
    //var myChart = {};
	
//	var rate = 100;
//	me.items = myNavigator.getCurrentPage().options;
//	me.items.score = me.items.rightNum * rate;
	
	var config = {
		type: 'doughnut',
		data: {
		    labels: ["正解", "不正解"],
		    datasets: [{
              label: ["正解","不正解"],
              backgroundColor: ["rgba(102,187,106,0.8)","rgba(213,95,135,0.8)"],
              data: [1, 3]
          }]
		},
		options: {
			responsive: true,
			legend: {
				display: false
			}
		}
	};
    
    var can = document.getElementById('myChart');
    var ctx = can.getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }

	var myChart = new Chart(ctx, config);
    
    console.log( myChart.config );

	
	this.backTop = function(){
		myNavigator.pushPage('select.html', { animation: "default" });
	};
});

/* =====================
  select.index
===================== */

app.controller('selectCtrl', function(questionsService,$scope){
    
    var me = this;
    me.items = {};
    
    var questions = null;
    
    var init = function() {
        questions = JSON.parse(JSON.stringify(questionsService.questions.num));
        //me.items.totalNum = questions.length;
    };
	
   console.log( questionsService.questions.length );
    
	this.userMove = function(){
		myNavigator.pushPage('user.html');
	};
	
	this.gameStart = function() {
		myNavigator.pushPage('game.html');
	};
    
    this.shareMove = function() {
        myNavigator.pushPage('share.html');
    }
	init();
});

/* =====================
  user.index
===================== */

app.controller('userCtrl', function(){
   
    var me = this;
    var can = document.getElementById('myChart');
	var ctx = can.getContext('2d');
    
    var config = {
    	type: 'doughnut',
		data: {
		    labels: ["正解", "不正解"],
		    datasets: [{
              label: ["正解","不正解"],
              backgroundColor: ["rgba(102,187,106,0.8)","rgba(213,95,135,0.8)"],
              data: [1, 3]
          }]
		},
		options: {
			responsive: true,
			legend: {
				display: false
			}
		}
	};

	var myChart = new Chart(ctx, config);
    //myChart.destroy();
    
   // console.log( myChart );

  
    this.userReturn = function() {
    	myNavigator.pushPage('select.html');
	};
    
    this.shareMove = function() {
        myNavigator.pushPage('share.html');
    };
    
});

/* =====================
  share.index
===================== */

app.controller('shareCtrl', function() {
    
    this.userMove = function() {
        myNavigator.pushPage('user.html');
    }
    
    this.shareReturn = function() {
        myNavigator.pushPage('select.html');
    };
    
});

/* =====================
  game.index
===================== */

app.controller('gameCtrl', function(questionsService,$scope){
	
	var me = this;
	me.items = {};
	var rightNum = 0;
	var missNum = 0;
	var answerNum = null;
	var questions = null;
	
//	var currentCatName = myNavigator.getCurrentPage().options;
	
	//alert ( currentCatName );
	
	var init = function(){
		me.items.currentNum = 0;
		questions = JSON.parse(JSON.stringify(questionsService.questions.num)); //動的にするには.numを変数へ
        
		me.items.totalNum = questions.length;
        console.log( questions );
		questionInit();
	}
	
	//解答選択肢
	var questionInit = function() {
		var currentQ = questions[me.items.currentNum];
		var qLength = currentQ.choices.length;
		answerNum = Math.floor(Math.random() * (qLength + 1));
		currentQ.choices.splice(answerNum , 0 , currentQ.answer);
		me.items.currentQ = currentQ;
	};
	
	//解答ボタンを押したら
	me.getAnswer = function(ind){
		var flag = answerNum == ind;//正解or間違いの判定
		var flagText = "間違い";
		if(flag){
			rightNum++;
			flagText= "正解";
		} else {
			missNum++;
		};
		
		ons.notification.alert({ //解答をアラート表示
			message: '正解は『' + me.items.currentQ.choices[answerNum] + '』です',
			title: flagText,
			buttonLabel: '次へ',
			animation: 'default',
			callback: function(){ //NEXTがクリックされたら
				if(me.items.currentNum >= me.items.totalNum-1){
					myNavigator.pushPage('result.html',{totalNum:me.items.totalNum,rightNum:rightNum,missNum:missNum});
				}else{ //まだクイズが残っていれば
					me.items.currentNum++;
					$scope.$apply(questionInit); //次のクイズを用意
				}
			}
		});
	};
	
	//confirmの作成
	me.warnConfirm = function(){
		ons.notification.confirm({	
			title: '',
			message: 'クイズを中断してトップに戻ります。よろしいですか？',
			animation: 'default', 
			buttonLabels: ["はい", "いいえ"],
			callback: function(answer) { // YES...0 NO...1
				if (answer == 0) {//OKが押されたら
					myNavigator.pushPage('select.html', { animation: "default" });
				}
			}
    	});
	};
	
	//closeボタンがクリックされたらトップページへ戻る
	me.backTop = function(){
		myNavigator.pushPage('top.html', { animation: "none" });
	};
	init();
});