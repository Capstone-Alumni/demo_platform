import data from 'src/data.json';

const getSubscriptionDisplay = (name?: string) => {
  if (!name) {
    return '';
  }

  const item = data.find(d => d.name === name);

  return item?.display;
};

export default getSubscriptionDisplay;
