// get elements
const fileInput = document.querySelector('.file-input');
const chooseImage = document.querySelector('.choose-img');
const previewImage = document.querySelector('.preview-img img');
const filterOption = document.querySelectorAll('.filter button');
const filterName = document.querySelector('.filter-info .name');
const filterSlider = document.querySelector('.filter .slider input');
const filterValue = document.querySelector('.filter-info .value');

console.log(filterValue);

const loadImage = () => {
    let file = fileInput.files[0]; // get user selected file
    if(!file) return; // return if user hasn't seleceted file

    previewImage.src =  URL.createObjectURL(file); // passing file url as preview ing src
    previewImage.addEventListener('load', () => {
        document.querySelector('.container').classList.remove('disable');
    })
}

fileInput.addEventListener('change', loadImage);

// if Clicking on chooseImage will click on fileInput
chooseImage.onclick = () => {
    fileInput.click();
}

// adding click event listener to all filter button
filterOption.forEach(item => {
    item.addEventListener('click', () => { 
        document.querySelector('.filter .active').classList.remove('active');
        item.classList.add('active');
        // change the name value when select filter
        filterName.innerText = item.innerText;
    })
});


// // change the number value when slide range bar
filterSlider.oninput = () => {
    filterValue.innerText = `${filterSlider.value}%`
}