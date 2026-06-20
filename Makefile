# Define the starting port number
START_PORT=3000

# Get the list of first-level subdirectories in the /apps directory
APPS=$(shell find apps -mindepth 1 -maxdepth 1 -type d)
APPS_INDEXES = $(shell for x in {1..$(words $(APPS))}; do echo $$x; done)

# Directory for the Vue app to be orchestrated
ORCHESTRATOR_DIR=./ui-orchestrator

define run-app-dev
run-$(notdir $(1)):
	cd $(1); \
	pnpm install; \
	PORT=$(shell echo $$(( $(START_PORT) + $(2) + 1 ))) BROWSER=none pnpm start --port $(shell echo $$(( $(START_PORT) + $(2) + 1 ))) &
endef

# Generate the run targets for each app
$(foreach index,$(APPS_INDEXES),$(eval $(call run-app-dev, $(word $(index), $(APPS)), $(index))))

# Target to run all apps including the orchestrator
.PHONY: run-all run-orchestrator $(patsubst %,run-%, $(notdir $(APPS)))

run-dev:
	@$(MAKE) -j $(patsubst %,run-%, $(notdir $(APPS)))
	@wait
	@$(MAKE) run-orchestrator-dev
	@wait


run-orchestrator-dev:
	cd $(ORCHESTRATOR_DIR) && \
	pnpm install && \
	pnpm run dev
