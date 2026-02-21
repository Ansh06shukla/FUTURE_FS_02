# FUTURE_FS_02 — Mini CRM

**Mini CRM** is a basic **Client Lead Management System** built with Node.js and vanilla JavaScript. It allows you to manage client data, leads, and basic CRM activities from a web interface with a simple backend server. This is a lightweight CRM starter project suitable for learning and small use-cases.

---

## 🚀 Features

✔ Display a dashboard with client and lead data  
✔ Add, view & manage clients and leads  
✔ Basic REST API powered by **Node.js + Express**  
✔ Uses JSON as a data source (`crm.json`)  
✔ Frontend powered by vanilla JavaScript and HTML/CSS  

---

## 🧱 Tech Stack

| Component | Technology |
|-----------|------------|
| Backend   | Node.js, Express |
| Frontend  | HTML, CSS, JavaScript |
| Data      | JSON file (`crm.json`) |
| Tools     | cors, dotenv, nodemon |

---

## 📁 Project Structure

```

FUTURE_FS_02/
├── .github/
├── routes/
├── activities.js
├── api.js
├── app.js
├── clients.js
├── crm.json  ← Sample data
├── dashboard.js
├── database.js
├── index.html
├── leads.js
├── server.js ← Main server
├── style.css
├── package.json
├── package-lock.json
└── README.md

````


## 🛠 Installation

### Requirements

Make sure you have the following installed:

- Node.js (v14+ recommended)
- npm (comes with Node)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ansh06shukla/FUTURE_FS_02.git
````

2. **Navigate into the project**

   ```bash
   cd FUTURE_FS_02
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

▶️ Running the App

In development mode

This uses **nodemon** to auto-restart the server on changes:

```bash
npm run dev
```

### In production mode

```bash
npm start
```

After the server starts, open your browser and go to:

http://localhost:3000

📌 Usage

Once running, the Mini CRM provides:

* A dashboard with client and lead summaries
* Interactive UI to view and manage CRM entries
* Backend API to serve and update JSON data

You can extend this to add real database support, authentication, or more detailed lead management features.

🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes
4. Commit them (`git commit -m "Add feature"`)
5. Push to your fork (`git push origin feature-name`)
6. Create a Pull Request

📜 License

This project is open source and free to use. See the license file (if any) for details.

📬 Contact

If you have questions or want to collaborate, feel free to reach out:

✔ **Project Owner:** Ansh06shukla
✔ **GitHub:** [https://github.com/Ansh06shukla](https://github.com/Ansh06shukla)

---

⭐ *If you find this project useful, consider giving it a star!*

If you want, I can also help you add badges (like build status, license, version) or generate a fancy Table of Contents!
