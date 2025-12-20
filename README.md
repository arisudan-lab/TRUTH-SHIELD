# TRUTH-SHIELD 🛡️
**Building a website to detect what is fake and what is truth.**

TRUTH-SHIELD is an AI-powered platform designed to combat digital deception by detecting misinformation in news articles and identifying deepfake videos in real-time. This project was developed for a hackathon to showcase a full-stack AI implementation.

---

## 🚀 Live Demo
**Website Link:** [https://truth-shield-navy.vercel.app/](https://truth-shield-navy.vercel.app/)

---

## 🛠️ Tools & Tech Stack

### **Machine Learning & Data Processing**
*   **Google Colab:** Used for the primary training of the models and data preparation.
*   **Python:** The core language for backend logic and AI processing.
*   **FastAPI:** High-performance web framework for building the detection APIs.
*   **Scikit-Learn:** Powering the Fake News detection using Logistic Regression.
*   **Keras / TensorFlow:** Used for the Deepfake detection model.
*   **OpenCV:** Handles video processing and frame extraction for deepfake analysis.

### **Frontend & Deployment**
*   **React / Vite / Tailwind CSS:** Used to build the modern, responsive user interface.
*   **Vercel:** Hosts the frontend application for instant, high-speed access.
*   **Render:** Powers the backend FastAPI server and model hosting.
*   **GitHub Actions:** Used to keep the backend service alive and automated.

---

## 📊 Important: Model & Data Note (Hackathon Demo)
*   **Limited Data:** Please note that the models are trained with **old and very minimal data** specifically for this demo purpose.
*   **Accuracy:** While the pipeline is fully functional, the detection accuracy is representative of a Proof of Concept (PoC). In a production environment, these models would be scaled with larger, modern datasets.

---

## 🧪 Testing TRUTH-SHIELD
We have provided sample data (videos and CSV files) to help you test the detection capabilities:

**Test Data Folder:** [Videos and CSV Files for Testing](https://drive.google.com/drive/folders/1-3axdr78WiDlA9Ca7yYYjA5H0vC69wfd?usp=sharing)

### **Sample News Cases**
Copy and paste these into the "Analyze Text" section:

*   **✅ True News Example:** 
    > "U.S. officials said Russia interfered in the 2016 election, prompting an ongoing federal investigation into possible political links."
*   **❌ Fake News Example:** 
    > "Donald Trump was mocked online after an embarrassing incident sparked widespread ridicule and outrage."

---


## 💻 Local Usage & Development

To run **TRUTH-SHIELD** on your own machine, follow these steps:

### **1. Setup the Backend (FastAPI)**
1.  **Clone the Repository:**
    ```
    git clone https://github.com/arisudan-lab/TRUTH-SHIELD.git
    cd TRUTH-SHIELD
    ```
2.  **Create and Activate a Virtual Environment:**
    ```
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install Dependencies:**
    ```
    pip install -r requirements.txt
    ```
4.  **Start the Backend Server:**
    ```
    uvicorn main:app --reload --port 8000
    ```

### **2. Setup the Frontend (Vite/React)**
1.  **Open a NEW Terminal and navigate to the `www` folder:**
    ```
    cd www
    ```
2.  **Install Frontend Dependencies:**
    ```
    npm install
    ```
3.  **Launch the Development Site:**
    ```
    npm run dev
    ```
4.  **Access the Project:**
    Open your browser to `http://localhost:5173`. 

---

## 🤝 Contributing
Contributions are welcome! If you're using this for a hackathon, feel free to fork this repository and add your own features.

## 👤 Author
Developed by 
    Arisudan Pradhan\n
    Rishav Pal\n
    Sneha Naskar\n
    Sujal Das


