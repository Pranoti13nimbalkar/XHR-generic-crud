const cl=console.log;
const spinner = document.getElementById('spinner');
const blogForm = document.getElementById('blogForm');
const userNameControl = document.getElementById('userName');
const userIdControl = document.getElementById('userId');
const titleControl = document.getElementById('title');
const blogDescControl = document.getElementById('blogDesc');
const blogSubmitBtn = document.getElementById('blogSubmitBtn');
const blogUpdateBtn = document.getElementById('blogUpdateBtn');
const blogContainer = document.getElementById('blogContainer');

BASE_URL = 'https://xhr-crud-machinetest-default-rtdb.firebaseio.com';
POST_URL=`${BASE_URL}/blogs.json`;

const snackbar = (masg, icon)=>{
    swal.fire(
        {
        title:masg,
        icon:icon,
        timer:3000
    })
}

const templating=(arr)=>{
    let result= ``;
    arr.forEach(blog => {
        result +=`
                 <div class="col-md-4 mb-4">
                <div class="card h-100" id= '${blog.id}'>
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h3 class="m-0">'${blog.userName}'</h3>
                        <h4 class="m-0">'${blog.userId}' </h4>
                    </div>
                    <div class="card-body">
                         <h4 class="m-0">'${blog.title}'</h4>
                         <p class="m-0">'${blog.blogDesc}'</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                           <i class="fa-solid fa-pen-to-square fa-2x text-success"></i>
                           <i class="fa-solid fa-trash fa-2x text-danger"></i>
                           <i class="fa-solid fa-thumbs-up fa-2x text-primary"></i>
                    </div>
                </div>
            </div>
        `
    });
    blogContainer.innerHTML =result;
}

const makeApiCall = (methodeName, api_url, msgBody=null)=>{
    const xhr = new XMLHttpRequest();
    xhr.open(methodeName, api_url);
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status < 300){
            let res = JSON.parse(xhr.response)
            if(methodeName === 'GET'){
                if(res && typeof res === 'object' && !res.title){
                    let BlogArr = [];
                    for(const key in res) {
                       BlogArr.unshift({...res[key], id:key})
                    }
                    templating(BlogArr)
                }
            }
        }else{
            snackbar('error', 'error')
        }
    }
    let msg = msgBody?JSON.stringify(msgBody):null;
    xhr.send(msg)
}

makeApiCall('GET', POST_URL, null)