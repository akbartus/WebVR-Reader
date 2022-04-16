# Interactive Reading Environment in Web-Based Virtual Reality

### **Description / Rationale**
Virtual reality can be used for delivering information effectively, while fostering immersion. Reading applications created specifically in web-based virtual reality, can offer significant advantages: they can make virtual reality more accessible, because they are served over the web and are compatible with most if not all VR devices. 

The present project is about the reading platform that allows users to read their own pdf materials in web-based virtual reality setting that features both interactivity and playability, created thanks to various artificial intelligence/machine learning tools. 

### **GoalS**
The goals of the project are: 
* To demonstrate new type of reading experience. 
* To demonstrate advanced capabilities of web VR.
* To create accessible VR reading experience.

### **Features**
The application consist of two parts: 
1. train.html - It is used to train images for classification, save training results and test them.
2. load.html - It is used to load trained image classifier.

### **Structure**
The reading platform offers 4 modes for reading: 

**1. User-generated environment (Simple Mode)** 
In this mode users can use theiw own 360 photos or choose the default 3D model of a room or select one of five 3d environments and then upload a pdf file.


1. Copy the repository to your development environment.
2. Use "train.html" to train. Click on first button (idle) several times and train idle image. Click on second button several times (object1) and train second image and so on. 3. After you are confident with the results save your image classification using transfer learning. A file will be generated with the name of "weights.json".
4. Refresh "train.html" page and load "weights.json" file to test if everything works ok.  
5. Put "weights.json" into the same folder, where this application is.
6. If test was successfull and previously trained images are recognized, use "load.html" file to load trained image classification. If necessary integrate it into your own code (together with main.js file).

**Web**
1. Copy the repository to your development environment.
2. Use "train.html" to train. Use "train.html" to train. Click on first button (idle) several times and train idle image. Click on second button several times (object1) and train second image and so on. 
3. After you are confident with the results save your image classification using transfer learning. A file will be generated with the name of "weights.json".
4. Refresh "train.html" page and load "weights.json" file to test if everything works ok.  
5. Put "weights.json" into the same folder, where this application is.
6. If test was successfull and previously trained images are recognized, put "weights.json" file into the same folder as the application on server. Use "load.html" file to load trained image classification.

### **Demo**
To see the application: [Demo application](https://transferlearning.glitch.me/train.html)
