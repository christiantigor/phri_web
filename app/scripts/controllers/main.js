'use strict';

angular.module('phriApp')
  .controller('MainCtrl', function ($scope, $location, $filter, $http, $templateCache) {
    
    $scope.go = function (path) {
        $location.url(path);
      };
	
    $scope.goTo = function (type, id) {
        if(type === 'Hotel'){
            $location.url('transHotel?id=' + id);
		}
        else if(type === 'Parking'){
            $location.url('transParking?id=' + id);
        }
		else{
            $location.url('transRestaurant?id=' + id);
		}
    };
	
    //date
    $scope.todayDate = {
        'day':'',
        'date':'',
        'month':'',
        'year':''
    };
	
    $scope.gettingDate = function(){
        var today = new Date();
        
        var weekday = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
        var dy = weekday[today.getDay()];
        
        var dd = today.getDate();
        var month = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        var mm = month[today.getMonth()];
        var yyyy = today.getFullYear();
        
        if(dd<10){dd='0'+dd}
        
        $scope.todayDate.day = dy;
        $scope.todayDate.date = dd;
        $scope.todayDate.month = mm;
        $scope.todayDate.year = yyyy;
        $scope.todayDate.monYear = mm + ' ' + yyyy;
    }
    //end date
	
    $scope.initMain = function () {
        $scope.gettingDate();
        $scope.getTaxpayers(0);
        $scope.getTransactions(0);
      };
    
    $scope.initTaxpayer = function () {
        $scope.getTaxpayers(1);
    };
	
    $scope.initTransaction = function () {
        $scope.gettingDate();
        $scope.getTaxpayers(2);
        $scope.getTransactions(2);
        $scope.chartTaxRecords(); //nanti ditaro setelah getTaxRecord
    };
	
    /*main page*/
    $scope.newsticker = [
        { type: 'success', msg: 'Restaurant - McD Plaza Sentral 2014/02/14 16:30 tax: Rp 39.500,00' }
    ];
	
    $scope.closeNewsticker = function (index) {
        $scope.newsticker.splice(index,1);
    };
	
    $scope.taxpayersType = [];
	
    $scope.getTaxpayersType = function () {
        var ls = $filter('filter')($scope.taxpayers, 'Hotel');
        var temp = ['Hotel', ls.length];
        $scope.taxpayersType.push(temp);
		
        ls = $filter('filter')($scope.taxpayers, 'Parking');
        temp = ['Parking', ls.length];
        $scope.taxpayersType.push(temp);
		
        ls = $filter('filter')($scope.taxpayers, 'Restaurant');
        temp = ['Restaurant', ls.length];
        $scope.taxpayersType.push(temp);
		
        console.log($scope.taxpayersType);
      };
	
    $scope.chartTaxpayersType = function () {
        c3.generate({
          bindto: '#chartTaxpayersType',
          data: {
			// iris data from R
            columns: $scope.taxpayersType,
            type: 'pie',
            labels: true
          },
          pie: {
            onclick: function (d, i) { console.log(d, i); },
            onmouseover: function (d, i) { console.log(d, i); },
            onmouseout: function (d, i) { console.log(d, i); }
          }
        });
      };
	  
    $scope.transactionOverview = function () {
        $scope.numTransHotel = $scope.hotelTransactions.length;
        $scope.numTransParking = $scope.parkingTransactions.length;
        $scope.numTransRestaurant = $scope.restaurantTransactions.length;
        $scope.numTrans = $scope.numTransHotel + $scope.numTransParking + $scope.numTransRestaurant;
		
        $scope.avgTransHotel = parseFloat(($scope.hotelTransactions.length/$scope.todayDate.date).toFixed(2));
        $scope.avgTransParking = parseFloat(($scope.parkingTransactions.length/$scope.todayDate.date).toFixed(2));
        $scope.avgTransRestaurant = parseFloat(($scope.restaurantTransactions.length/$scope.todayDate.date).toFixed(2));
        $scope.avgTrans = parseFloat(($scope.numTrans/$scope.todayDate.date).toFixed(2));
    };
	
    $scope.taxOverview = function () {
	    var hTax = (_.reduce($scope.hotelTransactions, function (memo, num){
            return memo + num.total;
        }, 0));
        var pTax = (_.reduce($scope.parkingTransactions, function (memo, num){
            return memo + num.amount;
        }, 0));
        var rTax = (_.reduce($scope.restaurantTransactions, function (memo, num){
            return memo + num.total;
        }, 0));
		var monTax = hTax + pTax + rTax;
		var valTax = Math.round(monTax / 2); //valTax is 50% of monTax. It's arbitrary.
        $scope.monitoredTax = $scope.addDot(monTax);
        $scope.validatedTax = $scope.addDot(valTax);
    };
	
    $scope.addDot = function (nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while(rgx.test(x1)){
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return x1 + x2;
    };
	
    /*end main page*/
	
    /*taxpayer page*/
    $scope.urlTaxpayers = 'http://testingpurpose.eu5.org/getTaxPayers';
	
    $scope.getTaxpayers = function (purpose) {
      $http({
        method: 'GET',
        url: $scope.urlTaxpayers,
        data: '',
        cache: $templateCache }).
      success(function(data) {
        $scope.listTaxpayers(data, purpose);
        return data;
      }).
      error(function(data) {
        $scope.getTaxpayers(purpose);
        return data;
      });
    };

    $scope.taxpayers = [];
	
    $scope.listTaxpayers = function (taxpayerList, purpose) {
        taxpayerList.forEach(function (t) {
            try{
                $scope.taxpayers.push({
                    id: t.taxPayersId,
                    type: t.type,
                    name: t.name,
                    address: t.address,
                    phone: t.phone,
                    monitoredTax: parseInt(t.monitoredTax),
                    validatedTax: parseInt(t.validatedTax),
                    onDevice: t.onDevice,
                    offDevice: t.offDevice,
                    lat: parseFloat(t.lat),
                    lng: parseFloat(t.lng),
                    message: '<h5><right><strong>' + t.type + ' - ' + t.name +
					'</strong></right></h5><h6><strong>' + t.address +
					'</strong></h6><h6>Monitored tax: <strong><font color="grey">Rp ' +
					t.monitoredTax + ',00</font></strong></h6><h6>Validated tax: <strong><font color="blue">Rp ' +
					t.validatedTax+ ',00</font><strong></h6>'
                });
            }
		    catch(err){
                console.log('error list taxpayer');
            }
		});
		
		//after taxpayers data loaded
        if(purpose === 0){ //main page
            $scope.getTaxpayersType();
            //$scope.chartTaxpayersType();
        }
        else if(purpose === 1){ //taxpayer page
		
        }
		else if(purpose === 2){ //transaction page
            $scope.currentTaxpayer();
            //$scope.loadTable();
        }
		
    };
	
	
	//leaflet
    $scope.defaults = {
	    scrollWheelZoom: false
    };
    $scope.center = {
        lat: -6.9104,
        lng: 107.6344,
        zoom: 12
      };
    $scope.markers = {
	    m1: {
		    lat: 52.52,
            lng: 13.40
        }
	};
	//end leaflet
	
	//get taxpayer icon
    $scope.getTaxpayerIcon = function (tp){
        if(tp.type === 'Hotel') {
            return 'fa fa-building-o';
        }
        else if(tp.type === 'Parking') {
            return 'fa fa-truck';
        }
        else if(tp.type === 'Restaurant') {
            return 'fa fa-cutlery';
        }
        else{
            return 'fa fa-windows';
        }
    };
	//end get taxpayer icon
	
    $scope.currentTaxpayer = function () {
        var selectedTaxpayer;
        var urlParam;
		
        var taxpayerParam = $location.url();
		for (var i=0; i<taxpayerParam.length; i++) {
            if ((taxpayerParam[i] === '=') && (i < taxpayerParam.length)) {
                urlParam = taxpayerParam[i+1];
            }
            else if ((urlParam != undefined) && (i+1 < taxpayerParam.length)) {
                urlParam += taxpayerParam[i+1];
			}
		}
        urlParam += '=';
        console.log(urlParam);
        selectedTaxpayer = _.filter($scope.taxpayers, function (obj) {
            return obj.id == urlParam;
        });
        $scope.selectedTaxpayer = JSON.parse(JSON.stringify(selectedTaxpayer[0]));
	};
	/*end taxpayer page*/
	
	
	/*transaction page*/
    //$scope.urlTransactions = 'data/getTransactions.json';
    $scope.urlTransactions = 'http://testingpurpose.eu5.org?fx=getRestaurantTransList';
	
    $scope.getTransactions = function (purpose) {
      $http({
        method: 'GET',
        url: $scope.urlTransactions,
        data: '',
        cache: $templateCache }).
      success(function(data) {
        $scope.listTransactions(data, purpose);
        return data;
      }).
      error(function(data) {
        $scope.getTransactions(purpose);
        return data;
      });
    };

    $scope.restaurantTransactions = [];
	
    $scope.listTransactions = function (transactionList, purpose) {
        transactionList.forEach(function (t) {
            try{
                $scope.restaurantTransactions.push({
                    transId: t.transId,
                    dateTime: t.dateTime,
                    total: parseInt(t.total),
                    service: parseInt(t.service),
                    receipt: t.receipt
                });
            }
		    catch(err){
                console.log('error list transaction');
            }
		});
        //after transactions data loaded
		if(purpose === 0){ //main page
            $scope.transactionOverview();
            $scope.taxOverview();
        }
        else if(purpose === 1){ //taxpayer page
        }
		else if(purpose === 2){ //transaction page
            $scope.loadTable();
            $scope.chartTransRecords();
        }
    };
	
    //parking transaction
	$scope.parkingTransactions = [];
    //end parking transaction
	
	//entertainment or hotel transaction
	$scope.hotelTransactions = [];
	//end enteratainment or hotel transaction
	
    $scope.chartTaxRecords = function () {
        c3.generate({
          bindto: '#chartTaxRecords',
          data: {
            x: 'date',
            x_format: '%Y%m',
            columns: [
              ['date', '201401', '201402', '201403', '201404', '201405'],
              ['validated', 15.5, 15.3, 15.5, 15.3, 7.7],
              ['not-validated', 0.3, 0, 0.2, 0.7, 7.7]
            ],
            type: 'bar',
            groups: [
              ['validated', 'not-validated']
            ],
            subchart: {
                show: true
            },
          },
          grid: {
              y: {
                lines: [{value:0}]
              }
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%b %y'
                }
              },
              y: {
                label: 'Million Rupiah'
              }
            }
          });
      };
	  
    $scope.chartTransRecords = function () {
        c3.generate({
          bindto: '#chartTransRecords',
          data: {
            x: 'date',
            x_format: '%Y%m%d-%H',
            columns: [
              ['date', '20130101-10', '20130101-11', '20130101-12', '20130101-13', '20130101-14', '20130101-15', '20130101-16', '20130101-17', '20130101-18', '20130101-19', '20130101-20'],
              ['cashier 1', 2, 6, 16, 19, 16, 12, 5, 6, 2, 0, 3],
              ['cashier 2', 1, 3, 2, 0, 5, 15, 6, 8, 12, 15, 7]
            ]
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%d %b %H:%M'
              }
            },
            y: {
              label: 'Transaction'
            }
          },
		  subchart: {
            show: true
          }
        });
      };
	
    $scope.loadTable = function () {
        $('#dataTables-example').dataTable();
    };
	
	//report
    $scope.drawRestaurantReport = function(){
        var doc = new jsPDF('p', 'mm', 'a4');
        var top = 13.5;
        var left = 15;
        var width = 180;
		var half = 37.5; //start of table
        var height = 270;
        var margin = 5;
        var lineHeight = 8;
        
		//splitting transaction list
        var iArr;
		var jArr;
		var tempArr;
		var chunk = 10; //amount of transactions on a page
		var fPg = true; //indicator for first page
        var page = 1;
		
		for (iArr=0,jArr=$scope.restaurantTransactions.length;iArr<jArr;iArr+=chunk){
            tempArr = $scope.restaurantTransactions.slice(iArr,iArr+chunk);
			
			//check if first page
			if(fPg){
                fPg = false;
			}
			else{
                doc.addPage();
            }
			
			//report border
            doc.setDrawColor(0);
            doc.rect(left, top, width, height, 'stroke');
			
			//document title and date
            doc.setFontSize(28);
            doc.setFontStyle("bold");
            doc.text(left + margin / 4, top + 2.25 * margin, $scope.selectedTaxpayer.name);
            doc.setTextColor(215, 24, 104);
            doc.setFontStyle("italic");
            doc.text(left + 3 * width / 4, top + 2.25 * margin, $scope.todayDate.monYear);
            doc.setTextColor(0);        
            //line under title row
            doc.lines([
                [width, 0]
            ], left, 2 * lineHeight + top)
			
			//create table
            for(var i=0; i <= (tempArr.length + 1); i++){
                //create rows as many as transactions on tempArr + 1 for header row
                doc.lines([
                    [width, 0]
                ], left, half + i * lineHeight)
            
                //create columns of |Id|Date Time|Total(Rp)|Service(Rp)|Receipt|
                doc.lines([
                    [0, i * lineHeight]
                ], left + width / 5, half);
                doc.lines([
                    [0, i * lineHeight]
                ], left + 2 * width / 5, half);
                doc.lines([
                    [0, i * lineHeight]
                ], left + 3 * width / 5, half);
                doc.lines([
                    [0, i * lineHeight]
                ], left + 4 * width / 5, half);
                doc.lines([
                    [0, i * lineHeight]
                ], left + 5 * width / 5, half);
            
                //header row
                doc.setFontSize(8);
                doc.setFontStyle("italic");
                doc.setTextColor(96, 189, 21);
                doc.text('Id', left + margin / 4, half + margin);
                doc.text('Date Time', left + width / 5 + margin / 4, half + margin);
                doc.text('Total(Rp)', left + 2 * width / 5 + margin / 4, half + margin);
                doc.text('Service(Rp)', left + 3 * width / 5 + margin / 4, half + margin);
                doc.text('Receipt', left + 4 * width / 5 + margin / 4, half + margin);
                doc.setTextColor(0);
            }
			
            //fill the table
            var iTrans =1;
            doc.setFontStyle("normal");
            for (var t in tempArr) {
                doc.text(left + margin / 4, iTrans * lineHeight + half + margin , tempArr[t].id.toString());
                doc.text(left + width / 5 + margin / 4, iTrans * lineHeight + half + margin , tempArr[t].time);
                doc.text(left + 2 * width / 5 + margin / 4, iTrans * lineHeight + half + margin , $scope.addDot(tempArr[t].total));
                doc.text(left + 3 * width / 5 + margin / 4, iTrans * lineHeight + half + margin , $scope.addDot(tempArr[t].service));
                doc.text(left + 4 * width / 5 + margin / 4, iTrans * lineHeight + half + margin , tempArr[t].receipt.toString());
                iTrans++;
            }
			
			//page number
            doc.setFontSize(10);
            doc.setFontStyle("bold");
            doc.text(left + width / 2, top + height + lineHeight, page.toString());
            page++;
        }
		
        doc.save('Transaction List_' + $scope.selectedTaxpayer.name + '_' + $scope.todayDate.monYear + '.pdf');
	};
	
	/*end transaction page*/
	
    $scope.$watch('searchText', function() {
	
        $scope.filteredTaxpayers = $filter('filter')($scope.taxpayers, $scope.searchText);
		
        if($scope.searchText === '' || $scope.initMap === 0){
            $scope.center = {
                lat: -6.219404,
                lng: 106.812365,
                zoom: 12 
            };
            $scope.initMap = 1;
        }
		else{
            if($scope.filteredTaxpayers.length > 0){
                $scope.center = {
                    lat: $scope.filteredTaxpayers[0].lat,
                    lng: $scope.filteredTaxpayers[0].lng,
                    zoom: 14
                };
			}
            else{
                $scope.center = {
                    lat: -6.9104,
                    lng: 107.6344,
                    zoom: 12
                };
            }
        }
		
    });
});