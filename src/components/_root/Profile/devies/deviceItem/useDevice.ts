import { useSocket } from "@/hooks/useSocket";
import { UserService } from "@/services/user.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { IToken } from "@/shared/types/token.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useDevice = (tokenId: string) => {
  const queryClient = useQueryClient();
  const { handleDeleteDevice, handleSayHello } = useSocket();

  const { mutate: deleteDevice, isPending: isDeletingToken } = useMutation({
    mutationKey: ["delete device"],
    mutationFn: () => UserService.deleteToken(tokenId),
    onSuccess: () => {
      handleDeleteDevice(tokenId);
    },
    onMutate: () => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_MY_TOKENS],
        (oldTokens: IToken[]) => oldTokens.filter((t) => t._id !== tokenId)
      );
    },
  });

  return useMemo(
    () => ({
      deleteDevice,
      isDeletingToken,
      handleSendHello: () => handleSayHello(tokenId),
    }),
    [deleteDevice, isDeletingToken]
  );
};
