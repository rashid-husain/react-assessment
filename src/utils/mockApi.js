export const submitPollData = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Poll submitted successfully!', data);
        resolve({ success: true });
      }, 1000);
    });
  };
  