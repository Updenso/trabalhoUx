import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";

async function deleteAgendamento(id) {
    const confirmResult = await Swal.fire({
        title: "Excluir Agendamento?",
        text: "Essa ação não poderá ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar"
    });

    if (!confirmResult.isConfirmed) {
        return false; // Usuário cancelou
    }

    try {
        const response = await fetch(`/api/agendamentos/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
            showSuccessAlert(result.message || "Agendamento excluído com sucesso!");
            return true;
        } else {
            showErrorAlert(result.message || "Erro ao excluir agendamento.");
            console.error("Erro ao excluir agendamento:", result.message);
            return false;
        }

    } catch (error) {
        console.error("Erro na requisição de exclusão:", error);
        showErrorAlert("Erro ao conectar com o servidor. Tente novamente.");
        return false;
    }
}

export { deleteAgendamento };
