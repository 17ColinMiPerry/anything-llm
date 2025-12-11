import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const WorkspaceTemplate = {
    all: async function () {
        const templates = await fetch(`${API_BASE}/experimental/templates`, {
            method: "GET",
            headers: baseHeaders(),
        })
            .then((res) => res.json())
            .then((res) => res.templates || [])
            .catch(() => []);
        return templates;
    },

    create: async function (data = {}) {
        const { template, message } = await fetch(
            `${API_BASE}/experimental/templates/new`,
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: baseHeaders(),
            }
        )
            .then((res) => res.json())
            .catch((e) => {
                return { template: null, message: e.message };
            });
        return { template, message };
    },

    delete: async function (slug) {
        const result = await fetch(
            `${API_BASE}/experimental/templates/${slug}`,
            {
                method: "DELETE",
                headers: baseHeaders(),
            }
        )
            .then((res) => res.ok)
            .catch((e) => {
                console.error(e);
                return false;
            });
        return result;
    },
};

export default WorkspaceTemplate;
