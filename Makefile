
dist:
	npm install --verbose --no-optional --registry=https://registry.npm.taobao.org && \
	npm run build

.PHONY: test build dist start example