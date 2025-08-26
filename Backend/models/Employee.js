const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Employee = sequelize.define(
    "Employee",
    {
      employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true, // Admin can set this later
        validate: {
          notEmpty: true,
        },
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true, // Admin can set this later
        validate: {
          notEmpty: true,
        },
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true, // Admin can set this later
        validate: {
          min: 0,
        },
      },
      hireDate: {
        type: DataTypes.DATEONLY,
        allowNull: true, // Admin can set this later
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      emergencyContact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergencyPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "terminated"),
        defaultValue: "active",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "employees",
      timestamps: true,
    }
  );

  return Employee;
};
