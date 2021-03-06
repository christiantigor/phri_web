'use strict';

/* Controllers */

function ItemController(key) {
	return	function($scope, canvasService) {
	  	 $scope.showInput = false;
	 
		 $('.icon').tooltip({placement: 'bottom'});
	 
		 $scope.getItems = function(){
			 return canvasService.getItems(key);
		 };
	 
		 $scope.addItem = function(text){
			 canvasService.addItem(key,text);
			 $scope.text = ''
		 };
	 
		 $scope.deleteItem = function(idx){
			 canvasService.deleteItem(key, idx);
		 };
  	 
	  }
	
};


angular.module('quickcanvas.controllers', []).
	controller('NavCtrl', ['$scope', '$route', '$location', 'canvasService','pdfService', function($scope,$route,$location, canvasService, pdfService){
		 
		 $scope.showTooltips = false; 
		  
		  $scope.$on('$routeChangeSuccess', function() {
			  $scope.currentPath = $location.path();
			//If this doesn't work, console.log $route.current to see how it's formatted
			$scope.showTooltips = false;
		  });
		  
		  
		  
		  $scope.clearData = function(){
			  if (confirm("Do you really want to reset the canvas? Any data inside it will be lost forever.")){
			  	canvasService.clearData();
			  }
		  };

		$scope.showExport = function(){
			$scope.downloadMessage = '';
			// $scope.problems = canvasService.getLines('problems');

			$('#downloadModal').modal('show');	//Berguna untuk menampilkan "download" window jika memakai bootstrap
			Downloadify.create('downloadify',{
						filename: 'LeanCanvas.pdf',
						data: pdfService.drawPdf,
						onComplete: function(){ $('#downloadModal').modal('hide');},
						onCancel: function(){ $('#downloadModal').modal('hide'); },
						onError: function(){ $('#downloadModal').modal('hide');},
						swf: 'images/jspdf/downloadify.swf',
						downloadImage: 'images/jspdf/download.png',
						width: 100,
						height: 30,
						transparent: true,
						append: false
					});			// alert('Export ' + canvasService.getJson()); 
		};
		
		$scope.showHelp = function(){
			//alert('Show help');
			$scope.showTooltips = !$scope.showTooltips;
			if ($scope.showTooltips){
				$('.icon').tooltip({placement: 'bottom',trigger: 'manual'}).tooltip('show');
				
			} else {
				$('.icon').tooltip('hide').tooltip();		
						
			}
			
		};
	
	}])
  .controller('CanvasCtrl', [function(){

  }])
  .controller('AboutCtrl', [function() {

  }])
  .controller('ContactCtrl', [function() {

  }])
  .controller('ProblemCtrl', ['$scope', 'canvasService', ItemController('problems') ])
  .controller('SolutionCtrl', ['$scope', 'canvasService', ItemController('solutions') ])
  .controller('KeyMetricCtrl', ['$scope', 'canvasService', ItemController('key_metrics') ])	  
  .controller('UniqueValueCtrl', ['$scope', 'canvasService', ItemController('unique_value') ])	  
  .controller('UnfairAdvCtrl', ['$scope', 'canvasService', ItemController('unfair_advantage') ])
  .controller('ChannelCtrl', ['$scope', 'canvasService', ItemController('channels') ])
  .controller('CustomerSegmCtrl', ['$scope', 'canvasService', ItemController('customer_segments') ])
  .controller('ChannelCtrl', ['$scope', 'canvasService', ItemController('channels') ])
  .controller('CostStructCtrl', ['$scope', 'canvasService', ItemController('cost_structure') ])
  .controller('RevenueStreamCtrl', [ '$scope', 'canvasService', ItemController('revenue_streams')]);
  