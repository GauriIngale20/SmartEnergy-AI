import api from "./api";

const billService = {
  async uploadBillFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload-bill", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000
    });
    return response.data;
  },
  async getBills() {
    const response = await api.get("/bills");
    return response.data;
  },
  async getBillById(id) {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },
  async createBill(billData) {
    const response = await api.post("/bills", billData);
    return response.data;
  },
  async updateBill(id, billData) {
    const response = await api.put(`/bills/${id}`, billData);
    return response.data;
  },
  async deleteBill(id) {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  }
};

export default billService;

