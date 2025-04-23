
// Test file to verify grecaptcha type declaration
const testGrecaptcha = () => {
  if (window.grecaptcha) {
    window.grecaptcha.ready(() => {
      console.log("grecaptcha is available");
    });
  }
};

export default testGrecaptcha;