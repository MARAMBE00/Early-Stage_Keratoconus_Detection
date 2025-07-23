# 👁️ KeratoScan AI – Early-Stage Keratoconus Detection using NASNet

KeratoScan AI is an AI-driven diagnostic tool designed to detect early-stage keratoconus—a progressive eye disease—using corneal topography images. Leveraging the NASNet deep learning architecture, this system offers accurate classification alongside a user-friendly, multi-role web interface suitable for medical professionals.


## 🚀 Features

- 🧠 **NASNetMobile-based deep learning model** for high-accuracy classification.
- 🖼️ Upload and analyze corneal topography images in real time.
- 🧑‍⚕️ Multi-role platform: Doctor, Topographer, and IT Admin.
- 📊 Integrated patient management, report generation, and prediction storage.
- 🔐 Firebase Authentication and Firestore for secure, cloud-based data handling.
- 📈 Model Evaluation: Accuracy (95.36%), Precision (97.86%), Recall (98.15%), AUC (0.9869)


## 🛠️ Tech Stack

| Tier              | Technologies                                                                 |
|-------------------|------------------------------------------------------------------------------|
| **Frontend**      | React.js, TypeScript, Vite                                                   |
| **Backend**       | Python, Flask, TensorFlow, Keras, Scikit-learn                               |
| **Model Training**| Google Colab                                                                 |
| **Database**      | Firebase Firestore                                                           |
| **Tools**         | Git, GitHub, Visual Studio Code                                              |


## 🧠 Model Highlights

* **Architecture:** NASNetMobile
* **Dataset:** Labeled corneal topography images (validated by domain expert)
* **Preprocessing:** Resizing, normalization, data augmentation
* **Evaluation Metrics:** Accuracy, Precision, Recall, AUC
* **Tuning:** Keras Tuner with early stopping


## 🩺 Use Case

Ideal for clinical environments and telemedicine platforms where early keratoconus detection is critical but expert tools may not be accessible. It enhances screening accuracy and can support ophthalmologists in diagnosis.

## 📷 Screenshots
<img width="1379" height="900" alt="Home Page" src="https://github.com/user-attachments/assets/a02d9021-98e8-4654-943b-bf2697023443" />
<img width="1385" height="757" alt="IT User's Dashboard" src="https://github.com/user-attachments/assets/f531d7f6-cab2-4372-b5d2-ce0b540a3f98" />
<img width="1287" height="1096" alt="Doctor's Dashboard" src="https://github.com/user-attachments/assets/f268f792-f698-48d9-828a-86498cd6e6d0" />
<img width="1324" height="1956" alt="Thopographer's Dashboard" src="https://github.com/user-attachments/assets/0604eb93-1c64-4e12-9ff3-393a02351ac7" />

## 🙏 Acknowledgments

* Supervised by Mr. Pushpika Liyanarachchi
* Special thanks to domain experts for validating the dataset and application
