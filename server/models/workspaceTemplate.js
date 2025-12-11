const prisma = require("../utils/prisma");
const slugifyModule = require("slugify");

const WorkspaceTemplate = {
<<<<<<< HEAD
    /**
     * @param  {...any} args - slugify args for npm package.
     * @returns {string}
     */
    slugify: function (...args) {
        slugifyModule.extend({
            "+": " plus ",
            "!": " bang ",
            "@": " at ",
            "*": " splat ",
            ".": " dot ",
            ":": "",
            "~": "",
            "(": "",
            ")": "",
            "'": "",
            '"': "",
            "|": "",
        });
        return slugifyModule(...args);
    },

    create: async function (data = {}) {
        try {
            const { name, description, config, resources, createdBy } = data;
            if (!name) throw new Error("Template name is required");
            if (!config) throw new Error("Template configuration is required");

            let slug = this.slugify(name, { lower: true });
            const existing = await this.get({ slug });
            if (existing) {
                const slugSeed = Math.floor(10000000 + Math.random() * 90000000);
                slug = this.slugify(`${name}-${slugSeed}`, { lower: true });
            }

            const template = await prisma.workspace_templates.create({
                data: {
                    name,
                    slug,
                    description,
                    config: JSON.stringify(config),
                    resources: resources ? JSON.stringify(resources) : null,
                    createdBy: createdBy || 0,
                },
            });
            return { template, message: null };
        } catch (error) {
            console.error("Failed to create workspace template:", error.message);
            return { template: null, message: error.message };
        }
    },

    update: async function (id, data = {}) {
        try {
            const { name, description, resources } = data;
            const updates = {};
            if (name) updates.name = name;
            // If name changes, we probably should NOT change slug to preserve links/references?
            // Usually re-slugging is dangerous. Let's keep slug stable.

            if (description !== undefined) updates.description = description;
            if (resources !== undefined) updates.resources = JSON.stringify(resources);

            const template = await prisma.workspace_templates.update({
                where: { id },
                data: updates,
            });
            return { template, message: null };
        } catch (error) {
            console.error(error.message);
            return { template: null, message: error.message };
        }
    },

    get: async function (clause = {}) {
        try {
            const template = await prisma.workspace_templates.findFirst({
                where: clause,
            });
            if (!template) return null;

            return {
                ...template,
                parsedConfig: JSON.parse(template.config),
                resources: template.resources ? JSON.parse(template.resources) : [],
            };
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },

    where: async function (clause = {}, limit = null, orderBy = null) {
        try {
            const results = await prisma.workspace_templates.findMany({
                where: clause,
                ...(limit !== null ? { take: limit } : {}),
                ...(orderBy !== null ? { orderBy } : {}),
            });
            return results.map(t => ({
                ...t,
                parsedConfig: JSON.parse(t.config),
                resources: t.resources ? JSON.parse(t.resources) : []
            }));
        } catch (error) {
            console.error(error.message);
            return [];
        }
    },

    delete: async function (clause = {}) {
        try {
            await prisma.workspace_templates.delete({
                where: clause,
            });
            return true;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    },
=======
  /**
   * @param  {...any} args - slugify args for npm package.
   * @returns {string}
   */
  slugify: function (...args) {
    slugifyModule.extend({
      "+": " plus ",
      "!": " bang ",
      "@": " at ",
      "*": " splat ",
      ".": " dot ",
      ":": "",
      "~": "",
      "(": "",
      ")": "",
      "'": "",
      '"': "",
      "|": "",
    });
    return slugifyModule(...args);
  },

  create: async function (data = {}) {
    try {
      const { name, description, config, resources, createdBy } = data;
      if (!name) throw new Error("Template name is required");
      if (!config) throw new Error("Template configuration is required");

      let slug = this.slugify(name, { lower: true });
      const existing = await this.get({ slug });
      if (existing) {
        const slugSeed = Math.floor(10000000 + Math.random() * 90000000);
        slug = this.slugify(`${name}-${slugSeed}`, { lower: true });
      }

      const template = await prisma.workspace_templates.create({
        data: {
          name,
          slug,
          description,
          config: JSON.stringify(config),
          resources: resources ? JSON.stringify(resources) : null,
          createdBy: createdBy || 0,
        },
      });
      return { template, message: null };
    } catch (error) {
      console.error("Failed to create workspace template:", error.message);
      return { template: null, message: error.message };
    }
  },

  update: async function (id, data = {}) {
    try {
      const { name, description, resources } = data;
      const updates = {};
      if (name) updates.name = name;
      // If name changes, we probably should NOT change slug to preserve links/references?
      // Usually re-slugging is dangerous. Let's keep slug stable.

      if (description !== undefined) updates.description = description;
      if (resources !== undefined)
        updates.resources = JSON.stringify(resources);

      const template = await prisma.workspace_templates.update({
        where: { id },
        data: updates,
      });
      return { template, message: null };
    } catch (error) {
      console.error(error.message);
      return { template: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const template = await prisma.workspace_templates.findFirst({
        where: clause,
      });
      if (!template) return null;

      return {
        ...template,
        parsedConfig: JSON.parse(template.config),
        resources: template.resources ? JSON.parse(template.resources) : [],
      };
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspace_templates.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results.map((t) => ({
        ...t,
        parsedConfig: JSON.parse(t.config),
        resources: t.resources ? JSON.parse(t.resources) : [],
      }));
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspace_templates.delete({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },
>>>>>>> 0ba66ae0 (workspace template mockup)
};

module.exports = { WorkspaceTemplate };
