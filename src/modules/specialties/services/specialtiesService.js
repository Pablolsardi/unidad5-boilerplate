import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

const BASE_URL = 'api/specialties';

function getSpecialties({ pageIndex = 1, pageSize = 10, name } = {}) {
  const params = { pageIndex, pageSize };

  if (name?.trim()) params.name = name.trim();

  return apiRequest(() => instance.get(BASE_URL, { params }));
}

function createSpecialty({ name, description }) {
  return apiRequest(() => instance.post(BASE_URL, { name, description }));
}

function updateSpecialty(id, { name, description }) {
  return apiRequest(() =>
    instance.put(`${BASE_URL}/${id}`, { name, description })
  );
}

function deleteSpecialty(id) {
  return apiRequest(() => instance.delete(`${BASE_URL}/${id}`));
}

export { getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty };
