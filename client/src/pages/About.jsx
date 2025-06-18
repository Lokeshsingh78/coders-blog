import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="mb-6">
          <span className="inline-block text-5xl mb-3 animate-bounce">🚀</span>
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            About This Blog Project
          </h1>
        </div>

        <div className="text-md text-gray-700 dark:text-gray-300 flex flex-col gap-6">
          <p className="bg-blue-50 dark:bg-gray-700 p-4 rounded-xl shadow-sm">
            Welcome to <span className="font-semibold text-blue-700 dark:text-blue-400">Coder's Blog</span> — a personal full-stack adventure built with heart 💻✨ and a love for learning.
          </p>

          <div>
            <p>
              This platform runs on the mighty <span className="font-semibold">MERN Stack</span>:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-1 rounded-full font-semibold shadow">MongoDB 🛢️</span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1 rounded-full font-semibold shadow">Express.js ⚙️</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-4 py-1 rounded-full font-semibold shadow">React.js ⚛️</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-1 rounded-full font-semibold shadow">Node.js 🚀</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-medium">It features:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 dark:bg-gray-700 p-2 rounded-lg flex items-center justify-center shadow-sm">🔐 <span className="font-medium ml-2">Firebase Auth</span></div>
              <div className="bg-blue-50 dark:bg-gray-700 p-2 rounded-lg flex items-center justify-center shadow-sm">✍️ <span className="font-medium ml-2">Post Editor</span></div>
              <div className="bg-blue-50 dark:bg-gray-700 p-2 rounded-lg flex items-center justify-center shadow-sm">💬 <span className="font-medium ml-2">Comments</span></div>
              <div className="bg-blue-50 dark:bg-gray-700 p-2 rounded-lg flex items-center justify-center shadow-sm">👍 <span className="font-medium ml-2">Likes</span></div>
            </div>
            <span>
              — all wrapped in a sleek, responsive UI powered by <span className="font-semibold">Tailwind CSS</span> 🎨.
            </span>
          </div>

          <p>
            This blog isn't just a project — it's my digital notebook. A space to build, break, learn, and share real-world development knowledge 🌍✨.
          </p>

          <p>
            Dive in, drop a comment, or check out the source on{" "}
            <a
              href="https://github.com/Lokeshsingh78"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors font-semibold"
            >
              GitHub
            </a>
            .
          </p>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <p className="italic text-sm text-gray-500 dark:text-gray-400">
              "Code with purpose 💻. Share with heart ❤️. Grow with community 🌱."
            </p>
            <p className="text-sm font-medium mt-2 text-gray-600 dark:text-gray-300">
              — Lokesh Singh Tanwar
            </p>
            <div className="flex justify-center gap-4 mt-3 text-sm">
              <a
                href="https://dev.to/lokesh_singh"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center font-medium"
              >
                📝 Dev.to
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a
                href="https://x.com/Not_LokeshSingh"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center font-medium"
              >
                🐦 X (Twitter)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
