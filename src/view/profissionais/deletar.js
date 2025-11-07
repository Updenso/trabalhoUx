import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";

async function deleteProfissional(id) {
    try {
        const confirmar = await Swal.fire({
            title: "Confirmar exclusão?",
            text: "Você tem certeza que deseja excluir este profissional?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar"
        });

        if (!confirmar.isConfirmed) {
            return false;
        }

        const response = await fetch(`/api/profissionais/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
            await showSuccessAlert(result.message || "Profissional excluído com sucesso!");
            return true;
        } else {
            showErrorAlert(result.message || "Erro ao excluir profissional.");
            return false;
        }

    } catch (error) {
        console.error("Erro na requisição de exclusão:", error);
        showErrorAlert("Erro ao conectar com o servidor. Tente novamente.");
        return false;
    }
}

export { deleteProfissional };
