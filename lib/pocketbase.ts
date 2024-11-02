import PocketBase from 'pocketbase';

// PocketBaseのレコード型定義
export interface BookRecord {
    id: string;
    created: string;
    updated: string;
    title: string;
    author: string;
    cover_image?: string;
    description?: string;
    pdf_path?: string;
    collectionId: string;
    collectionName: string;
}

export interface LikeRecord {
    id: string;
    created: string;
    updated: string;
    user_id: string;
    book_id: string;
}

// PocketBaseのユーザー型定義
export interface User {
    id: string;
    created: string;
    updated: string;
    email: string;
    name?: string;
    avatar?: string;
}

// 環境変数からURLを取得
const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

if (!pocketbaseUrl) {
    throw new Error('NEXT_PUBLIC_POCKETBASE_URL is not defined');
}

// PocketBaseクライアントのインスタンス作成
const pb = new PocketBase(pocketbaseUrl);

// 自動キャンセルを無効化
pb.autoCancellation(false);

export default pb; 