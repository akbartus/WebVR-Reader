var x = document.getElementById("input");
var myCamera = document.getElementById("myCamera");
var infoWindow = document.getElementById("infoWindow");
var tabletHorizontal = document.getElementById("tabletHorizontal");
var openClose = document.getElementById("openClose");
var mainWindow = document.getElementById("mainWindow");
var soundOnOff = document.getElementById("soundOnOff");
var notesOnOff = document.getElementById("notesOnOff");


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
    } else {
        openClose.setAttribute("material", "src: #interfaceOn");

        allButtons.setAttribute("scale", "1 1 1");
        mainWindow.setAttribute("material", "color: #5475d4; transparent: true; opacity: 0.5; side:double");

    }
})

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
    if (openClose.getAttribute("text").value == "UI off") {
        openClose.setAttribute("text", "value: UI on");
        mainWindow.setAttribute("scale", "1 1 1");
        // document.querySelector("a-sphere").setAttribute("class", "none");
    } else {
        openClose.setAttribute("text", "value: UI off");
        // document.querySelector("a-sphere").setAttribute("class", "navButton");
        mainWindow.setAttribute("scale", "0 0 0");
    }
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
                            }).join('') //.replace(/- /g, "").replace(/’/g, "").replace(/“/g, "").replace(/”/g, "").replace(/'/g, "").replace(/\[[0-9]\]/g, "").replace(/[A-Z][.][A-Z][.][A-Z][.]/g, "");
                            console.log(pageText);
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




// Get Text contents of the page loaded
var passage;

function sendPassage(myPassage) {
    passage = myPassage;
    return passage;
}



/********************************** */
/* Question Generator. Word Vector  */
/********************************** */
// Answers to show
var NUM_TO_SHOW = 4;
// Constants
var WORDS = Object.keys(wordVecs);
var container = [];
var saveContainer;
var correctAnswersContainer = [];
var totalScore = document.getElementById("totalScore");
var currentQuestion = 0;
var previousQuestion = -1;
var score = 0
var remainingQuestions = document.getElementById("remainingQuestions");
var questionsNumber;

document.querySelector("#qa").addEventListener("click", () => {

    // Question Generation Code.
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    var formdata = new FormData();
    formdata.append("input", passage);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };
    fetch("https://master-question-generation-wook-2.endpoint.ainize.ai/generate", requestOptions)
        .then(response => response.json())
        .then(function (result) {
            console.log(result);
            questionsNumber = Object.keys(result.question).length;
            showResult(result);

        })
        .catch(error => console.log('error', error));



    //Local test
    // var data = {
    //     "answer": {
    //         0: "Albert Einstein",
    //         1: "German",
    //         2: "quantum mechanics aaaaa",
    //         3: "relativity",
    //         4: "Austria",
    //         5: "Cyberspacers"
    //     },
    //     "question": {
    //         0: "Who was a German-born theoretical physicist?",
    //         1: "Who was Albert Einstein?",
    //         2: "What theory did Einstein contribute to?",
    //         3: "What is Albert Einstein best known for developing?",
    //         4: "Where else Einstein worked?",
    //         5: "Where is the Ultimate VR?"
    //     }
    // }


    // questionsNumber = Object.keys(data.question).length;
    // showResult(data);
    // printed(data);

    function showResult(data) {
        printed(data);
        for (var i = 0; i < Object.keys(data.question).length; i++) {

            // Get Question    
            var question = data.question[i];
            // Answer Part A
            var answerPartA = data.answer[i].split(' ')[0].toLowerCase();
            // Answer Part B
            var answerPartB = data.answer[i].substr(data.answer[i].indexOf(" ") + 1).toLowerCase();
            generateQA(question, answerPartA, answerPartB)
            correctAnswersContainer[i] = answerPartA;
        }

    }
    var word;
    // For checking if similar words found
    var simWordsSorted;

    function generateQA(question, answerA, answerB) {
        // Main part
        word = answerA;

        var simWords = Word2VecUtils.findSimilarWords(NUM_TO_SHOW, word);
        // If there are four possible similar words
        if (simWords.length == 4) {
            // then assign it to simWordsSorted. This will help to prevent blank answer based questions
            simWordsSorted = simWords;
        }
        //shuffle array - question and answer to make it always different
        var shuffledArray = simWordsSorted.sort((a, b) => 0.5 - Math.random());

        // Push to container array and create question/answer container
        container.push({
            "question": question,
            "answer": simWordsSorted,
            "answerB": answerB
        });



        createQuiz(container);

    }


    function createQuiz(data) {
        //  //shuffle array - question and answer to make it always different
        // var shuffledArray = data.sort((a, b) => 0.5 - Math.random());
        for (var j = 0; j < data.length; j++) {
            // Check if the 
            if (data.length == questionsNumber) {
                var questionDiv = document.getElementById("question");
                var questionSubDiv = document.createElement('div');
                questionSubDiv.setAttribute("class", "questions");
                questionSubDiv.innerHTML = data[j].question;

                questionDiv.appendChild(questionSubDiv);
                var answersPartA;
                var answersPartB;

                var alphabet = ["A", "B", "C", "D"];
                for (var i = 0; i < data[j].answer.length; i++) {
                    answersPartA = data[j].answer[i][0];

                    // If first answer from 4 answers is the same as second part of the answer
                    // remove second part of the answer else put it      
                    if (data[j].answer[0][0] == data[j].answerB || data[j].answer[1][0] == data[j].answerB || data[j].answer[2][0] == data[j].answerB || data[j].answer[3][0] == data[j].answerB) {
                        answersPartB = "";
                    } else {
                        answersPartB = data[j].answerB;
                    }
                    var tr = document.createElement('div');
                    var currentAnswer = "'" + answersPartA + "'";
                    tr.setAttribute("class", "answers");

                    // Create clickable buttons with answers
                    tr.innerHTML = '<div><a onclick="checkAnswer(' + j + ', ' + currentAnswer + ')">' + alphabet[i] + ')  ' + answersPartA.charAt(0).toUpperCase() + answersPartA.slice(1) + ' ' + answersPartB.charAt(0).toUpperCase() + answersPartB.slice(1) + '</a></div>';
                    questionSubDiv.appendChild(tr);

                    showFirstQuestion();
                }
            }
        }
    }
})

// Create Quiz
function showFirstQuestion() {
    totalScore.innerHTML = "Score: 0";
    remainingQuestions.innerHTML = "Total Questions: " + currentQuestion + "/" + questionsNumber;
    document.getElementsByClassName("questions")[0].setAttribute("style", "display: block");
    // Load tablet
    tabletHorizontal.setAttribute("scale", "1 1 1");
}

function checkAnswer(question, answer) {
    var allQuestions = document.getElementsByClassName("questions");
    if (correctAnswersContainer[question] == answer) {
        currentQuestion++
        previousQuestion++;
        score++;
        allQuestions[previousQuestion].setAttribute("style", "display: none");
        // if current question is less than total number of questions
        // else set the attribute of the last question to block and change it to the text
        if (currentQuestion < questionsNumber) {
            allQuestions[currentQuestion].setAttribute("style", "display: block");
        } else {
            allQuestions[previousQuestion].setAttribute("style", "display: block; text-align: center");
            allQuestions[previousQuestion].innerHTML = "GAME OVER";
        }
        totalScore.innerHTML = "Score: " + score;
        remainingQuestions.innerHTML = "Total Questions: " + currentQuestion + "/" + questionsNumber;
        console.log("Correct");
    } else {
        currentQuestion++
        previousQuestion++;
        allQuestions[previousQuestion].setAttribute("style", "display: none");
        // if current question is less than total number of questions
        // else set the attribute of the last question to block and change it to the text
        if (currentQuestion < questionsNumber) {
            allQuestions[currentQuestion].setAttribute("style", "display: block");
        } else {
            allQuestions[previousQuestion].setAttribute("style", "display: block; text-align: center");
            allQuestions[previousQuestion].innerHTML = "GAME OVER";
        }
        totalScore.innerHTML = "Score: " + score;
        remainingQuestions.innerHTML = "Total Questions: " + currentQuestion + "/" + questionsNumber;
        console.log("Not Correct");
    }
}


// Create a printable entity
var printNotes = false;
function printed(data) {
    // Allow only 5 questions to show. And add questions only once
    // Object.keys(data.question).length
    if (printNotes == false) {
        printNotes = true;
        for (var i = 0; i < 5; i++) {
            var printedQuestions = document.getElementById("printedQuestions");
            var printedQuestion = document.createElement('div');
            printedQuestion.setAttribute("class", "printedQ");
            printedQuestion.innerHTML = "<b>Question:</b> " + data.question[i] + "<br/><b>Answer:</b> " + data.answer[i];
            printedQuestions.appendChild(printedQuestion);
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

// Notes On/Off
notesOnOff.addEventListener("click", function () {
    
    if (notesOnOff.getAttribute("material").src.id == "notesOff") {
        notesOnOff.setAttribute("material", "src: #notesOn");
        infoWindow.setAttribute("visible", true);
    } else {
        notesOnOff.setAttribute("material", "src: #notesOff");
        infoWindow.setAttribute("visible", false);
        

    }
})


// Export GLTF (GLB)
function exportGLTF(input, options) {
    AFRAME.scenes[0].systems['gltf-exporter'].export(input, options);
}
function exportModel() {
    if(infoWindow.getAttribute("visible") == true){
        exportGLTF(infoWindow);
    }
    
}