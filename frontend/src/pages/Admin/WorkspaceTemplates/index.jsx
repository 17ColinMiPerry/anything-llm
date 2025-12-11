import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Trash, PencilSimple } from "@phosphor-icons/react";
import WorkspaceTemplate from "@/models/workspaceTemplate";
import ModalWrapper from "@/components/ModalWrapper";
import showToast from "@/utils/toast";

export default function AdminWorkspaceTemplates() {
<<<<<<< HEAD
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);

    const fetchTemplates = async () => {
        const _templates = await WorkspaceTemplate.all();
        setTemplates(_templates);
        setLoading(false);
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDelete = async (slug) => {
        if (!window.confirm("Are you sure you want to delete this template?")) return;
        const success = await WorkspaceTemplate.delete(slug);
        if (success) {
            showToast("Template deleted successfully", "success");
            setTemplates(templates.filter((t) => t.slug !== slug));
        } else {
            showToast("Failed to delete template", "error");
        }
    };

    return (
        <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
            <Sidebar />
            <div
                style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
                className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
            >
                <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
                    <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
                        <div className="items-center flex gap-x-4">
                            <p className="text-lg leading-6 font-bold text-theme-text-primary">
                                Workspace Templates
                            </p>
                        </div>
                        <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
                            Manage workspace templates. These templates can be used to quickly
                            create new workspaces with pre-defined settings and documents.
                        </p>
                    </div>

                    <div className="overflow-x-auto mt-6">
                        {loading ? (
                            <Skeleton.default count={3} height={40} />
                        ) : (
                            <table className="w-full text-xs text-left rounded-lg min-w-[640px] border-spacing-0">
                                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 rounded-tl-lg">Name</th>
                                        <th scope="col" className="px-6 py-3">Description</th>
                                        <th scope="col" className="px-6 py-3">Created By</th>
                                        <th scope="col" className="px-6 py-3">Resources</th>
                                        <th scope="col" className="px-6 py-3 rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templates.map((template) => (
                                        <TemplateRow
                                            key={template.id}
                                            template={template}
                                            onDelete={handleDelete}
                                            refresh={fetchTemplates}
                                        />
                                    ))}
                                    {templates.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-white/50">
                                                No templates found. Create one from a Workspace settings page.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TemplateRow({ template, onDelete, refresh }) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(template.name);
    const [description, setDescription] = useState(template.description || "");

    const handleUpdate = async () => {
        const { template: updated, message } = await WorkspaceTemplate.update(template.id, {
            name,
            description
        });
        if (updated) {
            showToast("Template updated", "success");
            setIsEditing(false);
            refresh();
        } else {
            showToast(`Failed to update: ${message}`, "error");
        }
    };

    return (
        <>
            <tr className="bg-transparent hover:bg-theme-bg-container transition-colors duration-200 border-b border-white/5 last:border-b-0">
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    {template.name}
                </td>
                <td className="px-6 py-4 text-theme-text-secondary">
                    {template.description}
                </td>
                <td className="px-6 py-4 text-theme-text-secondary">
                    {template?.createdBy}
                </td>
                <td className="px-6 py-4 text-theme-text-secondary">
                    {template.resources?.length || 0} files
                </td>
                <td className="px-6 py-4 flex gap-x-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-theme-text-secondary hover:text-white transition-colors"
                    >
                        <PencilSimple size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(template.slug)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                    >
                        <Trash size={18} />
                    </button>
                </td>
            </tr>

            {isEditing && (
                <ModalWrapper isOpen={true}>
                    <div className="w-full max-w-lg bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Edit Template</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-theme-settings-input-bg border-none text-white rounded-lg p-2.5 focus:outline-primary-button"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Description</label>
                                <input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-theme-settings-input-bg border-none text-white rounded-lg p-2.5 focus:outline-primary-button"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-x-2 mt-6">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-white hover:text-white/70 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-80"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </ModalWrapper>
            )}
        </>
    );
=======
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    const _templates = await WorkspaceTemplate.all();
    setTemplates(_templates);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;
    const success = await WorkspaceTemplate.delete(slug);
    if (success) {
      showToast("Template deleted successfully", "success");
      setTemplates(templates.filter((t) => t.slug !== slug));
    } else {
      showToast("Failed to delete template", "error");
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Workspace Templates
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              Manage workspace templates. These templates can be used to quickly
              create new workspaces with pre-defined settings and documents.
            </p>
          </div>

          <div className="overflow-x-auto mt-6">
            {loading ? (
              <Skeleton.default count={3} height={40} />
            ) : (
              <table className="w-full text-xs text-left rounded-lg min-w-[640px] border-spacing-0">
                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-tl-lg">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created By
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Resources
                    </th>
                    <th scope="col" className="px-6 py-3 rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <TemplateRow
                      key={template.id}
                      template={template}
                      onDelete={handleDelete}
                      refresh={fetchTemplates}
                    />
                  ))}
                  {templates.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-white/50"
                      >
                        No templates found. Create one from a Workspace settings
                        page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateRow({ template, onDelete, refresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description || "");

  const handleUpdate = async () => {
    const { template: updated, message } = await WorkspaceTemplate.update(
      template.id,
      {
        name,
        description,
      }
    );
    if (updated) {
      showToast("Template updated", "success");
      setIsEditing(false);
      refresh();
    } else {
      showToast(`Failed to update: ${message}`, "error");
    }
  };

  return (
    <>
      <tr className="bg-transparent hover:bg-theme-bg-container transition-colors duration-200 border-b border-white/5 last:border-b-0">
        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
          {template.name}
        </td>
        <td className="px-6 py-4 text-theme-text-secondary">
          {template.description}
        </td>
        <td className="px-6 py-4 text-theme-text-secondary">
          {template?.createdBy}
        </td>
        <td className="px-6 py-4 text-theme-text-secondary">
          {template.resources?.length || 0} files
        </td>
        <td className="px-6 py-4 flex gap-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-theme-text-secondary hover:text-white transition-colors"
          >
            <PencilSimple size={18} />
          </button>
          <button
            onClick={() => onDelete(template.slug)}
            className="text-red-400 hover:text-red-500 transition-colors"
          >
            <Trash size={18} />
          </button>
        </td>
      </tr>

      {isEditing && (
        <ModalWrapper isOpen={true}>
          <div className="w-full max-w-lg bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Edit Template
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-theme-settings-input-bg border-none text-white rounded-lg p-2.5 focus:outline-primary-button"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-theme-settings-input-bg border-none text-white rounded-lg p-2.5 focus:outline-primary-button"
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-2 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="text-white hover:text-white/70 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-80"
              >
                Save
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  );
>>>>>>> 0ba66ae0 (workspace template mockup)
}
