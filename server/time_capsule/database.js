import { Sequelize, Model, DataTypes, Utils } from "sequelize";

// Read DB connection info from environment variables so the app can connect
// to a Postgres container when running under Docker Compose. Defaults keep
// local development working without setting env vars.
const {
  DB_DIALECT = "postgres",
  DB_NAME = "postgres",
  DB_USER = "postgres",
  DB_PASS = "mysecretpassword",
  DB_HOST = "db",
  DB_PORT = 5432,
  DB_SSL = "false",
} = process.env;

export const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
  host: DB_HOST,
  port: Number(DB_PORT),
  logging: false,
  dialectOptions: DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : undefined,
});

//user authentication table
class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      //validate: {isEmail: true}
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "User" },
);

// file storage table
class File extends Model {}
File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kdfName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iterations: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salt: {
      type: DataTypes.TEXT, // base64
      allowNull: false,
    },
    nonce: {
      type: DataTypes.TEXT, // base64
      allowNull: false,
    },
    aad: {
      type: DataTypes.TEXT, // base64
      allowNull: true,
    },
    ciphertext: {
      type: DataTypes.TEXT, // base64 of ct
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { sequelize, modelName: "File" },
);

// Associations
User.hasMany(File, { foreignKey: "userId", as: "files" });
File.belongsTo(User, { foreignKey: "userId", as: "user" });

// Image model for uploaded images
class Image extends Model {}
Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "Image" },
);

User.hasMany(Image, { foreignKey: "userId", as: "images" });
Image.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, File, Image };


// (async () => {
//   await sequelize.sync();
//   const jane = await User.create({
//     email: 'testemail@gmail.com',
//     passwordHash: 'veryrandompasswordhash',
//   });
//   console.log(jane.toJSON());
// })();
// (async () => {
//   try {
//     await sequelize.sync();

//     // Create a test user (or replace with an existing userId)
//     const user = await User.create({
//       email: 'filetestuser@gmail.com',
//       passwordHash: 'randomhash123',
//     });

//     console.log("User created:", user.toJSON());

//     // Insert a test file under that user
//     const file = await File.create({
//       userId: user.id,
//       fileName: "testFile.txt",
//       kdfName: "pbkdf2-sha256",
//       iterations: 200000,
//       salt: Buffer.from("salt123").toString("base64"),
//       nonce: Buffer.from("nonce123").toString("base64"),
//       aad: Buffer.from("metadata").toString("base64"),
//       ciphertext: Buffer.from("ciphertext123").toString("base64"),
//       expiresAt: null,
//     });

//     console.log("File created:", file.toJSON());

//   } catch (err) {
//     console.error("Error inserting file:", err);
//   }
// })();
