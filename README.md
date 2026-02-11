# 🚀 AI Code Reviewer

A full-stack AI-powered code review and refactoring application built with **FastAPI** (backend) and **React + Vite** (frontend).

## ✨ Features

- 🔍 **AI Code Review** - Get detailed code reviews with bug detection, security analysis, and best practices
- 🎨 **Code Refactoring** - Receive refactored code with improved readability and performance
- 💻 **Monaco Editor** - Professional code editor with syntax highlighting, IntelliSense, and auto-completion (same as VS Code)
- 🌈 **Beautiful UI** - Modern, premium design with Tailwind CSS and smooth animations
- ⚡ **Real-time Analysis** - Fast responses powered by Groq AI
- 🎯 **Multi-language Support** - JavaScript, Python, Java, TypeScript, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin
- 📋 **Copy Results** - One-click copy functionality for AI-generated insights

## 🏗️ Project Structure

```
ai/
├── server/              # FastAPI Backend
│   ├── app/
│   │   ├── api/        # API routes
│   │   ├── models/     # Pydantic models
│   │   ├── services/   # Business logic
│   │   ├── utils/      # Utilities
│   │   ├── config.py   # Configuration
│   │   └── main.py     # FastAPI app
│   ├── .env            # Environment variables
│   ├── requirements.txt
│   └── venv/
│
└── client/             # React Frontend
    ├── src/
    │   ├── components/ # React components
    │   ├── services/   # API integration
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   - Edit `.env` file and add your Groq API key:
   ```env
   GROQ_API_KEY=your_actual_groq_api_key_here
   MODEL_NAME=llama-3.3-70b-versatile
   ```
   - Get your API key from: https://console.groq.com/keys

5. **Start the server:**
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   - Server runs on: http://127.0.0.1:8000
   - API docs: http://127.0.0.1:8000/docs

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   - Client runs on: http://localhost:5173

## 🎯 Usage

1. **Start both servers** (backend and frontend)
2. **Open browser** to http://localhost:5173
3. **Paste your code** in the left panel
4. **Select programming language** from the dropdown
5. **Click "Review Code"** for code analysis or **"Refactor Code"** for improvements
6. **View results** in the right panel

## 🔧 API Endpoints

### POST `/api/review`
Review code for bugs, security issues, and best practices.

**Request:**
```json
{
  "code": "function example() { ... }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "result": "Detailed code review analysis..."
}
```

### POST `/api/refactor`
Get refactored code with improvements.

**Request:**
```json
{
  "code": "function example() { ... }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "result": "Refactored code with explanations..."
}
```

## 🎨 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Groq AI** - LLM API for code analysis
- **Python-dotenv** - Environment management

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Monaco Editor** - Professional code editor (VS Code's editor)
- **Lucide React** - Icons
- **Fetch API** - HTTP requests

## 📝 Code Quality Features

The AI analyzes your code for:
- 🐛 **Bugs and potential issues**
- 🔒 **Security vulnerabilities**
- ⚡ **Performance bottlenecks**
- 📛 **Naming conventions**
- 🛡️ **Error handling**
- 📚 **Documentation and comments**
- ✅ **Best practices and design patterns**

## 🚨 Troubleshooting

### Backend Issues

**"uvicorn not recognized":**
```bash
python -m uvicorn app.main:app --reload
```

**"Module not found" errors:**
```bash
pip install -r requirements.txt
```

**"API key not loading":**
- Make sure `.env` file exists in the `server` directory
- Check that `GROQ_API_KEY` is set correctly
- Restart the server after changing `.env`

### Frontend Issues

**"Cannot connect to server":**
- Ensure backend is running on http://127.0.0.1:8000
- Check CORS settings in `server/app/main.py`

**Build errors:**
```bash
npm install --legacy-peer-deps
```

## 📄 License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Built with ❤️ using FastAPI, React, and Groq AI**
