window.onload = () => {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', evt => {
    evt.preventDefault();
    window.axios.post('/newMessage', {
      message: {
        name: evt.target.name.value,
        birthday: evt.target.birthday.value,
        email: evt.target.email.value,
        cell: evt.target.cell.value,
        password: evt.target.password.value,
      }
    })
    .then(res => console.log(res))
  });
};
