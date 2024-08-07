import packageInfo from "../../package.json";
const version = packageInfo.version;

export default () => {
  console.log(`
🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈
🌟 Thank you for using ml5.js v${version} 🌟

Please read our community statement to ensure 
that the use of this software reflects the values 
of the ml5.js community:
↳ https://ml5js.org/about

Reporting: 
↳ https://github.com/ml5js/ml5-next-gen/issues
↳ Email: info@ml5js.org 
🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈`);
};
