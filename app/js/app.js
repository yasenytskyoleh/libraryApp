/**
 * Created by Admin on 09.03.2017.
 */
var module = angular.module("libraryApp",[]);
module.constant("url","http://localhost:2403/authors/");
module.controller('libraryCtrl', function ($scope, $http, url) {
    $scope.currentView = 'table';
    //refresh
    $scope.refresh = function () {
        $http.get(url).success(function (data) {
            $scope.authors = data;
        });
    };
    // edit or create items -> edit
    $scope.editOrCreate = function (item) {
        $scope.currentItem = item ? angular.copy(item) : {};
        $scope.currentView = "edit";
    };
    // save items
    $scope.save = function (item) {
        if (angular.isDefined(item.id)) {
            $scope.update(item);
        } else {
            $scope.create(item);
        }
    };
    //update items
    $scope.update = function (item) {
        $http({
            url: url + item.id,
            method: "PUT",
            data: item
        }).success(function (modifiedItem) {
            for (var i = 0; i < $scope.authors.length; i++) {
                if ($scope.authors[i].id == modifiedItem.id) {
                    $scope.authors[i] = modifiedItem;
                    break;
                }
            }
            $scope.currentView = "table";
        });
    }
    // create items
    $scope.create = function (item) {
        $http.post(url, item).success(function (item) {
            $scope.authors.push(item);
            $scope.currentView = "table";
        });
    };

    //cancel
    $scope.cancel = function () {
        $scope.currentItem = {};
        $scope.currentView = "table";
    }

    //delete
    $scope.delete = function (item) {
        $http({
            method: "DELETE",
            url: url + item.id
        }).success(function () {
            $scope.authors.splice($scope.authors.indexOf(item), 1);
        });
    }
    //all books
    $scope.allBooks = function (item) {
        $scope.currentAuthor = item;
        console.log($scope.currentAuthor);
        $scope.currentView = "books";
    }
    $scope.refresh();
})