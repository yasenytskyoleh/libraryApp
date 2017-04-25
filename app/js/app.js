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
    //limit
    $scope.limitValue = 2;
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

    //init view
    $scope.currentView = 'table';
    //refresh
    $scope.refresh = function () {
        $http.get(url).success(function (data) {
            $scope.authors = data;
            $scope.countPages($scope.authors.length)
            $scope.countBook = 0;
            for(var i = 0; i <$scope.authors.length; i++){
                console.log($scope.authors[i].books);
                if($scope.authors[i].books != undefined){
                    for(var j =0; j < $scope.authors[i].books.length; j++){
                        $scope.countBook ++;
                    }
                }
            }
            $(window).on("scroll load resize", function(){

                var w_top = $(window).scrollTop();        // Количество пикселей на которое была прокручена страница
                var e_top = $('.b-counts').offset().top;     // Расстояние от блока со счетчиками до верха всего документа

                var w_height = $(window).height();        // Высота окна браузера
                var d_height = $(document).height();      // Высота всего документа

                var e_height = $('.b-counts').outerHeight();

                if(w_top + 50 >= e_top || w_height + w_top == d_height || e_height + e_top < w_height){
                    counterNumber($scope.authors.length, $('.startNum:eq(0)'));
                    counterNumber($scope.countBook, $('.startNum:eq(1)'));

                }
            });
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
    $scope.search = function(string){
        var reg = string.toLowerCase(),
            str = "",
            res,
            obj;
        $scope.string ="";
        $scope.findBooks = [];
        for(var i = 0; i < $scope.authors.length; i++){
            if($scope.authors[i].books != undefined){
                loop:
                    for(var j = 0; j < $scope.authors[i].books.length;  j++){
                        str = $scope.authors[i].books[j].name.toLowerCase();
                        res = str.indexOf(reg, 0);
                        if(res == -1 ){
                            continue loop;
                        }
                        else{
                              obj = new searchItem($scope.authors[i].id, $scope.authors[i].surname, $scope.authors[i].name, $scope.authors[i].patronymic, $scope.authors[i].birthdate, $scope.authors[i].books[j].name, $scope.authors[i].books[j].genre, $scope.authors[i].books[j].numberPages);
                              $scope.findBooks.push(obj);
                        }
                    }
            }
        }

        $scope.currentView = "search";

    }
    // function constructor findBook
    function searchItem(id, surname, name, patronymic, birthdate, bookName, genre, numberPages) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.birthdate = birthdate;
        this.bookName = bookName;
        this.genre =  genre;
        this.numberPages = numberPages;
    }
    //choosen authors
    $scope.chooseAuthor = function(id){
        for(var i = 0; i < $scope.authors.length; i++){
            if($scope.authors[i].id == id){
                $scope.currentAuthor = $scope.authors[i];
                $scope.currentView = "books";
            }
        }

    }
    //countPages
    $scope.countPages = function (x) {
        $scope.pages = [];
        var step = 1;
        for (var i = 0; i < x; i+=$scope.limitValue){
            $scope.pages.push(step);
            step++;
        }
    };
    //current page
    $scope.currentPage = function (x) {
        $scope.count = (x-1)*$scope.limitValue;
        console.log($scope.count);
        $scope.refresh();
    }

    $scope.refresh();
})
//filter for pages
module.filter('startNumber', function () {
    return function (value, count) {
        count = parseInt(count);
        if (angular.isArray(value) && angular.isNumber(count)) {
            if (count > value.length || count < 1) {
                return value;
            } else {
                return value.slice(count);
            }
        } else {
            return value;
        }
    }

});
