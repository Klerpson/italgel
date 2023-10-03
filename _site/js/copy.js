function copiarUrl(){
  let url = document.getElementById('mensaje');
  let button = document.getElementById('copiar');

  navigator.clipboard.writeText(url.textContent);
  button.textContent = 'Copiado';
}