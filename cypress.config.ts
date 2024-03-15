import { defineConfig } from "cypress";

export default defineConfig({
    projectId: "nr3ifd",
    chromeWebSecurity: false,
    e2e: {
        supportFile: "cypress/support/e2e.ts",
        baseUrl: "http://localhost:3000",
        setupNodeEvents(on, config) {
            require("@cypress/code-coverage/task")(on, config);
            return config;
        },
    },

    component: {
        supportFile: "cypress/support/component.tsx",
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
        setupNodeEvents(on, config) {
            require("@cypress/code-coverage/task")(on, config);
            return config;
        },
    },
});
