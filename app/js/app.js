/**
 * Created by Admin on 09.03.2017.
 */
var module = angular.module("libraryApp",[]);
module.constant("url","http://localhost:2403/authors/");
var min = 0,
    max = 9,
    n = 8;

generateId = function (min,n, max){
    var id = " ";
    for(var i=0; i< n; i++){
        id += generateNumber(min,max);
    }
    return id;
}
generateNumber = function(min, max){
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}
module.controller('libraryCtrl', function ($scope, $http, url) {
    //sort filter author
    $scope.sortValue = "surname";
    $scope.sort = function(val){
      if(val == "surname"){
          $scope.sortValue = "-surname";
          $scope.refresh();
      }
      else {
          $scope.sortValue = "surname";
          $scope.refresh();
      }
    };
    // sort filter book
    $scope.sortValeuBook = "book";
    //init view
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
    //-----------------------------------  BOOKS
    //all books
    $scope.allBooks = function (author) {
        $scope.currentAuthor = author;
        $scope.currentView = "books";
    }

    //back
    $scope.back =  function (){
        $scope.currentItem = {};
        $scope.currentAuthor = {};
        $scope.currentView = "table";
    }
    // create books
    $scope.createBook = function () {
        $scope.book = {};
        $scope.currentView = "editBook";
    };
    // save books
    $scope.saveBook = function (currentAuthor, book) {
        if (angular.isDefined(currentAuthor)) {
            if(currentAuthor.books != null){
                for(var i=0; i< currentAuthor.books.length; i++){
                    if(currentAuthor.books[i].id == book.id){
                        currentAuthor.books[i] = book;
                        $scope.updateBooks(currentAuthor);
                        break;
                    }
                    else if(book.id == undefined){
                        book.id = generateId(min,n, max);
                        currentAuthor.books[currentAuthor.books.length] = book;
                        $scope.updateBooks(currentAuthor);
                        break;
                    }
                }
            }
            else {
                currentAuthor.books = new Array();
                book.id = generateId(min,n, max);
                currentAuthor.books[0] = book;
                $scope.updateBooks(currentAuthor);
            }
        }
    };
    //update books
    $scope.updateBooks = function (item) {
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
            $scope.currentView = "books";
            $scope.refresh();
        });
    }
    //delete books
    $scope.delBook = function (currentAuthor,books){
        for (var i=0; i< currentAuthor.books.length; i++){
            if(currentAuthor.books[i].id == books.id){
                currentAuthor.books.splice(i,1);
                $scope.updateBooks(currentAuthor);
                break;
            }
        }

    }
    //edit books
    $scope.editBook = function (book){
        $scope.book = book;
        $scope.currentView = "editBook";
    }
    // cancel book
    $scope.cancelBook = function () {
        $scope.book = {};
        $scope.currentView = "books";
    }

    // search
    $scope.search = function(searchBook){
        var reg = searchBook.toLowerCase(),
            str = "",
            res;
        for(var i = 0; i < $scope.authors.length; i++){
            if($scope.authors[i].books != undefined){
                book:
                    for(var j = 0; j < $scope.authors[i].books.length;  j++){
                        str = $scope.authors[i].books[j].name.toLowerCase();
                        res = str.indexOf(reg, 0);
                        if(res == -1 ){
                            continue book;
                        }
                        else{
                            console.log($scope.authors[i].books[j]);
                        }
                    }
            }
        }
    }
    $scope.refresh();
})