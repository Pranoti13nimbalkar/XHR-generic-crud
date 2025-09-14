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
POST_URL=`${BASE_URL}/posts.json`;

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
                        <h3 class="m-0">${blog.userName}</h3>
                        <h4 class="m-0">${blog.userId} </h4>
                    </div>
                    <div class="card-body">
                         <h5 class="m-0">${blog.title}</h5>
                         <p class="m-0">${blog.blogDesc}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                           <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-success" role="button"></i>
                           <i onclick="onRemove(this)" class="fa-solid fa-trash fa-2x text-danger" role="button"></i>
                           <i class="fa-solid fa-thumbs-up fa-2x text-primary"></i>
                    </div>
                </div>
            </div>
        `
    });
    blogContainer.innerHTML =result;
}

const onEdit=(ele)=>{
let EDIT_ID = ele.closest('.card').id;
cl(EDIT_ID)
localStorage.setItem('EDIT_ID',EDIT_ID);
let EDIT_URL=`${BASE_URL}/posts/${EDIT_ID}.json`;
makeApiCall('GET', EDIT_URL);
}


const patchData= (res)=>{
    userNameControl.value= res.userName,
    userIdControl.value = res.userId,
    titleControl.value=res.title,
    blogDescControl.value= res.title,
    blogSubmitBtn.classList.add('d-none');
    blogUpdateBtn.classList.remove('d-none')

    window.scrollTo({top:0, behavior:'smooth'});
}


const onUpdateBLog=()=>{
    let UPDATED_ID= localStorage.getItem('EDIT_ID');
    let UPDATED_URL= `${BASE_URL}/posts/${UPDATED_ID}.json`;
    let UPDATED_OBJ={
       userName:userNameControl.value,
        userId: userIdControl.value,
        title:titleControl.value,
        blogDesc:blogDescControl.value,
        id:UPDATED_ID
    }
    cl(UPDATED_OBJ);
    blogForm.reset();
    makeApiCall('PATCH', UPDATED_URL, UPDATED_OBJ)
}

const updateOnUI=(msgBody)=>{
    let card= document.getElementById(msgBody.id);
    let h3 =card.querySelector('h3').innerHTML=msgBody.userName;
    let h4= card.querySelector('h4').innerHTML=msgBody.userId;
    let h5= card.querySelector('h5').innerHTML=msgBody.title;
    let p= card.querySelector('p').innerHTML= msgBody.blogDesc;
     blogSubmitBtn.classList.remove('d-none');
    blogUpdateBtn.classList.add('d-none')

}

const onRemove = (ele)=>{
    Swal.fire({
  title: "Do you want to delete blog?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Remove"
}).then((result) => {
  if (result.isConfirmed) {
   let REMOVE_ID = ele.closest('.card').id;
   let REMOVE_URL=`${BASE_URL}/posts/${REMOVE_ID}.json`;
   localStorage.setItem('REMOVE_ID' ,REMOVE_ID);
   makeApiCall('DELETE', REMOVE_URL);
  }
});
}

const removePost=(res)=>{
    let REMOVE_ID = localStorage.getItem('REMOVE_ID');
    let card = document.getElementById(REMOVE_ID).parentElement;
    card.remove();
}


const makeApiCall = (methodeName, api_url, msgBody=null)=>{
    spinner.classList.remove('d-none')
    const xhr = new XMLHttpRequest();
    xhr.open(methodeName, api_url);
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status < 300){
            let res = JSON.parse(xhr.response)
            if(methodeName === 'GET'){
                if(res && typeof res === 'object' && !res.title){
                    let BlogArr = [];
                    for(const key in res) {
                       BlogArr.unshift({...res[key], id:key});
                    }
                    templating(BlogArr)
         snackbar('Blog fetched successfully!!', 'success');

                }else{
                patchData(res)
             snackbar('Blog patched on form successfully!!', 'success');

            }
        }else if(methodeName === 'POST'){
            const id = res.name;
            createBlog({...msgBody, id})
     snackbar('New blog created  on UI successfully!!', 'success');

        }else if(methodeName === 'PATCH'){
            updateOnUI(msgBody)
        snackbar('Update blog  on UI successfully!!', 'success');

        }else if(methodeName === 'DELETE'){
              removePost(res);
              snackbar('Remove blog successfully!!', 'success');
        }
        else{
            snackbar('error', 'error')
        }
            spinner.classList.add('d-none')

    }
}
    let msg = msgBody?JSON.stringify(msgBody):null;
    xhr.send(msg)
}

makeApiCall('GET', POST_URL, null)

const onSubmitBlog=(eve)=>{
    eve.preventDefault();

    let blogPostObj={
        userName:userNameControl.value,
        userId: userIdControl.value,
        title:titleControl.value,
        blogDesc:blogDescControl.value
    }
    cl(blogPostObj);
    blogForm.reset();
    makeApiCall('POST', POST_URL, blogPostObj)
}

const createBlog =(blogPostObj)=>{
  let col = document.createElement('div');
  col.classList = 'col-md-4 mb-4';
  col.innerHTML= `
                  <div class="card h-100" id= '${blogPostObj.id}'>
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h3 class="m-0">${blogPostObj.userName}</h3>
                        <h4 class="m-0">${blogPostObj.userId} </h4>
                    </div>
                    <div class="card-body">
                         <h5 class="m-0">${blogPostObj.title}</h5>
                         <p class="m-0">${blogPostObj.blogDesc}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                           <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-success" role="button"></i>
                           <i onclick="onRemove(this)" class="fa-solid fa-trash fa-2x text-danger" role="button"></i>
                           <i class="fa-solid fa-thumbs-up fa-2x text-primary"></i>
                    </div>
                </div>
                  
  `
  blogContainer.prepend(col);
}

blogForm.addEventListener('submit', onSubmitBlog);
blogUpdateBtn.addEventListener('click', onUpdateBLog)