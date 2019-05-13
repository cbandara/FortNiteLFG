"use strict";

exports.DATABASE_URL = process.env.DATABASE_URL;
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/fortnite-test";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.FORTNITE_API_KEY = process.env.FORTNITE_API_KEY;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
