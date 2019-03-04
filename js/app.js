//get elements
const itemList = document.querySelector(".items");
const httpForm = document.getElementById("httpForm");
const itemInput = document.getElementById("itemInput");
const imageInput = document.getElementById("imageInput");
const feedback = document.querySelector(".feedback");
const items = document.querySelector(".items");
const submtiBtn = document.getElementById("submitBtn");
let editedItemID = 0;


httpForm.addEventListener('submit', submitItem);
// Submit items
function submitItem(event){
    event.preventDefault();
    const itemValue = itemInput.value;
    const imgValue=imageInput.value;

    if(itemValue.length===0||imgValue.length===0){
        showFeedback('please enter valid values');
    }else{
        postItemAPI(imgValue, itemValue);
        itemInput.value='';
        imageInput.value='';
    }
}

//load items
document.addEventListener('DOMContentLoaded', function(){
    getItemsAPI(showItems);
});

//show feedback function
function showFeedback(text){
    feedback.classList.add('showItem');
    feedback.innerHTML=`
        <p>${text}</p>
    `;
    setTimeout(function(){
        feedback.classList.remove('showItem');
    },3000);
}

//get items
function getItemsAPI(cb){
    const url='https://5c601428d363eb0014e00e56.mockapi.io/items';
    const ajax = new XMLHttpRequest();
    ajax.open('GET', url, true);
    ajax.onload=function(){
        if(this.status===200){
            cb(this.responseText);
        }else{
            console.log('Something went wrong');
        }
    };
    ajax.onerror=function(){
        console.log('there is an error');
    };
    ajax.send();
}

//show items
function showItems(data){
    const items = JSON.parse(data);
    //console.log(items);
    let info = '';
    items.forEach(item => {
        info+=`
            <li class="list-group-item d-flex align-items-center justify-content-between flex-wrap item my-2">
                <img src="${item.avatar}" id='itemImage' class='itemImage img-thumbnail' alt="">
                <h6 id="itemName" class="text-capitalize itemName">${item.name}</h6>
                <div class="icons">
        
                    <a href='#' class="itemIcon mx-2 edit-icon" data-id='${item.id}'>
                    <i class="fas fa-edit"></i>
                    </a>
                    <a href='#' class="itemIcon mx-2 delete-icon" data-id='${item.id}'>
                    <i class="fas fa-trash"></i>
                    </a>
                </div>
            </li>  
        `
    });

    itemList.innerHTML=info;
    //get icons
    getIcons();

}

//POST Items API

function postItemAPI(img, itemName){
    const avatar=`img/${img}.jpeg`;
    const name=itemName;
    const url='https://5c601428d363eb0014e00e56.mockapi.io/items';

    const ajax = new XMLHttpRequest();
    ajax.open('POST', url, true);
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajax.onload=function(){
        //console.log(this.responseText);
        getItemsAPI(showItems);
        
    };
    ajax.onerror=function(){
        console.log('there is an error');
    };
    ajax.send(`avatar=${avatar}&name=${name}`);


}

//getIcons function

function getIcons(){
    const editIcon = document.querySelectorAll('.edit-icon');
    const deleteIcon = document.querySelectorAll('.delete-icon');
    //console.log(deleteIcon);

    deleteIcon.forEach(icon=>{
        const itemID = icon.dataset.id;
        icon.addEventListener('click', function(event){
            event.preventDefault();
            //console.log(itemID);
            deleteItemAPI(itemID);
            
        })
    })

    editIcon.forEach(icon=>{
        const itemID=icon.dataset.id;
        icon.addEventListener('click', function(event){
            event.preventDefault();
            const parent = event.target.parentElement.parentElement.parentElement;
            const img=parent.querySelector('.itemImage').src;
            const name=parent.querySelector('.itemName').textContent;
            //console.log(img, name);
            editItemUI(parent, img, name, itemID);
        })
    })
}

//delete item API

function deleteItemAPI(id){
    const url=`https://5c601428d363eb0014e00e56.mockapi.io/items/${id}`;
    const ajax = new XMLHttpRequest();
    ajax.open('DELETE', url, true);
    ajax.onload=function(){
        if(this.status===200){
            console.log(this.responseText);
            getItemsAPI(showItems);
            
        }else{
            console.log('Something went wrong');
        }
    };
    ajax.onerror=function(){
        console.log('there is an error');
    };
    ajax.send();
}

///edit item UI function
function editItemUI(parent, itemImg, name, itemID ){
    event.preventDefault();
    itemList.removeChild(parent);

    const imgIndex = itemImg.indexOf('img/');  //imgIndex+4
    const jpegIndex = itemImg.indexOf('.jpeg');
    //console.log(imgIndex, jpegIndex);

    const img = itemImg.slice(imgIndex+4, jpegIndex);
    //console.log(img);

    itemInput.value = name.trim();
    imageInput.value=img;  

    editedItemID=itemID;
    submtiBtn.innerHTML='Edit Item';
    httpForm.removeEventListener('submit', submitItem);
    httpForm.addEventListener('submit', editItemAPI);

}

//EditItemAPI function  

function editItemAPI(){
    event.preventDefault();
    const id = editedItemID;

    const itemValue = itemInput.value;
    const imgValue=imageInput.value;

    if(itemValue.length===0||imgValue.length===0){
        showFeedback('please enter valid values');
    }else{
        const img = `img/${imgValue}.jpeg`;
        const name = itemValue;

        const url=`https://5c601428d363eb0014e00e56.mockapi.io/items/${id}`;

        const ajax = new XMLHttpRequest();
        ajax.open('PUT', url, true);
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.onload=function(){
            //console.log(this.responseText);
            //getItemsAPI(showItems);
            reverseForm();
            
        };
        ajax.onerror=function(){
            console.log('there is an error');
        };
        ajax.send(`avatar=${img}&name=${name}`);

    }
}

function reverseForm(){
    itemInput.value='';
    imageInput.value='';
    submtiBtn.innerHTML='Add Item';
    httpForm.removeEventListener('submit', editItemAPI);
    httpForm.addEventListener('submit', submitItem);
    getItemsAPI(showItems);   
}