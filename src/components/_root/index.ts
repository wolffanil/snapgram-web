import { lazy } from "react";

const Home = lazy(() => import("./Home/Home"));
const CreatePost = lazy(() => import("./CreatePost/CreatePost"));
const UpdatePost = lazy(() => import("./UpdatePost/UpdatePost"));
const Post = lazy(() => import("./Post/Post"));

export { Home, CreatePost, UpdatePost, Post };
