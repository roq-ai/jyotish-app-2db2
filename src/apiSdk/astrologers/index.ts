import axios from 'axios';
import queryString from 'query-string';
import { AstrologerInterface, AstrologerGetQueryInterface } from 'interfaces/astrologer';
import { GetQueryInterface } from '../../interfaces';

export const getAstrologers = async (query?: AstrologerGetQueryInterface) => {
  const response = await axios.get(`/api/astrologers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAstrologer = async (astrologer: AstrologerInterface) => {
  const response = await axios.post('/api/astrologers', astrologer);
  return response.data;
};

export const updateAstrologerById = async (id: string, astrologer: AstrologerInterface) => {
  const response = await axios.put(`/api/astrologers/${id}`, astrologer);
  return response.data;
};

export const getAstrologerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/astrologers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAstrologerById = async (id: string) => {
  const response = await axios.delete(`/api/astrologers/${id}`);
  return response.data;
};
