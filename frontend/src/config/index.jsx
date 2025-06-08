import axios from "axios";

import { configureStore } from "@reduxjs/toolkit";

export const BASE_URL = "http://localhost:9080";

export const clientServer = axios.create({
    baseURL: BASE_URL,
});
