# ベースイメージとしてNode.jsを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# アプリケーションユーザーを作成
# RUN addgroup --system --gid 1001 nodejs && \
#     adduser --system --uid 1001 nextjs && \
#     mkdir -p /app/public/uploads/books /app/public/uploads/covers && \
#     chown -R nextjs:nodejs /app
RUN mkdir -p /app/public/uploads/books /app/public/uploads/covers

# 依存関係ファイルをコピー
#COPY --chown=nextjs:nodejs package*.json ./
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
#COPY --chown=nextjs:nodejs . .
COPY . .

# ユーザーを切り替え
#USER nextjs

# 警告を抑制する環境変数を設定
ENV NODE_NO_WARNINGS=1
ENV PORT=3000
ENV NODE_ENV=production

# アプリケーションをビルド
RUN npm run build

# アプリケーションの起動
CMD ["npm", "start"]
