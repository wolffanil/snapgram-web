import { lazy } from "react";

const Home = lazy(() => import("./Home/Home"));
const CreatePost = lazy(() => import("./CreatePost/CreatePost"));
const UpdatePost = lazy(() => import("./UpdatePost/UpdatePost"));
const Post = lazy(() => import("./Post/Post"));
const Saved = lazy(() => import("./Saved/Saved"));
const Profile = lazy(() => import("./Profile/Profile"));

export { Home, CreatePost, UpdatePost, Post, Saved, Profile };
