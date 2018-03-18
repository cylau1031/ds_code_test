window.onload = () => {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', evt => {
    evt.preventDefault();
    window.axios.post('/formSubmission', {
      formData: {
        name: evt.target.name.value,
        birthday: evt.target.birthday.value,
        email: evt.target.email.value,
        cell: evt.target.cell.value,
        password: evt.target.password.value,
      }
    })
    .then(res => {
      let resNode = null;
      if (document.getElementsByTagName('h2')[0]) {
        resNode = document.getElementsByTagName('h2')[0];
        resNode.innerHTML = `${res.data}`
      } else {
        resNode = document.createElement('h2');
        let textNode = document.createTextNode(res.data);
        resNode.appendChild(textNode);
        document.body.appendChild(resNode);
      }
    })
    .catch(err => console.log(err))
  });
};
