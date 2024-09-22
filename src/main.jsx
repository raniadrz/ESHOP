import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import { store } from './redux/store';


import SpeedInsights from '@vercel/speed-insights'; // Import directly without destructuring

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
  
        <ThemeProvider>
          <App />
        </ThemeProvider>

    </Provider>,
    <SpeedInsights />
  </React.StrictMode>
);