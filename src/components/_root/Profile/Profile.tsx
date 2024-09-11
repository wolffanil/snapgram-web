import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useProfile } from "./useProfile";
import { Loader } from "lucide-react";
import StatBlock from "./StackBlock";
import { GridPostList, Modal, WrapperModal } from "../../ui";
import LikedPosts from "./likedPosts/LikedPosts";
import Devices from "./devies/Deviсes";
import { useAuth } from "@/hooks/useAuth";
import { useCreateChat } from "@/hooks/useCreateChat";
import { cn, getDefaultImageProfile, getMedia } from "@/utils";
import Subscribers from "./subscribe/Subscribers";
import ButtonSubscribe from "./subscribe/buttonSubscribe/ButtonSubscribe";

function Profile() {
  const { user: currentUser } = useAuth();
  const { pathname } = useLocation();

  const { user, isLoadingUser } = useProfile();

  const { handleCreateChat, isCreatingChat } = useCreateChat(
    user?._id || "",
    user?.name || ""
  );

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
            onError={(e) => (e.target.src = getDefaultImageProfile)}
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

            <div className="flex gap-x-10 mt-10 items-center justify-center xl:justify-start flex-wrap z-20 max-sm:!gap-x-[13px]">
              <StatBlock value={user.posts.length} label="Посты" />
              <Subscribers />
            </div>

            <p className="small-medium md:base-medium text-start xl:text-left mt-7 max-w-screen-sm text-main-color max-sm:w-[320px] text-wrap">
              {user?.bio}
            </p>
          </div>

          <div
            className={cn("flex justify-center gap-4 max-sm:flex-col", {
              "lg:flex-col": currentUser._id === user._id,
            })}
          >
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

                <Modal>
                  <Modal.Open opens="devices">
                    <button className="blue-color flex text-white small-medium  h-12 justify-center items-center w-[234px] rounded-lg mt-[20px] gap-x-[8px]">
                      <img src="/assets/icons/devices.svg" alt="devices" />
                      устройства
                    </button>
                  </Modal.Open>

                  <Modal.Window name="devices">
                    <WrapperModal
                      title="Активные устройства"
                      containerStyle="w-[600px]"
                    >
                      <Devices />
                    </WrapperModal>
                  </Modal.Window>
                </Modal>
              </div>
            ) : (
              <>
                <ButtonSubscribe />
                <button
                  className="h-[37px] blue-color text-white text-[14px] px-[42px]  flex-center gap-2 rounded-lg"
                  onClick={handleCreateChat}
                  disabled={isCreatingChat}
                >
                  Написать сообщение
                </button>
              </>
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
