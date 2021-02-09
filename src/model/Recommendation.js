import http from "../utils/request";

export default class Recommendation {
  static loadRecommendations = async token => {
    const { data } = await http.get('/recommendation', token ? {
      headers: { 'Authorization': `Bearer ${token}` },
    } : undefined);
    return data;
  }
}
