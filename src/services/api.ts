import axios from "axios";

const API = axios.create({
    baseURL: "https://fakestoreapi.com",
});

export const getProducts = async () => {
    const res = await API.get("/products");
    return res.data;
}