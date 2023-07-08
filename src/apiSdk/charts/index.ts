import axios from 'axios';
import queryString from 'query-string';
import { ChartInterface, ChartGetQueryInterface } from 'interfaces/chart';
import { GetQueryInterface } from '../../interfaces';

export const getCharts = async (query?: ChartGetQueryInterface) => {
  const response = await axios.get(`/api/charts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createChart = async (chart: ChartInterface) => {
  const response = await axios.post('/api/charts', chart);
  return response.data;
};

export const updateChartById = async (id: string, chart: ChartInterface) => {
  const response = await axios.put(`/api/charts/${id}`, chart);
  return response.data;
};

export const getChartById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/charts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteChartById = async (id: string) => {
  const response = await axios.delete(`/api/charts/${id}`);
  return response.data;
};
