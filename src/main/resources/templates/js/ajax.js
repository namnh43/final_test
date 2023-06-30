let allCategories = {};
let currentPage = 0;
let maxPage = 0;
let currentCityId = -1;
function getAllCategories() {
    $.ajax({
        type: "GET",
        url:`http://localhost:8080/api/categories`,
        success: function (data) {
            let content = '';
            allCategories = {};
            for (let i = 0; i < data.length; i++) {
                content += `<input type="checkbox" name="category" value= ${data[i].id}>` +
                    `<label for="checkbox-1">${data[i].name}</label> <br>`;
                    allCategories[data[i].id] =  data[i].name;
            }
            $("#category-checkbox").append(content);
        },
        error: function () {
            alert("error occur")
        }
    })
    event.preventDefault();
}

function getAllCities() {
    $.ajax({
        type: "GET",
        url:`http://localhost:8080/api/cities`,
        success: function (data) {
            let content = '';
            for (let i = 0; i < data.length; i++) {
                let element = data[i];
                content +=`<tr>
                                <td>${element.id}</td>
                                <td><a onclick="select_city(${element.id})">${element.name}</a></td>
                                <td onclick="hide_city()">${element.country.name}</td>
                                <td>
                                    <a href="#">Chỉnh sửa</a> | <a href="#">Xóa</a>
                                </td>
                            </tr>
                            `
            }
            $("#table_body").html(content);
        },
        error: function () {
            alert("error occur")
        }
    })
    event.preventDefault();
}
function getDetailCityById(id) {
    $.ajax({
        type: "GET",
        url:`http://localhost:8080/api/cities/${id}`,
        success: function (data) {
            console.log(data)
            // populate_city_detail(data)
        },
        error: function () {
            console.log(id)
            alert("error occur")
        }
    })
    event.preventDefault();
}
function populate_city_detail(element) {
    $("#detail_name").val(element.name);
    $("#detail_country").val(element.country.name);
    $("#detail_area").val(element.area);
    $("#detail_people").val(element.peoples);
    $("#detail_gdp").val(element.area);
    $("#detail_description").val(element.description);
}
function getAllPictures() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/pictures?page=${currentPage}`,
        success: function (data) {
            currentPage = data.number;
            maxPage = data.totalPages;

            let content = `<table border="1" id="pic-tbl">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                 </tr>`;
            for (let i = 0; i < data.content.length; i++) {
                content += `<tr>
                                <td>${data.content[i].id}</td>
                                <td>${data.content[i].name}</td>
                                <td>${data.content[i].price}</td>
                                <td><span style="text-decoration: underline; color: blue; cursor: pointer" onclick="editPicture(${data.content[i].id})">Edit</span> </td>
                                <td><span style="text-decoration: underline; color: blue; cursor: pointer">Delete</span> </td>
                             </tr>`
            }
            content += '</table>';
            content += `<span id="prev-button" onclick="changepage(-1)" style="text-decoration: underline; color: blue; cursor: pointer">Previous</span> ` +
                `<span >${data.number + 1}/${data.totalPages}</span>` +
                `<span id="next-button" onclick="changepage(+1)" style="text-decoration: underline; color: blue; cursor: pointer">Next</span>`

            // console.log(content)
            $("#display-content").html(content);
        }
    })
}
function changepage(number) {
    if (number == -1) {
        if (currentPage > 0) {
            currentPage --;
            // $("#prev-button").attr("href","/pictures.html");
            getAllPictures();
        }
    } else if (number == 1) {
        if (currentPage < maxPage-1) {
            currentPage ++;
            // $("#next-button").attr("href","/pictures.html");
            getAllPictures();
        }
    }
}

function hide_city() {
    $("#table_detail_city").addClass("d-none");
}
function select_city(id) {
    console.log(id);
    currentCityId = id;
    $.ajax({
        type: "GET",
        url:`http://localhost:8080/api/cities/${currentCityId}`,
        success: function (data) {
            console.log(data)
            populate_city_detail(data)
            $("#table_detail_city").removeClass("d-none");
        },
        error: function () {
            console.log(id)
            alert("error occur")
        }
    })
    event.preventDefault();
    // getDetailCityById(id);
}
function create_new_city(data) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        type: "POST",
        data: JSON.stringify(data),
        url: "http://localhost:8080/api/cities",
        success:function (data) {
            location.href = "listCities.html";
        }
    })
}
function createNewPicture() {
    let pic_id = $("#id").val();
    let pic_name = $("#name").val();
    let pic_width = $("#width").val();
    let pic_height = $("#height").val();
    let pic_material = $("#material").val();
    let pic_desc = $("#description").val();
    let pic_price = $("#prices").val();
    let category_set = [];
    $('input[name="category"]:checked').each(function() {
        category_set.push({id: this.value,name:allCategories[this.value]})

    });
    let newPicture = {
        id: pic_id,
        name: pic_name,
        width: pic_width,
        height: pic_height,
        material: pic_material,
        description: pic_desc,
        price: pic_price,
        categorySet: category_set
    }
    console.log(newPicture)
    console.log(JSON.stringify(newPicture));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        type: "POST",
        data: JSON.stringify(newPicture),
        url: "http://localhost:8080/api/pictures",
        success:function (data) {
            console.log(data)
            $("#id").val(data.id);
        }
    })
}

function editPicture(id) {
    window.location.href='./onePicture.html';
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/pictures/"+id,
        success: function (data) {
            $("#id").val(data.id);
            $("#name").val(data.name);
            $("#width").val(data.width);
            $("#height").val(data.height);
            $("#material").val(data.material);
            $("#description").val(data.description);
            $("#prices").val(data.price);
        }
    })
    console.log(data)
}