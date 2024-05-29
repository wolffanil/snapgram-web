import { useCallback, useState } from "react";
import { IProfileUploader } from "./profileUploader.interface";
import { FileWithPath, useDropzone } from "react-dropzone";
import { convertFileToUrl, getMedia } from "../../../../utils";

const ProfileUploader = ({ fieldChange, mediaUrl }: IProfileUploader) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="cursor-pointer flex-center gap-4 ">
        <img
          src={getMedia(fileUrl) || getMedia("upload/profile/default.svg")}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-[#0095f6] small-regular md:bbase-semibold">
          Изменить фотографию профиля
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;
