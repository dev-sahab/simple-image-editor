// get elements
const fileInput = document.querySelector('.file-input');
const chooseImage = document.querySelector('.choose-img');
const previewImage = document.querySelector('.preview-img img');
const filterName = document.querySelector('.filter-info .name');
const filterSlider = document.querySelector('.filter .slider input');
const filterValue = document.querySelector('.filter-info .value');
const filterOption = document.querySelectorAll('.filter button');
const rotateOption = document.querySelectorAll('.rotate button');
const resetBtn = document.querySelector('.reset-filter');
const saveImg = document.querySelector('.save-img');

// set default value for filter
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

let imageName, disableEditor = true;

// function for apply filter
const applyFilter = () => {
    if(disableEditor) return;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
}

// file load and preview function
const loadImage = () => {
    let file = fileInput.files[0]; // get user selected file
    if(!file) return; // return if user hasn't seleceted file

    previewImage.src =  URL.createObjectURL(file); // passing file url as preview ing src
    previewImage.addEventListener('load', () => {
        disableEditor = false;
        resetBtn.click(); //clicking reset btn, so the filter value reset if the user select new img
        imageName = file.name.replace(/^.*[|||/]/, "");
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
        if(disableEditor) return;
        document.querySelector('.filter .active').classList.remove('active');
        item.classList.add('active');
        // change the name value when select filter
        filterName.innerText = item.innerText;

        if(item.id == 'brightness'){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }
        else if(item.id == 'saturation'){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }
        else if(item.id == 'inversion'){
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }
        else{
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    })
});


// change the number value when slide range bar
filterSlider.oninput = () => {

    if(disableEditor) return;

    filterValue.innerText = `${filterSlider.value}%`;

    // getting selected filter btn
    const selectedFilter = document.querySelector('.filter .active');

    // passing value from range bar
    if(selectedFilter.id == "brightness" ) {
        brightness = filterSlider.value;
    }else if (selectedFilter.id == "saturation" ) {
        saturation = filterSlider.value;
    }else if (selectedFilter.id == "inversion" ) {
        inversion = filterSlider.value;
    }else{
        grayscale = filterSlider.value;
    }

    //call apply filter css function
    applyFilter()
}

rotateOption.forEach(item => {
    // adding click event listener to all rotate/flip filter buttons
    item.onclick = () => {
        if(disableEditor) return;
        if(item.id == 'left'){
            rotate -= 90;  // if clicked btn is left rotate, decrement rotate value by -90
            rotate == -360 ? rotate = 0 : rotate;
            
        }
        else if(item.id == 'right'){
            rotate += 90; // if clicked btn is left rotate, increment rotate value by -90

            rotate == 360 ? rotate = 0 : rotate;
        }
        else if(item.id == 'horizontal'){
            //if flipHorizontal value is 1, set value to -1 else set 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            //if flipVertical value is 1, set value to -1 else set 1
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter()
    }
});

resetBtn.onclick = () => {
    if(disableEditor) return;
    // reseting all variable value into default value
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
    rotate = 0, flipHorizontal = 1, flipVertical = 1;

    filterOption[0].click(); // clicking brightness btn, so the brightness selected by default

    applyFilter()
}

saveImg.onclick = () => {

    if(disableEditor) return;
    // disable click event, text change when click save btn
    saveImg.innerText = 'Saving Image...';
    saveImg.classList.add('disable');

    setTimeout(() => {
        const canvas = document.createElement('canvas'); // creating canvas element
        const ctx = canvas.getContext('2d'); // canvas.getContext return a drawing context on the canvas
        canvas.width = previewImage.naturalWidth;
        canvas.height = previewImage.naturalHeight;
    
        // apply user selected filter to canvas filter
        ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
        ctx.translate(canvas.width / 2, canvas.height / 2); // translating canvas from center
        if(rotate !== 0){ // if rotate value isn't 0, rotate the canvas
            ctx.rotate(rotate * Math.PI / 180);
        }
        ctx.scale(flipHorizontal, flipVertical); // flip canvas, horizontally / vertically
        ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        
        
        const link = document.createElement('a'); // create <a> element
        link.download = 'image.jpg'; // passing <a> tag download value to 'image.jpg'
        link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url
        link.click();  // clicking <a> tag for the image download

        // reset defualt when image is ready to save
        saveImg.innerText = 'Save Image';
        saveImg.classList.remove('disable');
    })
}