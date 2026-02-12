# Physics Viz | AI-Powered 2D Physics Lab

Physics Viz is a polished, educational 2D physics visualization platform designed to transform abstract word problems into cinematic, interactive simulations. By utilizing an intelligent NLP parser, users can describe scenarios in plain English, and the system automatically calculates and renders the physical environment.

## 🚀 Description

Understanding physics often requires a bridge between mathematical equations and visual intuition. Physics Viz provides that bridge by allowing students and educators to:
- **Describe Scenarios:** Input prompts like "A ball drops from a 50m building on the Moon."
- **Visualize Forces:** Real-time rendering of velocity vectors, trajectory paths, and environmental contexts (Towers, Cliffs, Bridges).
- **Analyze Data:** Live telemetry showing time, position, velocity, and momentum alongside interactive charts.
- **Experiment:** Switch between different celestial bodies (Earth, Moon, Mars, Jupiter) to see how gravity alters physical laws.

## 🛠 Tech Stack

- **Frontend:** [React](https://react.dev/) (v19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (CDN)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Physics Engine:** Custom-built 2D Canvas integration for kinematic equations.
- **Routing:** [React Router DOM](https://reactrouter.com/) (v7)

## 🏃 How to Run the Project

This project is built using ES modules and a standard web structure.

1.  **Direct Browser Access:**
    Since the project uses an `importmap` in `index.html`, you can serve the root directory using any local development server.
    
    Using Python:
    ```bash
    python -m http.server 8000
    ```
    Or using Node.js `serve`:
    ```bash
    npx serve .
    ```

2.  **Access the App:**
    Open your browser and navigate to `http://localhost:8000` (or the port specified by your server).

3.  **VS Code**
   Make sure Node.js need to be installed.
   Open Terminal->New Terminal
   Type below commands
   step1:   npm install
   step2:  npm run dev
   step3:  You’ll see output like:
           ➜ Local: http://localhost:5173/
   step4:    Click the link OR copy into browser:
                http://localhost:5173
     
## 📦 Dependencies

All dependencies are loaded via CDN (esm.sh) as defined in the `index.html` import map:
- `react` & `react-dom`
- `framer-motion`
- `react-router-dom`
- `recharts`

## 💡 Important Instructions

- **AI Prompting:** Use keywords like "velocity", "angle", "height", "mass", "force", and "gravity" (or planet names) in the input box to see the lab parameters update automatically.
- **Environment Context:** Mentioning "tower", "bridge", "cliff", or "moon" will change the visual backdrop of the simulation.
- **Controls Sidebar:** Use the right sidebar to manually override AI-parsed values, view live data telemetry, or switch between position/velocity/acceleration graphs.
- **Resetting:** If a simulation goes out of bounds or completes, click **RESET** to return to the initial state.

---
Built with ❤️ for physics enthusiasts and students.
