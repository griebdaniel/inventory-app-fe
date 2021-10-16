import namor from 'namor';
import _ from 'lodash';
import Supply from '../../models/supply';

const units = ['decigram', 'centigram', 'milligram', 'decagram', 'hectogram', 'kilogram'];

const newSupply = (): Supply => {
  return {
    name: namor.generate({ words: 1, numbers: 0, saltLength: 0 }),
    quantity: Math.floor(Math.random() * 30),
    unit: units[Math.floor(Math.random() * (units.length - 1))],
  };
};

const getSupplies = (length: number): Supply[] => {
  return _.range(length).map(_ => newSupply());
};

export default getSupplies;
