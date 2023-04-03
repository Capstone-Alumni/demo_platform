import data from 'src/data/province.json';

export const getProvinceList = () => {
  return data.map(province => ({
    name: province.name,
    code: province.code,
    codename: province.codename,
  }));
};

export const getCityList = (provinceCodename: string) => {
  const provinceData = data.find(d => d.codename === provinceCodename);

  if (provinceData) {
    return provinceData?.districts.map(dis => ({
      name: dis.name,
      code: dis.code,
      codename: dis.codename,
    }));
  }

  return [];
};
