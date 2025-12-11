import React, { useState } from "react";
import WorkspaceTemplate from "@/models/workspaceTemplate";
import showToast from "@/utils/toast";

export default function SaveAsTemplate({ workspace }) {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedResources, setSelectedResources] = useState([]);

    // Filter out invalid docs if any
    const documents = (workspace?.documents || []).filter(d => d.docpath);

    const handleResourceToggle = (docpath) => {
        if (selectedResources.includes(docpath)) {
            setSelectedResources(selectedResources.filter(p => p !== docpath));
        } else {
            setSelectedResources([...selectedResources, docpath]);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { template, message } = await WorkspaceTemplate.create({
            name,
            description,
            workspaceSlug: workspace.slug,
            resources: selectedResources
        });
        setLoading(false);

        if (template) {
            showToast("Template created successfully!", "success", { clear: true });
            setShowModal(false);
            setName("");
            setDescription("");
            setSelectedResources([]);
        } else {
            showToast(`Error: ${message}`, "error", { clear: true });
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-y-2">
                <h2 className="text-white text-lg font-semibold">Workspace Templates</h2>
                <p className="text-white/60 text-sm">
                    Save this workspace's configuration as a template for future use.
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    type="button"
                    className="max-w-[200px] bg-theme-bg-secondary border border-theme-modal-border text-white hover:bg-theme-modal-border rounded-lg py-2 transition-all duration-300"
                >
                    Save as Template
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-theme-bg-secondary w-full max-w-lg rounded-lg border border-theme-modal-border p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Save as Template
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Template Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-theme-settings-input-bg border-none text-white rounded-lg p-2.5 focus:outline-primary-button"
                                    placeholder="My Template"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-theme-settings-input-bg border-none text-white rounded-lg p-2.5 focus:outline-primary-button"
                                    placeholder="Optional description"
                                />
                            </div>

                            {documents.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Include Documents
                                        <span className="text-white/50 text-xs ml-2 font-normal">
                                            ({selectedResources.length} selected)
                                        </span>
                                    </label>
                                    <div className="max-h-40 overflow-y-auto bg-theme-bg-primary rounded-lg p-2 space-y-2 border border-theme-border">
                                        {documents.map((doc) => (
                                            <div key={doc.docpath} className="flex items-start gap-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`doc-${doc.id}`}
                                                    checked={selectedResources.includes(doc.docpath)}
                                                    onChange={() => handleResourceToggle(doc.docpath)}
                                                    className="mt-1 rounded bg-theme-settings-input-bg border-theme-border text-primary-button focus:ring-primary-button"
                                                />
                                                <label htmlFor={`doc-${doc.id}`} className="text-sm text-white break-all cursor-pointer">
                                                    {doc.filename || doc.docpath}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-white/50 mt-1">
                                        Selected documents will be automatically imported into new workspaces created from this template.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="text-white hover:text-white/70 px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-80 transition-all font-medium"
                                >
                                    {loading ? "Saving..." : "Save Template"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
