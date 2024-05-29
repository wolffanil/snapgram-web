import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "./useProfile";
import { Loader } from "lucide-react";
import { getMedia } from "../../../utils";
import StatBlock from "./StackBlock";
import { GridPostList } from "../../ui";
import LikedPosts from "./likedPosts/LikedPosts";

function Profile() {
  const { user: currentUser } = useAuth();
  const { pathname } = useLocation();

  const { user, isLoadingUser } = useProfile();

  if (isLoadingUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (!user || !currentUser)
    return (
      <div className="flex-center w-full h-full text-main-color text-[26px]">
        Нету пользователя
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              getMedia(user?.imageUrl) ||
              "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full text-main-color">
                {user?.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                {user?.nick ? "@" + user.nick : ""}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={user.posts.length} label="Посты" />
              {/* <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" /> */}
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm text-main-color">
              {user?.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {currentUser._id === user._id ? (
              <div className={`${user._id !== currentUser._id && "hidden"}`}>
                <Link
                  to={`/update-profile`}
                  className={`h-12 bg-third-color px-5  flex-center gap-2 rounded-lg ${
                    user._id !== currentUser._id && "hidden"
                  }`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={20}
                    height={20}
                  />
                  <p className="flex whitespace-nowrap small-medium text-main-color">
                    Редактировать профиль
                  </p>
                </Link>
              </div>
            ) : (
              <button className="h-[37px] blue-color text-white text-[14px] px-[42px]  flex-center gap-2 rounded-lg">
                Написать сообщение
              </button>
            )}
            {/* <div className={`${user.id === id && "hidden"}`}>
            <Button type="button" className="shad-button_primary px-8">
              Follow
            </Button>
          </div> */}
          </div>
        </div>
      </div>

      {currentUser._id === user._id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${user._id}`}
            className={`profile-tab border-main-color bg-main-color border rounded-l-lg text-main-color  ${
              pathname === `/profile/${user._id}` &&
              "bg-third-color border-[0px]"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Посты
          </Link>
          <Link
            to={`/profile/${user._id}/liked-posts`}
            className={`profile-tab border-main-color bg-main-color border rounded-r-lg text-main-color ${
              pathname === `/profile/${user._id}/liked-posts` &&
              "bg-third-color border-[0px]"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Лайки
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={
            <ul className="grid-container">
              <GridPostList posts={user.posts} />
            </ul>
          }
        />
        {currentUser._id === user._id && (
          <Route path="liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
}

export default Profile;
