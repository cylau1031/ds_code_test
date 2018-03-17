window.onload = () => {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', evt => {
    evt.preventDefault();
    window.axios.post('/newMessage', {
      message: 'Where is the world is Carmen San Diego?'
    })
    .then(res => console.log(res))
  });
};
