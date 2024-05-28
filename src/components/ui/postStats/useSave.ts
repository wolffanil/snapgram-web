import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { ISave } from "../../../shared/types/save.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaveService } from "../../../services/save.service";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";

export const useSave = (postId: string, saves: ISave[]) => {
  const { user } = useAuth();
  const [isSave, setIsSave] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: createSave, isPending: isCreatingSave } = useMutation({
    mutationKey: ["create save"],
    mutationFn: () => SaveService.save(postId),
    onSuccess: async () => {
      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_CURRENT_USER_SAVES]);

      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_INFINITE_POSTS]);

      //@ts-ignore

      await queryClient.invalidateQueries([QUERY_KEYS.GET_POST_BY_ID, postId]);
    },
  });

  const { mutate: deleteSave, isPending: isDeletingSave } = useMutation({
    mutationKey: ["delete save"],
    mutationFn: (saveId: string) => SaveService.delete(saveId),
    onSuccess: async () => {
      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_CURRENT_USER_SAVES]);

      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_INFINITE_POSTS]);

      //@ts-ignore

      await queryClient.invalidateQueries([QUERY_KEYS.GET_POST_BY_ID, postId]);
    },
  });

  useEffect(() => {
    if (isCreatingSave || isDeletingSave) return;
    //@ts-ignore
    const isHasSave = saves.some((s) => s?.userId === user?._id);
    if (isSave !== isHasSave) setIsSave(isHasSave);
  }, [isSave]);

  const onSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSave) {
      //@ts-ignore
      const save = saves.find((l) => l.userId === user?._id);
      if (!save) return;
      setIsSave(false);

      deleteSave(save._id);
    } else {
      setIsSave(true);

      createSave();
    }
  };

  return useMemo(
    () => ({
      onSave,
      isSave,
      isLoading: isCreatingSave || isDeletingSave,
    }),
    [isSave, onSave, isCreatingSave, isDeletingSave]
  );
};
