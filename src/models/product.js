import { DataTypes, Sequelize } from 'sequelize';

const Product = (sequelize) => (
  'Product',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }
);

export default Product;
