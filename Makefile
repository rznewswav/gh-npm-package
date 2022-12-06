packageName := $(shell npm pkg get name | xargs echo)
localPackageName := "$(packageName)-local"

build:
	mkdir -p out
	npm ci
	npm run build -- --outDir out
	cp package*.json out

local: build
	cd out && \
	npm pkg set name="$(localPackageName)" && \
	npm link && \
	echo ":: Linked $(localPackageName). Run \`npm link $(localPackageName)\` in another local project."

publish:
	./repo-publish