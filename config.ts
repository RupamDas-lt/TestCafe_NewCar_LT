import * as dotenv from "dotenv";
dotenv.config();
import "core-js/stable";

// Define a default URL as the fallback
const defaultBaseUrl = "https://www.qa.truecardev.com/";

let baseUrl: string;

if (process.env.GK_ENV === "dev") {
  baseUrl = process.env.GK_ENDPOINT;
} else if (process.env.POD) {
  baseUrl = `https://consumer-frontend-${process.env.POD}.dev.true.sh/`;
} else if (process.env.ENV === "local") {
  baseUrl = "http://www.local.truecardev.com:8888/";
} else {
  // Use the defaultBaseUrl as the fallback value
  baseUrl = defaultBaseUrl;
}

export const config = {
  baseUrl: baseUrl,
};
