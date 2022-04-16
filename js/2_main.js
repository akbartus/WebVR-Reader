function showB(){
    document.getElementsByClassName("hidden")[0].setAttribute("style", "display:block;")
}
function hideWindow1(){
    document.getElementsByClassName("hidden")[0].setAttribute("style", "display:none;")
}

/********************************** */
/* Overlay with options             */
/********************************** */
// 1
// Load photo locally
function loadPhotoLocally(input) {
    let file = input.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
        document.getElementById('imagePreview').setAttribute('src', fileReader.result);
        document.getElementById('photoBackground').setAttribute('src', fileReader.result);
        document.getElementById("intro").style.display = "none";
        // Initialize and do prediction
        init().then(() => {
            predict();
        });
    };
}

// Do Prediction
const URL = 'model/';
let model, labelContainer, maxPredictions;
// Load the image model 
async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement('div'));
    }
}
async function predict() {
    // predict can take in an image, video or canvas html element
    var image = document.getElementById('imagePreview');
    const prediction = await model.predict(image, false);
    for (let i = 0; i < 5; i++) {
        const classPrediction = prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        console.log(classPrediction);
    }
    if (prediction[0].probability.toFixed(2) >= "0.95") {
        console.log("It is a city");
        document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/city.mp3); loop: true; positional: false');
    } else if (prediction[1].probability.toFixed(2) >= "0.95") {
        console.log("It is a desert");
        document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/desert.mp3); loop: true; positional: false');
    } else if (prediction[2].probability.toFixed(2) >= "0.95") {
        console.log("It is a forest");
        document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/forest.mp3); loop: true; positional: false');
    } else if (prediction[3].probability.toFixed(2) >= "0.95") {
        console.log("It is a montain");
        document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/mountain.mp3); loop: true; positional: false');
    } else if (prediction[4].probability.toFixed(2) >= "0.95") {
        console.log("It is a room");
        document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/room.mp3); loop: true; positional: false');
    };

}


// Check if AI loads the environment
var aiLoadsEnvironment = false;
// If yes, set to yes
function loadEnvironment() {
    aiLoadsEnvironment = true;
    document.getElementById("intro").style.display = "none";
}







var myCamera = document.getElementById("myCamera");
var openClose = document.getElementById("openClose");
var mainWindow = document.getElementById("mainWindow");
var allButtons = document.getElementById("allButtons");
var soundOnOff = document.getElementById("soundOnOff");


/********************************** */
/* Movable Nav Menu                 */
/********************************** */
// Open close
openClose.addEventListener("click", function () {

    if (openClose.getAttribute("material").src.id == "interfaceOn") {
        openClose.setAttribute("material", "src: #interfaceOff");
        allButtons.setAttribute("scale", "0 0 0");
        mainWindow.setAttribute("material", "transparent: false; opacity: 0.001");
        console.log("success");
       //  document.querySelector("a-sphere").setAttribute("class", "none");
    } else {
        openClose.setAttribute("material", "src: #interfaceOn");
       // document.querySelector("a-sphere").setAttribute("class", "navButton");
        allButtons.setAttribute("scale", "1 1 1");
        mainWindow.setAttribute("material", "color: #5475d4; transparent: true; opacity: 0.5; side:double");
        
    }
})


//Wait for scene to load
// document.addEventListener('DOMContentLoaded', function () {
//     var scene = document.querySelector('a-scene');
//     scene.addEventListener('loaded', function (e) {
//         document.getElementById("overlay").style.display = "none";
//     });
// });

// Wait for model to load
// document.querySelector('#myEnvironment').addEventListener('model-loaded', function () {
//     document.getElementById("overlay").style.display = "none";
// });









/********************************** */
/* Main PDF Loader with PDF.js      */
/********************************** */
document.querySelector("#pdf-upload").addEventListener("change", function (e) {
    var canvasElement = document.querySelector("#pdf_renderer")
    var file = e.target.files[0]
    // If wrong file extension
    if (file.type != "application/pdf") {
        console.error(file.name, "is not a pdf file.")
        return
    }
    // Scale of pdf
    var scale = 2;

    var fileReader = new FileReader();
    fileReader.onload = function () {
        var loadedFile = new Uint8Array(this.result);

        PDFJS.disableWorker = true; // due to CORS
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            pages = [],
            currentPage = 1,
            url = loadedFile;
        var pageLength;
        PDFJS.getDocument(url).then(function (pdf) {
            if (currentPage <= pdf.numPages) {
                getPage();
            }

            // main entry point/function for loop
            function getPage() {
                // when promise is returned do as usual
                pdf.getPage(currentPage).then(function (page) {

                    var viewport = page.getViewport(scale);
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    var renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    };

                    // now, tap into the returned promise from render:
                    page.render(renderContext).then(function () {
                        // store compressed image data in array
                        pages.push(canvas.toDataURL());

                        if (currentPage < pdf.numPages) {
                            // Check if it is the first page, then show its content. Done once
                            if (currentPage == 1) {
                                var textContent = page.getTextContent();
                                textContent.then(function (text) {
                                    // all contents of current page
                                    var pageText = text.items.map(
                                        function (s) {
                                            return s.str;
                                        }).join('');

                                    if (aiLoadsEnvironment == true) {
                                        classifyText(pageText);
                                    }


                                });
                            }

                            currentPage++;
                            getPage(); // get next page
                        } else {
                            // after all the pages are parsed
                            for (var i = 0; i < pages.length; i++) {
                                drawPage(i);
                            }
                            if(aiLoadsEnvironment == false){
                            // Remove last overlay 4 after loading file
                            document.getElementById("intro2").style.display = "none";
                            // Play sound
                            document.getElementById('soundlink').components.sound.playSound();
                            }
                            // Enter in VR mode automatically
                            // document.querySelector('a-scene').enterVR();

                        }
                    });
                })
            }

            // Zoom in
            document.getElementById('zoom_in').addEventListener('click', (e) => {
                var book = document.getElementById("book");
                book.object3D.scale.multiplyScalar(1.05);
            });
            // Zoom out
            document.getElementById('zoom_out').addEventListener('click', (e) => {
                var book = document.getElementById("book");
                book.object3D.scale.divideScalar(1.05);
            });

            pageLength = pdf.numPages;
        });



        // Button Next
        var current = 0;
        document.getElementById('go_next').addEventListener('click', (e) => {
            var myPage = document.querySelector("a-image");
            current += 1;
            if (current < pageLength) {
                myPage.setAttribute("src", "#img" + current);
            }
            if (current == pageLength - 1) {
                document.getElementById('go_next').setAttribute("scale", "0 0 0")
            }
            if (current != 0) {
                document.getElementById('go_previous').setAttribute("scale",
                    "0.08 0.08 0.08")
            }
            document.getElementById("current_page").setAttribute("text", "value: " + current + "; color: #000; align: center; width: 1; height: 0.5");
            console.log(current);
            getPageText(current + 1);

        });

        // Button previous
        document.getElementById('go_previous').addEventListener('click', (e) => {
            var myPage = document.querySelector("a-image");
            current -= 1
            if (current < pageLength) {
                myPage.setAttribute("src", "#img" + current);
            }
            if (current != pageLength - 1) {
                document.getElementById('go_next').setAttribute("scale", "0.08 0.08 0.08")
            }
            if (current == 0) {
                document.getElementById('go_previous').setAttribute("scale", "0 0 0")
            }
            document.getElementById("current_page").setAttribute("text", "value: " + current + "; color: #000; align: center; width: 1; height: 0.5");;
            console.log(current);
            getPageText(current + 1);
        });

        /* 
        Showing page content based on page number
        Necessary for
        */

        function getPageText(number) {
            PDFJS.getDocument(url).then(function (pdf) {
                pdf.getPage(number).then(function (page) {
                    page.getTextContent().then(function () {
                        var textContent = page.getTextContent();
                        textContent.then(function (text) {

                            var pageText = text.items.map(function (s) {
                                return s.str;
                            }).join('').replace(/- /g, "").replace(/’/g, "").replace(/“/g, "").replace(/”/g, "").replace(/'/g, "").replace(/\[[0-9]\]/g, "").replace(/[A-Z][.][A-Z][.][A-Z][.]/g, "");
                            console.log(pageText);
                        });
                    });
                })
            })
        }



        // Render img to canvas
        function drawPage(index, callback) {
            var img = new Image;
            img.onload = function () {
                ctx.drawImage(this, 0, 0, ctx.canvas.width, ctx.canvas.height);
                console.log(ctx.canvas.width);
                if (index > 0) img.style.display = 'inline-block';
                // set ids from 0
                img.setAttribute("id", "img" + index);
                document.getElementById("assets").appendChild(img);
                img.setAttribute("style", "display:none;");
                var myPage = document.querySelector("a-image");
                myPage.setAttribute("visible", "true");
                myPage.setAttribute("src", "#img0");
                myPage.setAttribute("width", ctx.canvas.width / 500)
                myPage.setAttribute("height", ctx.canvas.height / 500)
            }
            img.src = pages[index]; // start loading the data-uri as source
        }
    };
    fileReader.readAsArrayBuffer(file);
})


// Sound On/Off
soundOnOff.addEventListener("click", function(){
    console.log(soundOnOff.getAttribute("material").src.id);
    if (soundOnOff.getAttribute("material").src.id == "soundOn") {
        soundOnOff.setAttribute("material", "src: #soundOff");
        document.getElementById('soundlink').components.sound.pauseSound();
    } else {
        soundOnOff.setAttribute("material", "src: #soundOn");
        document.getElementById('soundlink').components.sound.playSound();
        
    }    
})

// 3. Weather Effects
function addRain() {
    document.getElementById("particle").setAttribute("particle-system", "preset: rain;");

}

function addSnow() {
    document.getElementById('particle').setAttribute("particle-system", "preset: snow;")
}

function addDust() {
    document.getElementById('particle').setAttribute("particle-system", "preset: dust;");

}

function effectOff() {
    document.getElementById('particle').setAttribute("particle-system", "preset: none;");
}

/********************************** */
/* ZeroShot Classification          */
/********************************** */
// Works best with simpler pdf materials
function classifyText(classifiedText) {
    var categories = "computer,sports,biology,fairytale,society,politics,ecology,culture,cuisine,fishing,medicine"
    fetch('https://hf.space/embed/Akbartus/Zero-shotClassificationEnRuUz/+/api/predict/', {
        method: "POST",
        body: JSON.stringify({
            "data": [classifiedText, categories]
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        return response.json();
    }).then(function (json_response) {
        console.log(json_response);
        if (json_response.data[0].confidences[0].label == 'computer') {
            document.getElementById('photoBackground').setAttribute('src', '360images/1_computer.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/1_computer_science.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'sports') {
            document.getElementById('photoBackground').setAttribute('src', '360images/2_sports.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/2_sports.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'biology') {
            document.getElementById('photoBackground').setAttribute('src', '360images/4_biology.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/1_computer_science.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'fairytale') {
            document.getElementById('photoBackground').setAttribute('src', '#vid');
            document.getElementById('vid').play();
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/5_tale.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'society') {
            document.getElementById('photoBackground').setAttribute('src', '360images/8_society.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/city.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'politics') {
            document.getElementById('photoBackground').setAttribute('src', '360images/9_politics.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/room.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'ecology') {
            document.getElementById('photoBackground').setAttribute('src', '360images/10_ecology.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/forest.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'culture') {
            document.getElementById('photoBackground').setAttribute('src', '#vid2');
            document.getElementById('vid2').play();
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/11_culture.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'cuisine') {
            document.getElementById('photoBackground').setAttribute('src', '360images/12_cuisine.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/room.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'fishing') {
            document.getElementById('photoBackground').setAttribute('src', '360images/14_fishing.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/sea.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        } else if (json_response.data[0].confidences[0].label == 'medicine') {
            document.getElementById('photoBackground').setAttribute('src', '360images/15_medicine.jpg');
            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/forest.mp3); loop: true; positional: false');
            document.getElementById('soundlink').components.sound.playSound();
        }
        // Remove last overlay
        document.getElementById("intro2").style.display = "none";
    })
}