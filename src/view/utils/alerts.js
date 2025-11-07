
export function showSuccessAlert(message = "Operação realizada com sucesso!") {
  Swal.fire({
    title: "Sucesso!",
    text: message,
    icon: "success",
    draggable: true
  });
}

export function showErrorAlert(message = "Algo deu errado, tente novamente!") {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    footer: '<a href="#">Precisa de ajuda?</a>'
  });
}

