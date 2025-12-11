const { reqBody, userFromSession } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
<<<<<<< HEAD
    flexUserRoleValid,
    ROLES,
=======
  flexUserRoleValid,
  ROLES,
>>>>>>> 0ba66ae0 (workspace template mockup)
} = require("../utils/middleware/multiUserProtected");
const { WorkspaceTemplate } = require("../models/workspaceTemplate");
const { Workspace } = require("../models/workspace");

function workspaceTemplateEndpoints(app) {
<<<<<<< HEAD
    if (!app) return;

    app.get(
        "/experimental/templates",
        [validatedRequest, flexUserRoleValid([ROLES.all])],
        async (request, response) => {
            try {
                const templates = await WorkspaceTemplate.where({});
                response.status(200).json({ templates });
            } catch (e) {
                console.error(e.message, e);
                response.sendStatus(500).end();
            }
        }
    );

    app.post(
        "/experimental/templates/new",
        [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
        async (request, response) => {
            try {
                const user = await userFromSession(request, response);
                const { name, description, workspaceSlug, resources = [] } = reqBody(request);

                if (!workspaceSlug) {
                    response.status(400).json({ message: "Workspace slug is required" });
                    return;
                }

                const workspace = await Workspace.get({ slug: workspaceSlug });
                if (!workspace) {
                    response.status(404).json({ message: "Workspace not found" });
                    return;
                }

                const config = {
                    openAiTemp: workspace.openAiTemp,
                    openAiHistory: workspace.openAiHistory,
                    openAiPrompt: workspace.openAiPrompt,
                    similarityThreshold: workspace.similarityThreshold,
                    chatProvider: workspace.chatProvider,
                    chatModel: workspace.chatModel,
                    topN: workspace.topN,
                    chatMode: workspace.chatMode,
                    agentProvider: workspace.agentProvider,
                    agentModel: workspace.agentModel,
                    queryRefusalResponse: workspace.queryRefusalResponse,
                    vectorSearchMode: workspace.vectorSearchMode,
                };

                const { template, message } = await WorkspaceTemplate.create({
                    name,
                    description,
                    config,
                    resources,
                    createdBy: user?.id,
                });

                if (!template) {
                    response.status(500).json({ message });
                    return;
                }

                response.status(200).json({ template });
            } catch (e) {
                console.error(e.message, e);
                response.sendStatus(500).end();
            }
        }
    );

    app.post(
        "/experimental/templates/:slug/update",
        [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
        async (request, response) => {
            try {
                const { slug } = request.params;
                const { name, description } = reqBody(request);
                const template = await WorkspaceTemplate.get({ slug });

                if (!template) {
                    response.sendStatus(404).end();
                    return;
                }

                const { template: updated, message } = await WorkspaceTemplate.update(template.id, {
                    name,
                    description,
                });

                if (!updated) {
                    response.status(500).json({ message });
                    return;
                }

                response.status(200).json({ template: updated });
            } catch (e) {
                console.error(e.message, e);
                response.sendStatus(500).end();
            }
        }
    );

    app.delete(
        "/experimental/templates/:slug",
        [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
        async (request, response) => {
            try {
                const { slug } = request.params;
                const success = await WorkspaceTemplate.delete({ slug });
                if (!success) {
                    response.status(404).json({ message: "Template not found or could not be deleted" });
                    return;
                }
                response.sendStatus(200).end();
            } catch (e) {
                console.error(e.message, e);
                response.sendStatus(500).end();
            }
        }
    );
=======
  if (!app) return;

  app.get(
    "/experimental/templates",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const templates = await WorkspaceTemplate.where({});
        response.status(200).json({ templates });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/experimental/templates/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const {
          name,
          description,
          workspaceSlug,
          resources = [],
        } = reqBody(request);

        if (!workspaceSlug) {
          response.status(400).json({ message: "Workspace slug is required" });
          return;
        }

        const workspace = await Workspace.get({ slug: workspaceSlug });
        if (!workspace) {
          response.status(404).json({ message: "Workspace not found" });
          return;
        }

        const config = {
          openAiTemp: workspace.openAiTemp,
          openAiHistory: workspace.openAiHistory,
          openAiPrompt: workspace.openAiPrompt,
          similarityThreshold: workspace.similarityThreshold,
          chatProvider: workspace.chatProvider,
          chatModel: workspace.chatModel,
          topN: workspace.topN,
          chatMode: workspace.chatMode,
          agentProvider: workspace.agentProvider,
          agentModel: workspace.agentModel,
          queryRefusalResponse: workspace.queryRefusalResponse,
          vectorSearchMode: workspace.vectorSearchMode,
        };

        const { template, message } = await WorkspaceTemplate.create({
          name,
          description,
          config,
          resources,
          createdBy: user?.id,
        });

        if (!template) {
          response.status(500).json({ message });
          return;
        }

        response.status(200).json({ template });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/experimental/templates/:slug/update",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { slug } = request.params;
        const { name, description } = reqBody(request);
        const template = await WorkspaceTemplate.get({ slug });

        if (!template) {
          response.sendStatus(404).end();
          return;
        }

        const { template: updated, message } = await WorkspaceTemplate.update(
          template.id,
          {
            name,
            description,
          }
        );

        if (!updated) {
          response.status(500).json({ message });
          return;
        }

        response.status(200).json({ template: updated });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/experimental/templates/:slug",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { slug } = request.params;
        const success = await WorkspaceTemplate.delete({ slug });
        if (!success) {
          response
            .status(404)
            .json({ message: "Template not found or could not be deleted" });
          return;
        }
        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
>>>>>>> 0ba66ae0 (workspace template mockup)
}

module.exports = { workspaceTemplateEndpoints };
