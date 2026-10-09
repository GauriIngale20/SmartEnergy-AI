import api from "./api";

const predictionService = {
  async predictUsage(data) {
    const response = await api.post("/predict", data);
    return response.data;
  },
  async getPredictionHistory() {
    const response = await api.get("/predictions");
    return response.data;
  },
  async getEnergyInsights() {
    const response = await api.get("/insights");
    return response.data;
  }
};

export default predictionService;
