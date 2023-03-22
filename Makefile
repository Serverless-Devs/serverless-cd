clear:
	cd src/admin && rm -rf ./prisma/dev.db-journal ./prisma/migrations node_modules public/.ice

# 安装依赖
install: clear
	cd src/admin && npm install --registry=https://registry.npmmirror.com
	cd src/admin/public && npm install --registry=https://registry.npmmirror.com

# 启动 ui
ui-start:
	cd src/admin/public && npm run start
	
# 默认启动 sqlite
start: sqlite-start

# 启动 admin sqlite
sqlite-start:
	cd src/admin && npm run sqlite-start

# 启动 admin mysql
mysql-start:
	cd src/admin && npm run mysql-start

# 启动 admin mysql
mongodb-start:
	cd src/admin && npm run mongodb-start

# 发布版本步骤：
#  先安装依赖
#  执行前端项目的 build【init 之后部署的优化，减少第一次部署的时间】
#  将上次缓存的 dev.db 文件删除，重新生成 db 文件【为了 init 之后的 sqlite 能给正常启动并且和表一直是最新的】
#  发布 cd 的应用版本
publish: install
	cd src/admin/public && npm run build
	cd src/admin && rm -rf ./prisma/dev.db && export DATABASE_URL="file:dev.db" && npx prisma migrate dev --name init --schema=./prisma/sqlite.prisma && rm -rf ./prisma/migrations
	s cli registry publish