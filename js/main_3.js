var x = document.getElementById("input");
var myCamera = document.getElementById("myCamera");
// var interPoint = document.querySelector("a-sphere");
var keyboard = document.querySelector('#keyboard');
var inputField = document.querySelector('#inputField');
var input = ''

var wikiWrapper = document.getElementById("wikiWrapper");
var informationCard = document.getElementById("informationCard")
var down = document.getElementById("scrollDown");
var up = document.getElementById("scrollUp");
var wikiWindow = document.getElementById("wikiWindow");
var wikiImage = document.getElementById("wikiImage");
var wikiText = document.getElementById("wikiText");
var qaWrapper = document.getElementById("qaWrapper");
var qQuestion = document.getElementById("qaQuestion");
var qAnswer = document.getElementById("qaAnswer");
var tsWrapper = document.getElementById("tsWrapper");
var tsSummary = document.getElementById("tsSummary");
var tabletVertical = document.getElementById("tabletVertical");
var openClose = document.getElementById("openClose");
var mainWindow = document.getElementById("mainWindow");
var web2vr;

/********************************** */
/* Movable Nav Menu                 */
/********************************** */

// Wait for scene to load
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



// Open close
openClose.addEventListener("click", function () {

    if (openClose.getAttribute("material").src.id == "interfaceOn") {
        openClose.setAttribute("material", "src: #interfaceOff");
        allButtons.setAttribute("scale", "0 0 0");
        mainWindow.setAttribute("material", "transparent: false; opacity: 0.001");
        console.log("success");
    } else {
        openClose.setAttribute("material", "src: #interfaceOn");
        allButtons.setAttribute("scale", "1 1 1");
        mainWindow.setAttribute("material", "color: #5475d4; transparent: true; opacity: 0.5; side:double");

    }
})




/********************************** */
/* VR Keyboard                      */
/********************************** */
function updateInput(e) {
    var code = parseInt(e.detail.code)
    console.log(code);
    switch (code) {
        case 8:
            input = input.slice(0, -1)
            break
        case 06:
            inputField.setAttribute("scale", "0 0 0");
            document.querySelector('#input').setAttribute('value', input);
            document.querySelector('#input').setAttribute('color', '#fff');
            keyboard.setAttribute("scale", "0 0 0");
            //check if the lenght of the input is less than 3 spaces
            if (x.components.text.attrValue.value.split(" ").length < 4) {
                wikiRefer();
            }
            myQuestion();
            return
        default:
            input = input + e.detail.value
            break
    }
    document.querySelector('#input').setAttribute('value', input)
}

function showHideKeyboard() {
    if (keyboard.getAttribute("scale") != "1 1 1") {
        console.log("success");
        // Show input field
        inputField.setAttribute("scale", "1 1 1");
        // Refresh input
        input = "";
        document.querySelector('#input').setAttribute('value', input)
        // make keyboard visible again        
        keyboard.setAttribute("scale", "1 1 1");
    } else {
        // Hide input field
        inputField.setAttribute("scale", "0 0 0");
        input = "";
        keyboard.setAttribute("scale", "0 0 0");
    }


}
document.addEventListener('a-keyboard-update', updateInput);





/********************************** */
/* Speech recognition               */
/********************************** */
document.getElementById('stt').addEventListener('click', function () {
    var speechSummaryText;
    //Speech Recognition
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.onspeechend = function () {
        recognition.stop();
    }
    recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        speechSummaryText = transcript;
        inputField.setAttribute("scale", "1 1 1");

        // Refresh input and show input field
        input = "";
        document.querySelector('#input').setAttribute('value', speechSummaryText);
        if (speechSummaryText.split(" ").length < 4) {
            wikiRefer(speechSummaryText);
        } else {
            myQuestion(speechSummaryText);
        }
        // Refresh input and hide input field
        setTimeout(function () {
            input = "";
            inputField.setAttribute("scale", "0 0 0");
        }, 4000)
    };
    recognition.start();
})


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



                                });
                            }

                            currentPage++;
                            getPage(); // get next page
                        } else {
                            // after all the pages are parsed
                            for (var i = 0; i < pages.length; i++) {
                                drawPage(i);
                            }
                            document.getElementById("intro4").style.display = "none";
                            var sounds = ['3_arts.mp3', '5_tale.mp3', '11_culture.mp3'];
                            var selectedSound = sounds[Math.floor(Math.random() * sounds.length)];
                            document.getElementById('soundlink').setAttribute('sound', 'src: url(sound/' + selectedSound + '); loop: true');
                            document.getElementById('soundlink').components.sound.playSound();
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
                            console.log("Success: " + pageText);
                            sendPassage(pageText);
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


/********************************** */
/* Wiki Window Scroll Logic         */
/********************************** */
var offset = 0;
document.getElementById("scrollDown").addEventListener("click", () => {
    console.log("success")
    offset -= 50;

    document.getElementById("wikiWindow").style.marginTop = offset + "px";
});
document.getElementById("scrollUp").addEventListener("click", () => {
    offset += 50;
    document.getElementById("wikiWindow").style.marginTop = offset + "px";
});


/********************************** */
/* Get Wikipedia article summary    */
/********************************** */
function showSummary(data) {
    console.log(data.extract)
    // take only first paragraph
    wikiText.innerHTML = data.extract.split('\n')[0];
    // find last string with image name
    var exactImg = data.image.thumbnail.source.split('/')[9];
    // re-create url to main image
    var img = data.image.thumbnail.source.replace('thumb/', '').replace('/' + exactImg, '');
    // Get sizes of the original image and based on it set landscape or portrait mode
    var imgOriginal = new Image();
    imgOriginal.src = img;
    imgOriginal.onload = function () {
        if (this.width > this.height) {
            wikiImage.setAttribute("style", "width: 600px; height:400px");
        } else {
            wikiImage.setAttribute("style", "width: 400px; height:650px")
        }
    };
    // Hide/Show tablet
    tabletVertical.setAttribute("scale", "1 1 1");

    wikiImage.setAttribute("src", img);
    // Hide text summarization window 
    tsWrapper.setAttribute("style", "display:none");
    // Hide qaWindow
    qaWrapper.setAttribute("style", "display:none");
    // Display wiki Window
    informationCard.setAttribute("style", "display:block");
    wikiWrapper.setAttribute("style", "display:block");
    up.setAttribute("style", "display:block");
    down.setAttribute("style", "display:block");
    renderVR()
}



// Get Text contents of the page loaded
var passage;

function sendPassage(myPassage) {
    passage = myPassage;
    return passage;
}

/********************************** */
/* Tensorflow Question Answer       */
/********************************** */
qna.load().then(function (loadedModel) {
    model = loadedModel;
});
// Check if speechText is present 
async function myQuestion(speechText) {
    // If yes
    if (speechText) {
        if (speechText.split(" ").length > 3) {
            const answers = await model.findAnswers(speechText, passage);

            // Hide/Show tablet
            tabletVertical.setAttribute("scale", "1 1 1");
            // Hide text summariation window 
            tsWrapper.setAttribute("style", "display:none");
            // Hide wikiWindow
            informationCard.setAttribute("style", "display:none");
            wikiWrapper.setAttribute("style", "display:none");
            up.setAttribute("style", "display:none");
            down.setAttribute("style", "display:none");
            // Show qaWindow
            qaWrapper.setAttribute("style", "display:block");
            //qQuestion.innerHTML = '<strong>Question: </strong>' + speechText;
            qAnswer.innerHTML = '<strong>Answer: </strong>' + answers[0].text;

        }
    } else if (!speechText) {
        var question = x.components.text.attrValue.value
        // If there are three spaces in the entered, run QA Model
        if (question.split(" ").length > 3) {
            const answers = await model.findAnswers(question, passage);

            // Hide/Show tablet

            tabletVertical.setAttribute("scale", "1 1 1");

            // Hide text summariation window 
            tsWrapper.setAttribute("style", "display:none");
            // Hide wikiWindow
            informationCard.setAttribute("style", "display:none");
            wikiWrapper.setAttribute("style", "display:none");
            up.setAttribute("style", "display:none");
            down.setAttribute("style", "display:none");
            // Show qaWindow
            qaWrapper.setAttribute("style", "display:block");

            //qQuestion.innerHTML = '<strong>Question: </strong>' + question;
            qAnswer.innerHTML = '<strong>Answer: </strong>' + answers[0].text;
            renderVR();
        }
    }

}


// Sound On/Off
soundOnOff.addEventListener("click", function () {
    console.log(soundOnOff.getAttribute("material").src.id);
    if (soundOnOff.getAttribute("material").src.id == "soundOn") {
        soundOnOff.setAttribute("material", "src: #soundOff");
        document.getElementById('soundlink').components.sound.pauseSound();
    } else {
        soundOnOff.setAttribute("material", "src: #soundOn");
        document.getElementById('soundlink').components.sound.playSound();

    }
})


/********************************** */
/* Web TTS, voice 1                 */
/********************************** */
let speech = new SpeechSynthesisUtterance();
speech.lang = "en";

let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[1];
    speech.pitch = 2

};
var reading = false;
document.querySelector("#read").addEventListener("click", () => {    
    speech.text = passage;
    if (reading == false) {
        reading = true;
        document.querySelector("#read").setAttribute("material", "src: #ttsOn");
        window.speechSynthesis.speak(speech);
    } else {
        reading = false;
        document.querySelector("#read").setAttribute("material", "src: #ttsOff");
        window.speechSynthesis.cancel();
    }
});




/********************************** */
/* Text Summary                     */
/********************************** */
// document.querySelector("#summarize").addEventListener("click", () => {
function summarize() {
    let paraphraseText = ""
    let wordCountChange = 3 // 1 attempts to reduce number of words, 3 attempts to increase number of words
    let changeDistance = 3 // 1 tells the model to produce small changes in terms of s

    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        text: passage,
        distance: changeDistance,
        wordCount: wordCountChange,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://finished-ainize-paraphrase-app-imjeffhi4.endpoint.ainize.ai/paraphrase/",
            requestOptions)
        .then(response => response.json())
        .then(function (result) {

            // Hide/Show tablet
            tabletVertical.setAttribute("scale", "1 1 1");

            // Hide wikiWindow
            informationCard.setAttribute("style", "display:none");
            wikiWrapper.setAttribute("style", "display:none");
            up.setAttribute("style", "display:none");
            down.setAttribute("style", "display:none");
            // Show qaWindow
            qaWrapper.setAttribute("style", "display:none");
            // Show text summariation window 
            tsWrapper.setAttribute("style", "display:block");
            console.log(result.Paraphrase);
            tsSummary.innerHTML = result.Paraphrase;
            renderVR()

        })
}
// });




/********************************** */
/* Show answer/summary/wiki         */
/********************************** */

function renderVR() {
    if (AFRAME.utils.device.checkHeadsetConnected() === false) {
        web2vr = new Web2VR("#html", {
            position: {
                x: -3.108,
                y: 3.09,
                z: -0.328
            },
            rotation: {
                x: -8,
                y: 45,
                z: 0
            },
            scale: 850,            
            border: 0
        });
        web2vr.start();


    } else {
        web2vr = new Web2VR("#html", {
            position: {
                x: -3.108,
                y: 3.09,
                z: -0.328
            },
            rotation: {
                x: -8,
                y: 45,
                z: 0
            },
            scale: 850,
            createControllers: false,           
            border: 0
        });
        web2vr.start();
    }
}