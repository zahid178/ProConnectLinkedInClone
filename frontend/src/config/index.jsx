import axios from "axios";

import { configureStore } from "@reduxjs/toolkit";

export const BASE_URL = "https://proconnectlinkedinclone-q31n.onrender.com/";

export const clientServer = axios.create({
    baseURL: BASE_URL,
});
