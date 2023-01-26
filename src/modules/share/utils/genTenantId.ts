import uniqid from 'uniqid';

export const genTenantId = (name: string) => {
  const words = name.trim().replace(/\s\s+/g, ' ').split(' ');
  const shortname = words.map(word => word.toLowerCase().charAt(0)).join();
  const id = uniqid();
  return `${shortname}_${id}`;
};
