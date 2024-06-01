import { lazy } from "react";

const Home = lazy(() => import("./Home/Home"));
const CreatePost = lazy(() => import("./CreatePost/CreatePost"));
const UpdatePost = lazy(() => import("./UpdatePost/UpdatePost"));
const Post = lazy(() => import("./Post/Post"));
const Saved = lazy(() => import("./Saved/Saved"));
const Profile = lazy(() => import("./Profile/Profile"));
const UpdateProfile = lazy(() => import("./UpdateProfile/UpdateProfile"));
const SearchUsers = lazy(() => import("./SearchUser/SearchUser"));
const Explore = lazy(() => import("./Explore/Explore"));
const Chat = lazy(() => import("./Chat/Chat"));

export {
  Home,
  CreatePost,
  UpdatePost,
  Post,
  Saved,
  Profile,
  UpdateProfile,
  SearchUsers,
  Explore,
  Chat,
};
