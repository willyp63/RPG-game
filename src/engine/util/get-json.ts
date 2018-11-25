export default (url: string) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        throw new Error(`Error fetching JSON from: ${url}`);
      }
    };
    xhr.send();
  });
};
