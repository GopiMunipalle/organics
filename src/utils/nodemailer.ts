import { createTransport } from "nodemailer";

const transport = createTransport({
  service: process.env.EMAILSERVICE,
  host: process.env.DBHOST,
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASSWORD,
  },
});

export default transport;
