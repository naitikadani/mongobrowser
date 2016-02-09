/**
 * Created with JetBrains WebStorm.
 * User: vishant
 * Date: 13/4/15
 * Time: 3:24 PM
 * To change this template use File | Settings | File Templates.
 */


app.controller('mainController',['$scope', '$http',
    function mainController($scope, $http) {

        $scope.formData = {};
        $scope.connectionstatus=null;
        /*$scope.formData.host = "localhost";
        $scope.formData.port = "27017";*/
        $scope.numberofdatabases = 0;
        $scope.numberofcollections = 0;
        $scope.count = 0;

        $scope.isdataloaded = false;

        $scope.connectToMongo =  function(){
            if($scope.formData.host && $scope.formData.host != "" && $scope.formData.port && $scope.formData.port != "" ){  //&& $scope.formData.dbname && $scope.formData.dbname != ""
                $http.post('/connect',$scope.formData).success(function(data) {
                    if(data[0] == "1"){
                        $scope.connectionstatus=true;
                        $scope.getDatabases();

                    }
                    else if ( data[0] == "0"){
                        $scope.connectionstatus=false;
                        $scope.databases = [];
                        $scope.collections = [];
                        $scope.jsondata = [];
                        $scope.numberofdatabases = 0;
                        $scope.numberofcollections = 0;
                        $scope.formData.dbname = "";
                    }
                }).error(function(data) {
                        console.log('Error: ' + data);
                    });
            }
        };

        $scope.submit = function() {
            $scope.isdataloaded = false;
            $scope.startloader = true;
            $scope.formData.p = $scope.currentPage;
            $scope.formData.ps = $scope.pageSize;

            $http.post('/mongodata', $scope.formData).success(function(data) {
                    $scope.jsondata = data.data;
                    $scope.totalRecords = data.count;
                    $scope.totalPage = Math.ceil(parseFloat($scope.totalRecords) / $scope.pageSize) ;
                    $scope.startloader = false;
                    $scope.isdataloaded = true;

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

        $scope.executeAsItIs = function(){

            $scope.isdataloaded = false;

            $http.post('/mongoexecuteasits', $scope.formData).success(function(data) {
                console.log(data);
                if(data.result == '1'){
                    console.log("success");
                    $scope.submit();
                }
            /*    $scope.jsondata = data;
                $scope.count = $scope.jsondata.length;*/
                $scope.isdataloaded = true;

            })
                .error(function(data) {
                    console.log('Error: ' + data);
                    console.log("Failed");
                });
        }

        $scope.getDatabases = function() {
            //$scope.isdataloaded = false;

            $http.post('/mongodatabases', $scope.formData).success(function(data) {
                $scope.databases = data.databases;
                $scope.numberofdatabases = data.databases.length;
               // $scope.isdataloaded = true;

            })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            $scope.jsondata = [];
            $scope.isdataloaded = false;
            $scope.count = 0;
        };

        $scope.getCollections = function() {
            //$scope.isdataloaded = false;

            $http.post('/mongocollections', $scope.formData).success(function(data) {
                $scope.collections = data;
                $scope.numberofcollections = $scope.collections.length;
            })

                .error(function(data) {
                    console.log('Error: ' + data);
                });
            $scope.formData.text = "";
            $scope.jsondata = [];
            $scope.isdataloaded = false;
            $scope.count = 0;
        };

        $scope.formData.text = "";

        $scope.setCollectionName = function (collection){
                $scope.formData.text = "db."+collection+".find()";
                $scope.submit();
        }

        $scope.createBackup = function(){
            $http.post('/mongodump', $scope.formData).success(function(data) {
                $scope.collections = data;
                $scope.numberofcollections = $scope.collections.length;
            })

                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }

        $scope.pageSize = 20;
        $scope.currentPage = 1;
        $scope.totalRecords = 0;
        $scope.totalPage = 0;
        $scope.getFirstPage = function(){
            if($scope.currentPage == 1){
                return;
            }
            $scope.currentPage = 1;
            getData();
        };
        $scope.getLastPage = function(){
            if($scope.currentPage == $scope.totalPage){
                return;
            }
            $scope.currentPage = $scope.totalPage;
            getData();
        };
        $scope.getNextPage = function(){
            if($scope.currentPage >= $scope.totalPage){
                return;
            }
            $scope.currentPage += 1;
            getData();
        };
        $scope.getPrevPage = function(){
            if($scope.currentPage <= 1){
                return;
            }
            $scope.currentPage -= 1;
            getData();
        };

        var getData = function(){
            $scope.submit();
        };
    }
]);
