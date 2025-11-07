import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";

async function deletePatient(id) {
    const confirmResult = await Swal.fire({
        title: "Excluir Paciente?",
        text: "Essa ação não poderá ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar"
    });

    if (!confirmResult.isConfirmed) {
        return false; // Usuário cancelou
    }

    try {
        const response = await fetch(`/api/pacientes/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
            showSuccessAlert(result.message || "Paciente excluído com sucesso!");
            return true;
        } else {
            showErrorAlert(result.message || "Erro ao excluir paciente.");
            console.error("Erro ao excluir paciente:", result.message);
            return false;
        }

    } catch (error) {
        console.error("Erro ao excluir paciente:", error);
        showErrorAlert("Erro ao conectar com o servidor. Tente novamente.");
        return false;
    }
}

export { deletePatient };
