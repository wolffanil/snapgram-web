import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";
import { useSocket } from "@/hooks/useSocket";
import { MessageService } from "@/services/message.service";
import { PostService } from "@/services/post.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { IChat } from "@/shared/types/chat.interface";
import { IMessage, ISendMessage } from "@/shared/types/message.interface";
import { IInfinityPosts, IPost } from "@/shared/types/post.interface";
import { IUser } from "@/shared/types/user.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "mutative";
import { Dispatch, SetStateAction, useMemo } from "react";

export const useRepost = (
  setRepostText: Dispatch<SetStateAction<string>>,
  chatRepost: IChat,
  post: IPost
) => {
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { sendMessageToSocket } = useSocket();

  const { mutate: updateCountRepost } = useMutation({
    mutationKey: ["update count repost"],
    mutationFn: () => PostService.updateCountRepost(post._id),
  });

  const { createNotification } = useNotification();

  const {
    mutateAsync: sendRepost,
    isPending: isSendingRepost,
    isSuccess: isSendedRepost,
  } = useMutation({
    mutationKey: ["send message"],
    mutationFn: (data: ISendMessage) => MessageService.create(data),
    onMutate: (data: ISendMessage) => {
      const oldMessages: IMessage[] =
        queryClient.getQueryData([
          QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID,
          data.chat,
        ]) || [];

      const date = new Date();

      date.toISOString();

      const idMessage = String(Date.now());

      const newMessage: IMessage = {
        _id: idMessage,
        ...data,
        post: {
          _id: post._id,
          creator: {
            name: post.creator.name,
            imageUrl: post.creator.imageUrl,
            _id: post.creator._id,
          },
          imageUrl: post.imageUrl,
          caption: post.caption,
          location: post.location,
          createdAt: post.createdAt,
        },
        sender: {
          ...user,
        } as IUser,
        createdAt: String(date),
        isRead: false,
        status: "pending",
      } as IMessage & { status: string };

      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, newMessage.chat],
        (oldMessages: IMessage[]) => {
          if (!oldMessages?.length) return undefined;

          return [...oldMessages, { ...newMessage }];
        }
      );

      return { oldMessages, idMessage };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatRepost._id],
        context
      );
    },
    onSuccess: (message: IMessage, variables, context) => {
      setRepostText("");

      updateCountRepost();

      queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_BY_ID, post._id],
        (oldPost: IPost) => {
          if (!oldPost?._id) return undefined;

          return {
            ...oldPost,
            countRepost: oldPost.countRepost + 1,
          } as IPost;
        }
      );

      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, message.chat],
        (oldMessage: IMessage[]) => {
          if (!oldMessage?.length) return undefined;

          return oldMessage?.map((currentMessage) =>
            currentMessage._id === context.idMessage
              ? { ...currentMessage, _id: message._id, status: "ready" }
              : currentMessage
          );
        }
      );

      queryClient.setQueryData(
        [QUERY_KEYS.GET_INFINITE_POSTS],
        (oldData: IInfinityPosts) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((currentPost) =>
                currentPost._id === post._id
                  ? { ...currentPost, countRepost: currentPost.countRepost + 1 }
                  : currentPost
              ),
            })),
          };
        }
      );

      queryClient.setQueryData([QUERY_KEYS.GET_MY_CHATS], (chats: IChat[]) => {
        return create(chats, (draft) => {
          draft.forEach((chat, index) => {
            if (chat._id === chatRepost._id) {
              chat.latestMessage = chat.latestMessage || {};
              chat.latestMessage.type = "repost";

              chat.latestMessage.isRead = false;

              const [targetChat] = draft.splice(index, 1);
              draft.unshift(targetChat);
            }
          });
        });
      });

      if (post.creator._id === user?._id) return;

      //@ts-ignore
      createNotification({
        to: post.creator._id,
        type: "repost",
        postId: post,
      });
    },
  });

  const handleSendRepost = async (repostText: string) => {
    const newMessageData: IMessage = {
      chat: chatRepost._id,
      createdAt: new Date().toISOString(),
      sender: {
        ...user,
      },
      repostText: repostText ? repostText.slice(0, 100) : undefined,
      post: {
        _id: post._id,
        caption: post.caption,
        creator: post.creator,
        imageUrl: post.imageUrl,
        location: post.location,
      },
      type: "repost",
    } as IMessage;

    // sendMessageToSocket(newMessageData, chatRepost);
    const newMessage = await sendRepost({
      chat: newMessageData.chat,
      type: "repost",
      post: newMessageData.post?._id,
      repostText: newMessageData.repostText,
    });

    sendMessageToSocket(
      {
        ...newMessage,
        post: {
          _id: post._id,
          caption: post.caption,
          creator: post.creator,
          imageUrl: post.imageUrl,
          location: post.location,
          createdAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        sender: {
          ...user,
        } as IUser,
      },
      chatRepost
    );
  };

  return useMemo(
    () => ({ handleSendRepost, isSendingRepost, isSendedRepost }),
    [handleSendRepost, isSendedRepost, isSendingRepost]
  );
};
