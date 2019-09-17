const helpers = {
  getState: (pathname) => {
    switch (pathname) {
      case "/manage": {
        return "manage"
      }
      default: {
        return "times"
      }
    }
  }
};

export default helpers