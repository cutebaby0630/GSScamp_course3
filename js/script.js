
var bookDataFromLocalStorage = [];

$(function(){
    loadBookData();
    var data = [
        {text:"資料庫",value:"image/database.jpg"},
        {text:"網際網路",value:"image/internet.jpg"},
        {text:"應用系統整合",value:"image/system.jpg"},
        {text:"家庭保健",value:"image/home.jpg"},
        {text:"語言",value:"image/language.jpg"},
        {text:"行銷",value:"image/sale"},
        {text:"管理",value:"image/manage.jpg"}
    ]

    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });

    //  搜尋資料 

    $("#bought_datepicker").kendoDatePicker();
    
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookPublisher: {type: "string"},
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookPublisher", title: "出版公司", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]
        
        
    });
    $(".book-grid-search").on("input propertychange",function(){ 
        $("#book_grid").data("kendoGrid").dataSource.filter({
            // logic: 'or',
            filters: [
                {
                field: "BookName",
                operator: "contains",
                value:  $(".book-grid-search").val()
                 }]
        })
    }); 
})

function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    }
}
// 更換圖片
function onChange(){
    $(".book-image").attr("src", $("#book_category").data("kendoDropDownList").value())
}
  
// 刪除bookdata
function deleteBook(e){
// 在指定的event中取出需要的資料
    var delete_data = this.dataItem($(e.currentTarget).closest("tr"))

// 搜尋整個Bookdata，找出與指定的ID相同並刪除
    for(var i=0; i<bookDataFromLocalStorage.length; i++){
        if(bookDataFromLocalStorage[i].BookId == delete_data.BookId){
            bookDataFromLocalStorage.splice(i,1);
            break;
        }
    }
// 更新localStorage & kendoGrid
    localStorage["bookData"] = JSON.stringify(bookDataFromLocalStorage);
    $("#book_grid").data("kendoGrid").dataSource.data(bookDataFromLocalStorage)
    }

// 新增資料
$("#create_bt").click(function(e){
    const book = ({
        "BookId" :bookDataFromLocalStorage[bookDataFromLocalStorage.length-1].BookId+1,
        "BookName" : $("#book_name").val(),
        "BookCategory" : $("#book_category").data("kendoDropDownList").text(),
        "BookAuthor" : $("#book_author").val(),
        "BookBoughtDate" : kendo.toString($("#bought_datepicker").data("kendoDatePicker").value(),"yyyy-MM-dd"),
        "BookPublisher" : $("#book_publisher").val()
    })
    bookDataFromLocalStorage.push(book);
    
// 更新localStorage & kendoGrid
    localStorage["bookData"] = JSON.stringify(bookDataFromLocalStorage);
    $("#book_grid").data("kendoGrid").dataSource.data(bookDataFromLocalStorage);

    $("#input_window").data("kendoWindow").close();
// 新增過後讓欄位空白
    $("#book_name").val("");
    $("#book_author").val("");
    $("#book_publisher").val("");

}
);
// inputWindow
$("#input_bt").click(function(){
    $("#input_window").data("kendoWindow").center();
    $("#input_window").data("kendoWindow").open();
})
// 視窗的設定
$("#input_window").kendoWindow({
    title : "新增借閱",
    height:"550px",
    width:"450px"

})
