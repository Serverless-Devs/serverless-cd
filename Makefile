clear:
	cd src/admin && rm -rf ./prisma/dev.db-journal ./prisma/migrations node_modules public/.ice ./.tmp

# 安装依赖
install:
	cd src/admin && npm install --registry=https://registry.npmmirror.com
	cd src/admin/public && npm install --registry=https://registry.npmmirror.com

# 前后端一起启动示例：make sqlite-start ui-start -j2
# 启动 ui
ui-start:
	cd src/admin/public && npm run start
# 启动 admin(sqlite)
sqlite-start:
	cd src/admin && npx serverless-script start --file-path ../ --yaml s.local-run.sqlite.yaml
# 启动 admin(mysql)
mysql-start:
	cd src/admin && npx serverless-script start --file-path ../ --yaml s.local-run.mysql.yaml
# 启动 admin(mongodb)
mongodb-start:
	cd src/admin && npx serverless-script start --file-path ../ --yaml s.local-run.mongodb.yaml

# 发布版本步骤：
#  先安装依赖
#  执行前端项目的 build【init 之后部署的优化，减少第一次部署的时间】
#  将上次缓存的 dev.db 文件删除，重新生成 db 文件【为了 init 之后的 sqlite 能给正常启动并且和表一直是最新的】
#  发布 cd 的应用版本
publish: install
	cd src/admin/public && npm run build
	cd src/admin && rm -rf ./prisma/dev.db && export DATABASE_URL="file:dev.db" && npx prisma migrate dev --name init --schema=./prisma/sqlite.prisma && rm -rf ./prisma/migrations
	s cli registry publish

test:
	cd src/admin && npx jest __tests__/auth.test.js --watch
